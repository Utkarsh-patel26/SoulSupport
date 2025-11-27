-- ============================================
-- SOULSUPPORT DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. USER PROFILES TABLE
-- Stores additional user information beyond Supabase Auth
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('user', 'therapist')),
    email TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. FORUM POSTS TABLE
-- Stores all forum/community posts
-- ============================================
CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('general', 'anxiety', 'depression', 'relationships', 'stress', 'success')),
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);

-- Enable RLS
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_posts
CREATE POLICY "Anyone can view posts"
    ON forum_posts FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create posts"
    ON forum_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
    ON forum_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
    ON forum_posts FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 3. FORUM COMMENTS TABLE
-- Stores comments on forum posts
-- ============================================
CREATE TABLE IF NOT EXISTS forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX idx_forum_comments_created_at ON forum_comments(created_at DESC);

-- Enable RLS
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_comments
CREATE POLICY "Anyone can view comments"
    ON forum_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON forum_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON forum_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON forum_comments FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 4. POST LIKES TABLE
-- Tracks which users liked which posts
-- ============================================
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create indexes
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- Enable RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_likes
CREATE POLICY "Anyone can view likes"
    ON post_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can like posts"
    ON post_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
    ON post_likes FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 5. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
    BEFORE UPDATE ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_comments_updated_at
    BEFORE UPDATE ON forum_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update comment count on forum posts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_posts
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_posts
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

-- Trigger to update comment count
CREATE TRIGGER update_comment_count_on_insert
    AFTER INSERT ON forum_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_comment_count();

CREATE TRIGGER update_comment_count_on_delete
    AFTER DELETE ON forum_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_comment_count();

-- Function to update likes count on forum posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_posts
        SET likes_count = likes_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_posts
        SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

-- Trigger to update likes count
CREATE TRIGGER update_likes_count_on_insert
    AFTER INSERT ON post_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER update_likes_count_on_delete
    AFTER DELETE ON post_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_post_likes_count();

-- ============================================
-- 6. SAMPLE DATA (OPTIONAL - for testing)
-- ============================================

-- You can add sample data after users sign up
-- Example:
-- INSERT INTO forum_posts (user_id, category, content, is_anonymous)
-- VALUES
--     (auth.uid(), 'general', 'Welcome to SoulSupport community!', true);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Run this entire SQL script in Supabase SQL Editor
-- 2. Go to Authentication > Providers and enable Email provider
-- 3. Configure email templates if needed
-- 4. Test the authentication flow in your application
