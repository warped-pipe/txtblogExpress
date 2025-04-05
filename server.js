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

// Function to parse metadata from TXT file
async function parsePostMetadata(txtContent) {
    const lines = txtContent.split('\n');
    const metadata = {};
    let contentStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '---') {
            contentStartIndex = i + 1;
            break;
        }
        
        const [key, ...valueParts] = line.split(':').map(part => part.trim());
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            if (key === 'tags') {
                metadata[key] = value.split(',').map(tag => tag.trim());
            } else if (key === 'date') {
                // Convert YYYY/MM/DD to ISO string
                const [year, month, day] = value.split('/');
                metadata[key] = new Date(year, month - 1, day).toISOString();
            } else {
                metadata[key] = value;
            }
        }
    }

    const content = lines.slice(contentStartIndex).join('\n').trim();
    return { metadata, content };
}

// Function to process a single post file
async function processPostFile(txtFile) {
    const txtPath = path.join(__dirname, 'posts', txtFile);
    const jsonPath = path.join(__dirname, 'posts', txtFile.replace('.txt', '.json'));
    
    try {
        // Read the text file content
        const txtContent = await fs.readFile(txtPath, 'utf8');
        
        // Parse metadata and content
        const { metadata, content } = await parsePostMetadata(txtContent);
        
        // Ensure required fields exist
        if (!metadata.title || !metadata.author || !metadata.date) {
            throw new Error(`Missing required metadata in ${txtFile}`);
        }

        // Check if image exists in either .jpg or .png format
        if (metadata.image) {
            const imagePath = path.join(__dirname, 'public', metadata.image);
            const imagePathJpg = imagePath.replace(/\.(jpg|png)$/, '.jpg');
            const imagePathPng = imagePath.replace(/\.(jpg|png)$/, '.png');
            
            try {
                // Check if either .jpg or .png exists
                await fs.access(imagePathJpg);
                metadata.image = metadata.image.replace(/\.(jpg|png)$/, '.jpg');
            } catch {
                try {
                    await fs.access(imagePathPng);
                    metadata.image = metadata.image.replace(/\.(jpg|png)$/, '.png');
                } catch {
                    console.warn(`Image not found for ${txtFile}: ${metadata.image}`);
                    delete metadata.image;
                }
            }
        }
        
        // Write JSON file if it doesn't exist or needs updating
        try {
            const existingJson = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
            const needsUpdate = JSON.stringify(existingJson) !== JSON.stringify(metadata);
            if (needsUpdate) {
                await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2));
            }
        } catch (err) {
            // JSON file doesn't exist or is invalid, create new one
            await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2));
        }
        
        // Count words in the content
        const wordCount = countWords(content);
        
        // Create preview if needed
        const contentPreview = createPreview(content, wordCount);
        const needsReadMore = wordCount > WORD_COUNT_THRESHOLD;
        
        return {
            ...metadata,
            content: contentPreview,
            id: txtFile.replace('.txt', ''),
            wordCount: wordCount,
            hasFullPost: needsReadMore
        };
    } catch (err) {
        console.error(`Error processing ${txtFile}:`, err);
        return null;
    }
}

// Get posts with pagination
app.get('/api/posts', async (req, res) => {
    try {
        // Get page number from query parameter, default to page 1
        const page = parseInt(req.query.page) || 1;
        
        const postsDir = path.join(__dirname, 'posts');
        
        // Get all files in the posts directory
        const files = await fs.readdir(postsDir);
        
        // Filter TXT files
        const txtFiles = files.filter(file => file.endsWith('.txt'));
        
        // Process each TXT file
        const postsPromises = txtFiles.map(txtFile => processPostFile(txtFile));
        let allPosts = (await Promise.all(postsPromises)).filter(post => post !== null);
        
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
        const txtPath = path.join(__dirname, 'posts', `${postId}.txt`);
        
        // Read the text file content
        const txtContent = await fs.readFile(txtPath, 'utf8');
        
        // Parse metadata and content
        const { metadata, content } = await parsePostMetadata(txtContent);
        
        // Combine metadata with content
        const post = {
            ...metadata,
            content: content,
            id: postId,
            wordCount: countWords(content)
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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
