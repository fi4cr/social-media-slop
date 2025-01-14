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
