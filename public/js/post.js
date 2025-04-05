// Function to format content with HTML tags
function formatContent(content) {
    // Replace double line breaks with paragraph tags
    content = content.replace(/\n\n/g, '</p><p>');
    
    // Replace single line breaks with <br>
    content = content.replace(/\n/g, '<br>');
    
    // Replace markdown headers
    content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Replace code blocks
    content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Replace inline code
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Replace bold and italic
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Replace lists
    content = content.replace(/^\s*[-*]\s+(.*$)/gm, '<li>$1</li>');
    content = content.replace(/^\s*\d+\.\s+(.*$)/gm, '<li>$1</li>');
    
    // Wrap in paragraph tags
    return `<p>${content}</p>`;
}

// Function to update recent posts in sidebar
async function updateRecentPosts() {
    try {
        const response = await fetch('/api/posts?page=1');
        const data = await response.json();
        const recentPostsList = document.getElementById('recent-posts');
        
        // Sort posts by date and get the 5 most recent
        const recentPosts = data.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        recentPostsList.innerHTML = recentPosts
            .map(post => {
                const title = post.title.length > 20 
                    ? post.title.substring(0, 20) + '...' 
                    : post.title;
                return `<li><a href="/post/${post.id}">${title}</a></li>`;
            })
            .join('');
    } catch (error) {
        console.error('Error fetching recent posts:', error);
    }
}

// Load the post when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    const postContainer = document.getElementById('post-container');
    const postId = window.location.pathname.split('/').pop();
    
    try {
        // Fetch the post from the server
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        const post = await response.json();
        
        // Set the page title
        document.title = `${post.title} - My Blog`;
        
        // Format the date
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create tags HTML if tags exist
        let tagsHtml = '';
        if (post.tags && post.tags.length > 0) {
            tagsHtml = '<div class="post-tags">' + 
                post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') +
                '</div>';
        }
        
        // Format the content
        const formattedContent = formatContent(post.content);
        
        // Display the post
        postContainer.innerHTML = `
            <article class="post full-post">
                <h2 class="post-title">${post.title}</h2>
                <div class="post-meta">
                    Posted on ${formattedDate} by ${post.author}
                    ${tagsHtml}
                </div>
                <div class="post-content">${formattedContent}</div>
            </article>
        `;
        
        // Update recent posts in sidebar
        await updateRecentPosts();
    } catch (error) {
        console.error('Error fetching post:', error);
        postContainer.innerHTML = '<div class="error">Post not found or failed to load.</div>';
    }
}); 