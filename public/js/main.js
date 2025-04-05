document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const paginationContainer = document.getElementById('pagination-container');
    
    // Get current page from URL
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;
    
    // If we're on a /page/X route, get the page number from there
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'page' && pathParts[2]) {
        currentPage = parseInt(pathParts[2]);
    }
    
    // Fetch posts for the current page
    fetchPosts(currentPage);
    
    async function fetchPosts(page = 1) {
        try {
            const response = await fetch(`/api/posts?page=${page}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            
            const data = await response.json();
            const posts = data.posts;
            
            // Update recent posts in sidebar
            updateRecentPosts(posts);
            
            // Clear existing posts
            postsContainer.innerHTML = '';
            
            // Display each post
            posts.forEach(post => {
                const postElement = document.createElement('article');
                // Add full-post class only when viewing a single post
                const isSinglePost = window.location.pathname.startsWith('/post/');
                postElement.className = isSinglePost ? 'post full-post' : 'post';
                
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
                
                // Add Read More link if we're on the main page and the post has more content
                let readMoreHtml = '';
                if (!isSinglePost && post.content.length > 500) {
                    readMoreHtml = `<p class="read-more"><a href="/post/${post.id}">Read More...</a></p>`;
                }
                
                // Format content only for full post view
                const content = isSinglePost ? formatContent(post.content) : post.content;
                
                postElement.innerHTML = `
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-meta">
                        Posted on ${formattedDate} by ${post.author}
                        ${tagsHtml}
                    </div>
                    ${post.image ? `<div class="post-image-container"><img src="${post.image}" alt="${post.title}" class="post-image"></div>` : ''}
                    <div class="post-content">${content}</div>
                    ${readMoreHtml}
                `;
                
                postsContainer.appendChild(postElement);
            });
            
            // Update pagination
            updatePagination(data.pagination);
            
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = `<div class="error">Error loading posts. Please try again later.</div>`;
        }
    }
    
    function updatePagination(pagination) {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        
        if (pagination.totalPages <= 1) {
            return; // No need for pagination if there's only one page
        }
        
        const paginationElement = document.createElement('div');
        paginationElement.className = 'pagination';
        
        let paginationHTML = '<ul>';
        
        // Previous page link
        if (pagination.hasPrevPage) {
            paginationHTML += `<li><a href="/page/${pagination.prevPage}" class="page-link">← Previous</a></li>`;
        } else {
            paginationHTML += `<li><span class="page-link disabled">← Previous</span></li>`;
        }
        
        // Page numbers
        // Show at most 5 page numbers around the current page
        const pageStart = Math.max(1, pagination.page - 2);
        const pageEnd = Math.min(pagination.totalPages, pagination.page + 2);
        
        if (pageStart > 1) {
            paginationHTML += `<li><a href="/" class="page-link">1</a></li>`;
            if (pageStart > 2) {
                paginationHTML += `<li><span class="page-ellipsis">...</span></li>`;
            }
        }
        
        for (let i = pageStart; i <= pageEnd; i++) {
            if (i === pagination.page) {
                paginationHTML += `<li><span class="page-link current">${i}</span></li>`;
            } else {
                const href = i === 1 ? '/' : `/page/${i}`;
                paginationHTML += `<li><a href="${href}" class="page-link">${i}</a></li>`;
            }
        }
        
        if (pageEnd < pagination.totalPages) {
            if (pageEnd < pagination.totalPages - 1) {
                paginationHTML += `<li><span class="page-ellipsis">...</span></li>`;
            }
            paginationHTML += `<li><a href="/page/${pagination.totalPages}" class="page-link">${pagination.totalPages}</a></li>`;
        }
        
        // Next page link
        if (pagination.hasNextPage) {
            paginationHTML += `<li><a href="/page/${pagination.nextPage}" class="page-link">Next →</a></li>`;
        } else {
            paginationHTML += `<li><span class="page-link disabled">Next →</span></li>`;
        }
        
        paginationHTML += '</ul>';
        paginationElement.innerHTML = paginationHTML;
        
        paginationContainer.appendChild(paginationElement);
    }

    function formatContent(content) {
        // Split content into paragraphs
        let paragraphs = content.split('\n\n');
        
        // Process each paragraph
        paragraphs = paragraphs.map(paragraph => {
            // Trim whitespace
            paragraph = paragraph.trim();
            
            // Skip empty paragraphs
            if (!paragraph) return '';
            
            // Handle headers
            if (paragraph.startsWith('## ')) {
                return `<h2>${paragraph.substring(3)}</h2>`;
            }
            
            // Handle code blocks
            if (paragraph.startsWith('```')) {
                const codeContent = paragraph.substring(3, paragraph.length - 3).trim();
                return `<pre><code>${codeContent}</code></pre>`;
            }
            
            // Handle lists
            if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').map(item => {
                    if (item.startsWith('- ')) {
                        return `<li>${formatInline(item.substring(2))}</li>`;
                    }
                    return '';
                }).filter(item => item);
                return `<ul>${items.join('')}</ul>`;
            }
            
            // Handle inline formatting
            paragraph = formatInline(paragraph);
            
            // Basic paragraph
            return `<p>${paragraph}</p>`;
        });
        
        // Join paragraphs
        return paragraphs.join('\n');
    }

    function formatInline(text) {
        // Handle bold (**text**)
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic (*text*)
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Handle links [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Handle inline images ![alt](url)
        text = text.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-image">');
        
        return text;
    }

    function updateRecentPosts(posts) {
        const recentPostsList = document.getElementById('recent-posts');
        if (!recentPostsList) return;
        
        // Sort posts by date, newest first
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Take the 5 most recent posts
        const recentPosts = sortedPosts.slice(0, 5);
        
        // Clear existing content
        recentPostsList.innerHTML = '';
        
        // Add recent posts to the list
        recentPosts.forEach(post => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `/post/${post.id}`;
            // Truncate title to 20 characters and add ellipsis if needed
            a.textContent = post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title;
            li.appendChild(a);
            recentPostsList.appendChild(li);
        });
    }
});
