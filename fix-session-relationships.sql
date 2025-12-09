-- ============================================
-- FIX SESSION RELATIONSHIPS FOR DASHBOARDS
-- Run this in Supabase SQL Editor to fix the "fetching sessions" issue
-- ============================================

-- 1. Add Foreign Key from sessions.user_id to user_profiles.user_id
-- This allows fetching Client details (Name, Email) for the Therapist Dashboard
ALTER TABLE sessions
ADD CONSTRAINT fk_sessions_client_profile
FOREIGN KEY (user_id)
REFERENCES user_profiles(user_id);

-- 2. Add Foreign Key from sessions.therapist_id to user_profiles.user_id
-- This allows fetching Therapist Name for the User Dashboard
ALTER TABLE sessions
ADD CONSTRAINT fk_sessions_therapist_user_profile
FOREIGN KEY (therapist_id)
REFERENCES user_profiles(user_id);

-- 3. Add Foreign Key from sessions.therapist_id to therapist_profiles.user_id
-- This allows fetching Therapist Photo/Details for the User Dashboard
ALTER TABLE sessions
ADD CONSTRAINT fk_sessions_therapist_details
FOREIGN KEY (therapist_id)
REFERENCES therapist_profiles(user_id);
