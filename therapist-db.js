// ============================================
// THERAPIST & SESSION DATABASE FUNCTIONS
// Handles therapist profiles, sessions, and bookings
// ============================================

// ============================================
// THERAPIST PROFILE FUNCTIONS
// ============================================

// Create or update therapist profile
async function saveTherapistProfile(profileData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in');
        }

        const { data, error } = await supabase
            .from('therapist_profiles')
            .upsert({
                user_id: user.id,
                specializations: profileData.specializations || [],
                bio: profileData.bio,
                qualifications: profileData.qualifications,
                experience_years: profileData.experience_years || 0,
                hourly_rate: profileData.hourly_rate,
                photo_url: profileData.photo_url,
                available_days: profileData.available_days || [],
                available_time_start: profileData.available_time_start,
                available_time_end: profileData.available_time_end,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;

        return { success: true, profile: data };
    } catch (error) {
        console.error('Error saving therapist profile:', error);
        return { success: false, error: error.message };
    }
}

// Get therapist profile by user ID
async function getTherapistProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('therapist_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return { success: true, profile: data };
    } catch (error) {
        console.error('Error fetching therapist profile:', error);
        return { success: false, error: error.message };
    }
}

// Get all verified therapists with their user profiles
async function getAllTherapists(filters = {}) {
    try {
        let query = supabase
            .from('therapist_profiles')
            .select(`
                id,
                user_id,
                specializations,
                qualifications,
                experience_years,
                hourly_rate,
                photo_url,
                available_days,
                available_time_start,
                available_time_end,
                rating,
                total_sessions,
                bio,
                user_profiles (
                    full_name,
                    email,
                    avatar_url
                )
            `)
            .eq('is_verified', true)
            .order('rating', { ascending: false });

        // Apply filters
        if (filters.specialization) {
            query = query.contains('specializations', [filters.specialization]);
        }

        if (filters.minRating) {
            query = query.gte('rating', filters.minRating);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, therapists: data || [] };
    } catch (error) {
        console.error('Error fetching therapists:', error);
        return { success: false, error: error.message };
    }
}

// Upload therapist photo (using Supabase Storage)
async function uploadTherapistPhoto(file) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `therapist-photos/${fileName}`;

        const { data, error } = await supabase.storage
            .from('therapist_profile_pics')
            .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('therapist_profile_pics')
            .getPublicUrl(filePath);

        return { success: true, url: urlData.publicUrl };
    } catch (error) {
        console.error('Error uploading photo:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// SESSION BOOKING FUNCTIONS
// ============================================

// Book a new session
async function bookSession(therapistId, sessionData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in to book a session');
        }

        const { data, error } = await supabase
            .from('sessions')
            .insert({
                therapist_id: therapistId,
                user_id: user.id,
                session_date: sessionData.date,
                session_time: sessionData.time,
                duration_minutes: sessionData.duration || 60,
                notes: sessionData.notes,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, session: data };
    } catch (error) {
        console.error('Error booking session:', error);
        return { success: false, error: error.message };
    }
}

// Get user's sessions
async function getUserSessions(status = null) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in');
        }

        let query = supabase
            .from('sessions')
            .select(`
                *,
                therapist_user:user_profiles!fk_sessions_therapist_user_profile(full_name, email),
                therapist_profile:therapist_profiles!fk_sessions_therapist_details(photo_url)
            `)
            .eq('user_id', user.id)
            .order('session_date', { ascending: true });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, sessions: data || [] };
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        return { success: false, error: error.message };
    }
}

// Get therapist's sessions
async function getTherapistSessions(status = null) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in');
        }

        let query = supabase
            .from('sessions')
            .select(`
                *,
                user_profile:user_profiles!fk_sessions_client_profile(full_name, email, avatar_url)
            `)
            .eq('therapist_id', user.id)
            .order('session_date', { ascending: true });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, sessions: data || [] };
    } catch (error) {
        console.error('Error fetching therapist sessions:', error);
        return { success: false, error: error.message };
    }
}

// Update session status
async function updateSessionStatus(sessionId, status) {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', sessionId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, session: data };
    } catch (error) {
        console.error('Error updating session status:', error);
        return { success: false, error: error.message };
    }
}

// Cancel a session
async function cancelSession(sessionId) {
    try {
        return await updateSessionStatus(sessionId, 'cancelled');
    } catch (error) {
        console.error('Error cancelling session:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// SESSION REVIEW FUNCTIONS
// ============================================

// Add a review for a completed session
async function addSessionReview(sessionId, therapistId, rating, reviewText) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in');
        }

        const { data, error } = await supabase
            .from('session_reviews')
            .insert({
                session_id: sessionId,
                user_id: user.id,
                therapist_id: therapistId,
                rating: rating,
                review_text: reviewText
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, review: data };
    } catch (error) {
        console.error('Error adding review:', error);
        return { success: false, error: error.message };
    }
}

// Get reviews for a therapist
async function getTherapistReviews(therapistId) {
    try {
        // If no ID provided, try to get current user
        if (!therapistId) {
            const user = await getCurrentUser();
            if (user) therapistId = user.id;
            else throw new Error('Therapist ID required');
        }

        // First get reviews
        const { data: reviews, error: reviewsError } = await supabase
            .from('session_reviews')
            .select('*')
            .eq('therapist_id', therapistId)
            .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        // Then get user profiles for each review
        if (reviews && reviews.length > 0) {
            const userIds = reviews.map(r => r.user_id);
            const { data: profiles, error: profilesError } = await supabase
                .from('user_profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

            if (profilesError) {
                console.error('Error fetching profiles:', profilesError);
            } else {
                // Map profiles to reviews
                reviews.forEach(review => {
                    review.user_profile = profiles.find(p => p.id === review.user_id);
                });
            }
        }

        return { success: true, reviews: reviews || [] };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// AVAILABILITY CHECK
// ============================================

// Check if therapist is available at a specific time
async function checkAvailability(therapistId, date, time) {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('id')
            .eq('therapist_id', therapistId)
            .eq('session_date', date)
            .eq('session_time', time)
            .neq('status', 'cancelled');

        if (error) throw error;

        return {
            success: true,
            available: !data || data.length === 0
        };
    } catch (error) {
        console.error('Error checking availability:', error);
        return { success: false, error: error.message };
    }
}
