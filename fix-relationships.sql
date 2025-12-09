-- ============================================
-- FIX RELATIONSHIPS FOR THERAPIST SEARCH
-- Run this in Supabase SQL Editor to fix the "no matches were found" error
-- ============================================

-- 1. Add explicit foreign key from therapist_profiles to user_profiles
-- This allows PostgREST to understand the relationship between the two tables
-- and enables the join query: therapist_profiles.select(..., user_profiles(...))

ALTER TABLE therapist_profiles
ADD CONSTRAINT fk_therapist_user_profiles
FOREIGN KEY (user_id)
REFERENCES user_profiles(user_id)
ON DELETE CASCADE;

-- 2. Ensure user_profiles has a unique constraint on user_id (it should already, but just in case)
-- This is required for it to be referenced by a foreign key
-- ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
