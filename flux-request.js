/**
 * Usage:
 * 1. Make sure you have the FAL_KEY in your environment
 * 2. Run the script with a prompt:
 *    node flux-request.js "your prompt here"
 * 
 * Example:
 *    node flux-request.js "A house party"
 */

import { fal } from "@fal-ai/client";
import { writeFile } from 'node:fs/promises';
import { get } from 'node:https';
import { join } from 'node:path';

// Configure fal client with key from environment variable
fal.config({ credentials: process.env.FAL_KEY });

// Default configuration
const defaultConfig = {
  image_size: "landscape_4_3",
  num_images: 1,
  output_format: "jpeg",
  guidance_scale: 3.5,
  num_inference_steps: 28,
  enable_safety_checker: true,
  loras: [
    {
      path: "https://civitai.com/api/download/models/993999?type=Model&format=SafeTensor"
    }
  ]
};

// Function to download image
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        await writeFile(filepath, buffer);
        console.log(`Image downloaded to: ${filepath}`);
        resolve();
      });
    }).on('error', reject);
  });
}

// Function to sanitize prompt for filename
function sanitizePrompt(prompt, maxLength = 50) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, maxLength); // Limit length
}

// Main function to generate and download image
async function generateImage(prompt, config = defaultConfig) {
  const result = await fal.subscribe("fal-ai/flux-lora", {
    input: {
      prompt,
      ...config
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });

  console.log(result.data);
  console.log("Request ID:", result.requestId);

  // Download the generated image
  if (result.data.images?.[0]?.url) {
    const sanitizedPrompt = sanitizePrompt(prompt);
    const imagePath = join(process.cwd(), `${sanitizedPrompt}-${result.requestId}.jpg`);
    await downloadImage(result.data.images[0].url, imagePath);
    return imagePath;
  } else {
    console.error("No image URL found in the response");
    return null;
  }
}

// Get prompt from command line arguments or use default
const prompt = process.argv[2] || "A house party";

// Run the generator with default config including LORA
generateImage(prompt).catch(console.error);
