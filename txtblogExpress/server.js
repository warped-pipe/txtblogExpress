const express = require('express');
const path = require('path');
const fs = require('fs').promises;


// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;



// Configuration
const WORD_COUNT_THRESHOLD = 127;
const POSTS_PER_PAGE = 10;

// Function to count words in text
function countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Function to create a preview of the content
function createPreview(content, wordCount) {
    if (wordCount <= WORD_COUNT_THRESHOLD) {
        return content;
    }
    
    const words = content.split(/\s+/);
    return words.slice(0, WORD_COUNT_THRESHOLD).join(' ') + '...';
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Get posts with pagination
app.get('/api/posts', async (req, res) => {
    try {
        // Get page number from query parameter, default to page 1
        const page = parseInt(req.query.page) || 1;
        
        const postsDir = path.join(__dirname, 'posts');
        
        // Get all files in the posts directory
        const files = await fs.readdir(postsDir);
        
        // Filter JSON files
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        // Process each JSON file and its corresponding text file
        const postsPromises = jsonFiles.map(async (jsonFile) => {
            const jsonPath = path.join(postsDir, jsonFile);
            const txtFile = jsonFile.replace('.json', '.txt');
            const txtPath = path.join(postsDir, txtFile);
            
            // Read and parse the JSON file
            const jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
            
            // Check if the corresponding text file exists
            try {
                // Read the text file content
                const txtContent = await fs.readFile(txtPath, 'utf8');
                
                // Count words in the content
                const wordCount = countWords(txtContent);
                
                // Create preview if needed
                const contentPreview = createPreview(txtContent, wordCount);
                const needsReadMore = wordCount > WORD_COUNT_THRESHOLD;
                
                // Combine JSON metadata with text content
                return {
                    ...jsonData,
                    content: contentPreview,
                    id: jsonFile.replace('.json', ''),
                    wordCount: wordCount,
                    hasFullPost: needsReadMore
                };
            } catch (err) {
                // If text file doesn't exist, use empty content
                return {
                    ...jsonData,
                    content: 'Content not found.',
                    id: jsonFile.replace('.json', ''),
                    wordCount: 0,
                    hasFullPost: false
                };
            }
        });
        
        // Wait for all post processing to complete
        let allPosts = await Promise.all(postsPromises);
        
        // Sort posts by date (newest first)
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Calculate pagination info
        const totalPosts = allPosts.length;
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        
        // Get posts for current page
        const paginatedPosts = allPosts.slice(startIndex, endIndex);
        
        // Return posts with pagination metadata
        res.json({
            posts: paginatedPosts,
            pagination: {
                page: page,
                totalPages: totalPages,
                totalPosts: totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null
            }
        });
    } catch (err) {
        console.error('Error reading posts:', err);
        res.status(500).json({ error: 'Failed to read posts' });
    }
});

// Get a single post by ID
app.get('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const jsonPath = path.join(__dirname, 'posts', `${postId}.json`);
        const txtPath = path.join(__dirname, 'posts', `${postId}.txt`);
        
        // Read and parse the JSON file
        const jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
        
        // Read the text file content
        const txtContent = await fs.readFile(txtPath, 'utf8');
        const wordCount = countWords(txtContent);
        
        // Combine JSON metadata with text content
        const post = {
            ...jsonData,
            content: txtContent,
            id: postId,
            wordCount: wordCount
        };
        
        res.json(post);
    } catch (err) {
        console.error(`Error reading post ${req.params.id}:`, err);
        res.status(404).json({ error: 'Post not found' });
    }
});

// Serve the post page for individual posts
app.get('/post/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post.html'));
});

// Serve the page route for pagination
app.get('/page/:page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
