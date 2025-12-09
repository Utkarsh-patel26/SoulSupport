-- ============================================
-- FIX RLS POLICIES FOR USER PROFILES
-- Run this in Supabase SQL Editor to fix the "Cannot read properties of null" error
-- ============================================

-- The error happens because the current RLS policy only allows users to view THEIR OWN profile.
-- When the "Find Therapists" page tries to load other therapists' names, RLS blocks it, returning null.

-- 1. Drop the restrictive policy if it exists (to avoid confusion, though OR logic applies)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- 2. Create a new policy that allows ANYONE to view user profiles
-- This is necessary for:
--   a) The Therapist Directory (to see therapist names/photos)
--   b) The Forum (to see post author names)
CREATE POLICY "Anyone can view user profiles"
    ON user_profiles FOR SELECT
    USING (true);
