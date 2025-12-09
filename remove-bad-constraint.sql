-- Remove the incorrectly added foreign key constraint
-- The session_reviews table already has the correct user_id reference to auth.users(id)
-- We don't need an additional FK to user_profiles

ALTER TABLE session_reviews
DROP CONSTRAINT IF EXISTS fk_reviews_user_profile;
