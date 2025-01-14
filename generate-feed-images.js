import { existsSync } from 'node:fs';
import { rename } from 'node:fs/promises';
import { join } from 'node:path';
import { generateImage } from './flux-request.js';

const loraConfig = {
  loras: [
    {
      path: "https://civitai.com/api/download/models/993999?type=Model&format=SafeTensor"
    }
  ]
};

const imageConfigs = [
  {
    prompt: "A slightly lopsided but golden brown sourdough bread loaf cooling on a wire rack",
    filename: "homemade-sourdough-bread.jpg"
  },
  {
    prompt: "A clean desk with a laptop, notebook, and coffee mug neatly arranged with a small plant in the corner",
    filename: "organized-desk-setup.jpg"
  },
  {
    prompt: "A golden retriever sniffing at some sidewalk flowers while a hand holds a coffee cup in the background",
    filename: "dog-smelling-flowers.jpg"
  }
];

async function generateFeedImages() {
  console.log("Checking and generating feed images...");
  
  for (const config of imageConfigs) {
    const publicPath = join(process.cwd(), 'public', config.filename);
    
    // Check if image already exists
    if (existsSync(publicPath)) {
      console.log(`Image ${config.filename} already exists, skipping...`);
      continue;
    }
    
    console.log(`Generating image: ${config.filename}`);
    try {
      // Generate the image
      const generatedPath = await generateImage(config.prompt);
      
      if (generatedPath) {
        // Move to public directory
        await rename(generatedPath, publicPath);
        console.log(`Successfully generated and moved ${config.filename} to public directory`);
      }
    } catch (error) {
      console.error(`Failed to generate ${config.filename}:`, error);
    }
  }
  
  console.log("Image generation complete!");
}

// Run the generator
generateFeedImages().catch(console.error);
