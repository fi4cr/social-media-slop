# Social Media Post Generator

This script uses the Anthropic Claude API to generate realistic social media posts and automatically updates the feed.jsx file with the new content.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your Anthropic API key to your .bashrc file:
```bash
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

3. Run the generator:
```bash
npm run generate
```

## What it does

The script will:
1. Connect to the Claude API and generate 4 new social media posts
2. Each post will include:
   - Username and avatar
   - Timestamp
   - Caption with emojis and hashtags
   - Image description (starting with "Photo of")
   - Likes, comments, and shares
3. Automatically update the feed.jsx file with the new posts
4. Automatically generate an image for the post using Flux and a LORA for realism


