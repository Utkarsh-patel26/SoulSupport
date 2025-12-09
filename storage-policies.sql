-- ============================================
-- STORAGE POLICIES FOR THERAPIST PROFILE PICS
-- Run this in Supabase SQL Editor to fix the "row-level security policy" error
-- ============================================

-- 1. Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('therapist_profile_pics', 'therapist_profile_pics', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public access to view photos (SELECT)
-- This allows anyone to see the therapist profile photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'therapist_profile_pics' );

-- 3. Allow authenticated users to upload photos (INSERT)
-- This fixes the "new row violates row-level security policy" error during upload
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'therapist_profile_pics'
  AND auth.role() = 'authenticated'
);

-- 4. Allow users to update their own photos (UPDATE)
CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'therapist_profile_pics'
  AND auth.uid() = owner
);

-- 5. Allow users to delete their own photos (DELETE)
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'therapist_profile_pics'
  AND auth.uid() = owner
);
