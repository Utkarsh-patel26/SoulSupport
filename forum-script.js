// ============================================
// BETTERLYF FORUM - SUPABASE CONNECTED
// All posts, comments, and likes are stored in Supabase
// ============================================

let posts = []; // In-memory cache (reloaded from Supabase)
let selectedCategory = 'general';
let currentFilter = 'all';

// ============================================
// CATEGORY SELECTION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Category Selection
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.dataset.category;
        });
    });

    // Initial load from Supabase
    loadPosts();
});

// ============================================
// LOAD POSTS FROM SUPABASE
// ============================================
async function loadPosts() {
    try {
        // Fetch posts from Supabase based on current filter
        const category = currentFilter === 'all' ? null : currentFilter;
        const result = await fetchForumPosts(category);

        if (!result.success) {
            console.error('Error loading posts:', result.error);
            renderPosts(); // Render empty state
            return;
        }

        // Transform Supabase posts into frontend format
        posts = [];

        for (const dbPost of result.posts) {
            // Fetch comments for each post
            const commentsResult = await fetchPostComments(dbPost.id);
            const comments = commentsResult.success ? commentsResult.comments : [];

            // Transform to frontend format
            const post = {
                id: dbPost.id,
                text: dbPost.content,
                category: dbPost.category,
                likes: dbPost.likes_count || 0,
                timestamp: new Date(dbPost.created_at).toLocaleString(),
                commentsVisible: false,
                comments: comments.map(c => ({
                    id: c.id,
                    text: c.content,
                    timestamp: new Date(c.created_at).toLocaleTimeString()
                }))
            };

            posts.push(post);
        }

        renderPosts();
    } catch (error) {
        console.error('Error in loadPosts:', error);
        renderPosts();
    }
}

// ============================================
// ADD POST (SAVES TO SUPABASE)
// ============================================
async function addPost() {
    const text = document.getElementById("postInput").value.trim();
    if (!text) {
        alert('Please write something before posting!');
        return;
    }

    // Check if user is logged in
    const user = await getCurrentUser();
    if (!user) {
        alert('You must be logged in to post!');
        window.location.href = 'auth.html';
        return;
    }

    // Create post in Supabase
    const result = await createForumPost(text, selectedCategory, true);

    if (!result.success) {
        alert('Error creating post: ' + result.error);
        return;
    }

    // Clear input
    document.getElementById("postInput").value = "";

    // Reset category to general
    document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-category="general"]').classList.add('active');
    selectedCategory = 'general';

    // Reload posts from Supabase
    await loadPosts();
}

// ============================================
// ADD COMMENT (SAVES TO SUPABASE)
// ============================================
async function addComment(postId) {
    const input = document.getElementById(`commentInput-${postId}`);
    const text = input.value.trim();
    if (!text) return;

    // Check if user is logged in
    const user = await getCurrentUser();
    if (!user) {
        alert('You must be logged in to comment!');
        window.location.href = 'auth.html';
        return;
    }

    // Create comment in Supabase
    const result = await createForumComment(postId, text, true);

    if (!result.success) {
        alert('Error adding comment: ' + result.error);
        return;
    }

    // Clear input
    input.value = "";

    // Reload posts to show new comment
    await loadPosts();
}

// ============================================
// TOGGLE COMMENTS VISIBILITY
// ============================================
function toggleComments(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.commentsVisible = !post.commentsVisible;
        renderPosts();
    }
}

// ============================================
// LIKE POST (SAVES TO SUPABASE)
// ============================================
async function handleLikePost(postId) {
    // Check if user is logged in
    const user = await getCurrentUser();
    if (!user) {
        alert('You must be logged in to like posts!');
        window.location.href = 'auth.html';
        return;
    }

    // Like post in Supabase
    const result = await likePost(postId);

    if (!result.success) {
        console.error('Error liking post:', result.error);
        // If error is duplicate (user already liked), try unliking
        if (result.error.includes('duplicate') || result.error.includes('unique')) {
            const unlikeResult = await unlikePost(postId);
            if (unlikeResult.success) {
                await loadPosts();
            }
        }
        return;
    }

    // Reload posts to update like count
    await loadPosts();
}

// ============================================
// FILTER POSTS BY CATEGORY
// ============================================
function filterPosts(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadPosts(); // Reload with filter from Supabase
}

// ============================================
// GET CATEGORY ICON
// ============================================
function getCategoryIcon(category) {
    const icons = {
        general: 'fa-comment-dots',
        anxiety: 'fa-heartbeat',
        depression: 'fa-cloud-rain',
        relationships: 'fa-heart',
        stress: 'fa-brain',
        success: 'fa-trophy'
    };
    return icons[category] || 'fa-comment';
}

// ============================================
// RENDER POSTS (UI ONLY - DATA FROM loadPosts)
// ============================================
function renderPosts() {
    const container = document.getElementById("posts");

    if (!container) {
        console.error('Posts container not found');
        return;
    }

    let filteredPosts = posts;
    if (currentFilter !== 'all') {
        filteredPosts = posts.filter(p => p.category === currentFilter);
    }

    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <h3>No posts found</h3>
                <p>Be the first to start a conversation in this category!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    filteredPosts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post-card";

        const commentsSection = post.commentsVisible ? `
            <div class="comments-section">
                <h4 style="margin-bottom: 15px; color: var(--text-dark);">
                    <i class="fas fa-comments"></i> Comments (${post.comments.length})
                </h4>
                <div class="comment-form">
                    <input
                        id="commentInput-${post.id}"
                        class="comment-input"
                        placeholder="Write a supportive comment..."
                    />
                    <button class="comment-btn" onclick="addComment('${post.id}')">
                        <i class="fas fa-paper-plane"></i> Send
                    </button>
                </div>
                <div class="comments-list">
                    ${post.comments.map(c => `
                        <div class="comment">
                            <div class="comment-header">
                                <span class="comment-author">Anonymous</span>
                                <span class="comment-time">${c.timestamp}</span>
                            </div>
                            <div class="comment-text">${c.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        div.innerHTML = `
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-category">
                        <i class="fas ${getCategoryIcon(post.category)}"></i>
                        ${post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                    <span><i class="far fa-clock"></i> ${post.timestamp}</span>
                </div>
            </div>
            <div class="post-content">${post.text}</div>
            <div class="post-actions">
                <button class="post-action-btn ${post.likes > 0 ? 'active' : ''}" onclick="handleLikePost('${post.id}')">
                    <i class="fas fa-heart"></i> ${post.likes > 0 ? post.likes : 'Support'}
                </button>
                <button class="post-action-btn ${post.commentsVisible ? 'active' : ''}" onclick="toggleComments('${post.id}')">
                    <i class="fas fa-comment"></i> ${post.comments.length} Comments
                </button>
            </div>
            ${commentsSection}
        `;

        container.appendChild(div);
    });
}
