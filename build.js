const fs = require('fs').promises;
const path = require('path');
const { processPostFile } = require('./server.js');

async function buildSite() {
    // Create dist directory if it doesn't exist
    await fs.mkdir('dist', { recursive: true });
    
    // Copy public directory to dist
    await fs.cp('public', 'dist', { recursive: true });
    
    // Process all posts and generate JSON files
    const postsDir = path.join(__dirname, 'posts');
    const files = await fs.readdir(postsDir);
    const txtFiles = files.filter(file => file.endsWith('.txt'));
    
    const posts = [];
    for (const txtFile of txtFiles) {
        const post = await processPostFile(txtFile);
        if (post) {
            posts.push(post);
        }
    }
    
    // Sort posts by date
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate posts.json
    await fs.writeFile(
        path.join('dist', 'posts.json'),
        JSON.stringify(posts, null, 2)
    );
    
    console.log('Build completed successfully!');
}

buildSite().catch(console.error); 