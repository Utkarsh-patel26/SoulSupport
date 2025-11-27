// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://zioiyxmawceadcsxrffj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppb2l5eG1hd2NlYWRjc3hyZmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTI4NzIsImV4cCI6MjA3OTgyODg3Mn0.p1utjRtEBaTC_Kt9f7RM1DR4S20ENPc73srlLBLh64g';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// AUTHENTICATION HELPERS
// ============================================

// Get current user
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Get user profile from database
async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    return data;
}

// Sign up new user
async function signUpUser(email, password, fullName, userType) {
    try {
        // 1. Sign up user with Supabase Auth
        // Store full_name and user_type in user_metadata for later profile creation
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    user_type: userType
                }
            }
        });

        if (authError) throw authError;

        // Check if user was created successfully
        if (!authData.user) {
            throw new Error('User creation failed');
        }

        // Check if email confirmation is required
        if (authData.session === null) {
            // Email confirmation is enabled - user needs to verify email first
            // Profile will be created during first login
            return {
                success: true,
                needsConfirmation: true,
                message: 'Please check your email to confirm your account before logging in.'
            };
        }

        // 2. Session exists - user is authenticated immediately (no email confirmation)
        // Create user profile now
        const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
                user_id: authData.user.id,  // This matches auth.uid()
                full_name: fullName,
                email: email,
                user_type: userType
            });

        if (profileError) {
            console.error('Profile creation error:', profileError);
            throw profileError;
        }

        return { success: true, user: authData.user };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }
}

// Sign in user
async function signInUser(email, password) {
    try {
        // Step A: Authenticate user with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (authError) throw authError;

        // Verify user was authenticated
        if (!authData.user) {
            throw new Error('Authentication failed - no user returned');
        }

        const user = authData.user;

        // Step B: Check if user profile exists in user_profiles table
        const { data: existingProfile, error: profileCheckError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (profileCheckError) {
            console.error('Error checking profile:', profileCheckError);
            throw profileCheckError;
        }

        // Step C: If profile doesn't exist, create it
        // This happens when user signed up with email confirmation enabled
        if (!existingProfile) {
            console.log('Profile not found, creating new profile...');

            // Get user data from metadata (stored during signup) or use defaults
            const fullName = user.user_metadata?.full_name || 'User';
            const userType = user.user_metadata?.user_type || 'user';

            // Insert new profile - RLS allows this because auth.uid() = user.id
            const { error: insertError } = await supabase
                .from('user_profiles')
                .insert({
                    user_id: user.id,           // Matches auth.uid()
                    full_name: fullName,        // From signup metadata
                    email: user.email,          // From auth user
                    user_type: userType         // From signup metadata
                });

            if (insertError) {
                console.error('Error creating profile:', insertError);
                throw insertError;
            }

            console.log('Profile created successfully');
        }

        // Step D: Return success with user data
        return { success: true, user: user };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Sign out user
async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// Check if user is authenticated (for protected routes)
async function checkAuth() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'auth.html';
        return null;
    }
    return user;
}

// Redirect based on user type
async function redirectToDashboard(userId) {
    const profile = await getUserProfile(userId);
    if (profile) {
        if (profile.user_type === 'therapist') {
            window.location.href = 'therapist-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    }
}
