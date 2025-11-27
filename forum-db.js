// ============================================
// FORUM DATABASE FUNCTIONS
// Handles saving and fetching forum posts and comments from Supabase
// ============================================

// Create a new forum post
async function createForumPost(content, category, isAnonymous = true) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in to post');
        }

        const { data, error } = await supabase
            .from('forum_posts')
            .insert([
                {
                    user_id: user.id,
                    content: content,
                    category: category,
                    is_anonymous: isAnonymous
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return { success: true, post: data };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
    }
}

// Fetch all forum posts
async function fetchForumPosts(category = null) {
    try {
        let query = supabase
            .from('forum_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, posts: data };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { success: false, error: error.message };
    }
}

// Create a comment on a post
async function createForumComment(postId, content, isAnonymous = true) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in to comment');
        }

        const { data, error } = await supabase
            .from('forum_comments')
            .insert([
                {
                    post_id: postId,
                    user_id: user.id,
                    content: content,
                    is_anonymous: isAnonymous
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return { success: true, comment: data };
    } catch (error) {
        console.error('Error creating comment:', error);
        return { success: false, error: error.message };
    }
}

// Fetch comments for a post
async function fetchPostComments(postId) {
    try {
        const { data, error } = await supabase
            .from('forum_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return { success: true, comments: data };
    } catch (error) {
        console.error('Error fetching comments:', error);
        return { success: false, error: error.message };
    }
}

// Like a post
async function likePost(postId) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in to like posts');
        }

        const { data, error } = await supabase
            .from('post_likes')
            .insert([
                {
                    post_id: postId,
                    user_id: user.id
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return { success: true, like: data };
    } catch (error) {
        console.error('Error liking post:', error);
        return { success: false, error: error.message };
    }
}

// Unlike a post
async function unlikePost(postId) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in to unlike posts');
        }

        const { error } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error unliking post:', error);
        return { success: false, error: error.message };
    }
}

// Check if user has liked a post
async function hasUserLikedPost(postId) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: true, hasLiked: false };
        }

        const { data, error } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
            throw error;
        }

        return { success: true, hasLiked: !!data };
    } catch (error) {
        console.error('Error checking like status:', error);
        return { success: false, error: error.message };
    }
}
