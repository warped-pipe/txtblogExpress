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
    
    function fetchPosts(page) {
        // Show loading indicator
        postsContainer.innerHTML = '<div class="loading">Loading posts...</div>';
        
        // Fetch posts from the server
        fetch(`/api/posts?page=${page}`)
            .then(response => response.json())
            .then(data => {
                const { posts, pagination } = data;
                
                // Clear loading message
                postsContainer.innerHTML = '';
                
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<div class="no-posts">No posts found</div>';
                    return;
                }
                
                // Display each post
                posts.forEach(post => {
                    const postElement = document.createElement('article');
                    postElement.className = 'post';
                    
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
                    
                    // Add Read More link if needed
                    let readMoreHtml = '';
                    if (post.hasFullPost) {
                        readMoreHtml = `<p class="read-more"><a href="/post/${post.id}">Read More...</a></p>`;
                    }
                    
                    postElement.innerHTML = `
                        <h2 class="post-title">${post.title}</h2>
                        <div class="post-meta">
                            Posted on ${formattedDate} by ${post.author}
                            ${tagsHtml}
                        </div>
                        ${post.image ? `<div class="post-image-container"><img src="${post.image}" alt="${post.title}" class="post-image"></div>` : ''}
                        <div class="post-content">${post.content}</div>
                        ${readMoreHtml}
                    `;
                    
                    postsContainer.appendChild(postElement);
                });
                
                // Create pagination
                updatePagination(pagination);
                
                // Update page title with current page info
                if (pagination.page > 1) {
                    document.title = `My Blog - Page ${pagination.page}`;
                }
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                postsContainer.innerHTML = '<div class="error">Failed to load posts. Please try again later.</div>';
            });
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
});
