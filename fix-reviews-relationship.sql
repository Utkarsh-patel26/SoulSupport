-- The session_reviews table already has user_id referencing auth.users(id)
-- We don't need an additional FK to user_profiles since user_profiles.id also references auth.users(id)
-- The join will work through the auth.users relationship

-- This file is no longer needed - the original schema is correct
-- Just use this query pattern in therapist-db.js:
-- user_profile:user_profiles(full_name, avatar_url)
