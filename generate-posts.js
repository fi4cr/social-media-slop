import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import { existsSync } from 'node:fs';
import { rename } from 'node:fs/promises';
import { join } from 'node:path';
import { generateImage } from './flux-request.js';
import { execSync } from 'child_process';

// Get environment variables from bashrc
const getEnvVar = (name) => {
  try {
    const value = execSync(`source ~/.bashrc && echo $${name}`, { shell: '/bin/bash' })
      .toString()
      .trim();
    if (!value) {
      throw new Error(`${name} not found in .bashrc`);
    }
    return value;
  } catch (error) {
    console.error(`Error getting ${name}:`, error.message);
    process.exit(1);
  }
};

// Get API keys
const ANTHROPIC_API_KEY = getEnvVar('ANTHROPIC_API_KEY');
const FAL_KEY = getEnvVar('FAL_KEY');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// Set FAL key for image generation
process.env.FAL_KEY = FAL_KEY;

const PROMPT = `Generate an array of 4 social media posts in valid JSON format. The posts should be about: people doing chores with messy surroundings.

Return ONLY the JSON array with no additional text or markdown formatting. Each post object must follow this exact structure:
[
  {
    "id": number,
    "author": string,
    "avatar": string (2 letter initials),
    "timestamp": string (e.g. "2 hrs ago"),
    "content": string (include emojis and hashtags),
    "image": string (filename starting with "photo-of-"),
    "imageDescription": string (must start with "Photo of"),
    "likes": number (between 50-200),
    "comments": [
      {
        "id": number,
        "author": string,
        "avatar": string (2 letter initials),
        "content": string,
        "timestamp": string
      }
    ],
    "shares": number
  }
]

Make the posts feel authentic and engaging with realistic interactions. Ensure all image filenames start with "photo-of-" and all image descriptions start with "Photo of". All images must contain people.`;

async function generatePosts() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: PROMPT
        }
      ]
    });

    // Extract the generated posts from the response
    const generatedContent = response.content[0].text;
    
    // Clean up the response to ensure it's valid JSON
    let cleanContent = generatedContent;
    // Remove any markdown code block markers if present
    cleanContent = cleanContent.replace(/```(javascript|json)?\n?/g, '');
    cleanContent = cleanContent.replace(/```\n?/g, '');
    // Ensure the content is wrapped in square brackets if it isn't already
    if (!cleanContent.trim().startsWith('[')) {
      cleanContent = `[${cleanContent}]`;
    }
    
    // Try to parse the JSON
    let posts;
    try {
      posts = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      console.log('Raw response:', generatedContent);
      throw new Error('Failed to parse Claude response into valid JSON');
    }

    // Validate the posts structure
    if (!Array.isArray(posts)) {
      throw new Error('Expected posts to be an array');
    }

    // Read the existing feed.jsx file
    const feedPath = 'src/feed.jsx';
    let feedContent = await fs.readFile(feedPath, 'utf8');

    // Find the initialPosts array
    const postsStartIndex = feedContent.indexOf('const initialPosts = [');
    const postsEndIndex = feedContent.indexOf('];', postsStartIndex) + 1;

    // Replace the existing posts with the new generated posts
    const newFeedContent = 
      feedContent.substring(0, postsStartIndex) +
      'const initialPosts = ' +
      JSON.stringify(posts, null, 2) +
      feedContent.substring(postsEndIndex);

    // Write the updated content back to feed.jsx
    await fs.writeFile(feedPath, newFeedContent, 'utf8');

    console.log('Successfully generated and updated posts!');
    return posts;
  } catch (error) {
    console.error('Error generating posts:', error);
    return null;
  }
}

async function generateImages(posts) {
  console.log("Generating images for posts...");
  
  for (const post of posts) {
    const filename = post.image;
    const publicPath = join(process.cwd(), 'public', filename);
    
    // Check if image already exists
    if (existsSync(publicPath)) {
      console.log(`Image ${filename} already exists, skipping...`);
      continue;
    }
    
    // Extract the description without the "Photo of" prefix
    const prompt = post.imageDescription.replace(/^Photo of /, '');
    
    console.log(`Generating image: ${filename}`);
    try {
      // Generate the image
      const generatedPath = await generateImage(prompt);
      
      if (generatedPath) {
        // Move to public directory
        await rename(generatedPath, publicPath);
        console.log(`Successfully generated and moved ${filename} to public directory`);
      }
    } catch (error) {
      console.error(`Failed to generate ${filename}:`, error);
    }
  }
  
  console.log("Image generation complete!");
}

// Run the scripts
async function main() {
  try {
    const posts = await generatePosts();
    if (posts) {
      await generateImages(posts);
    }
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main().catch(console.error);
