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
        // ✅ DEBUG: Verify userType parameter received
        console.log('=== SIGNUP DEBUG ===');
        console.log('signUpUser() received userType:', userType);
        console.log('signUpUser() received fullName:', fullName);
        console.log('signUpUser() received email:', email);

        // 1. Create user in Supabase Auth with metadata
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

        if (authError) {
            console.error('Auth signup error:', authError);
            throw authError;
        }

        if (!authData.user) {
            throw new Error('User creation failed - no user returned from auth');
        }

        console.log('✅ User created in auth system:', authData.user.id);
        console.log('User metadata saved:', authData.user.user_metadata);

        // 2. ALWAYS insert into user_profiles (for ALL users)
        console.log('Inserting into user_profiles table...');
        const { data: userProfileData, error: userProfileError } = await supabase
            .from('user_profiles')
            .insert({
                user_id: authData.user.id,
                full_name: fullName,
                email: email,
                user_type: userType,
                avatar_url: null,
                bio: null
            })
            .select()
            .single();

        if (userProfileError) {
            console.error('❌ user_profiles insert error:', userProfileError);
            throw new Error(`Failed to create user profile: ${userProfileError.message}`);
        }

        console.log('✅ user_profiles row created:', userProfileData);

        // 3. If therapist, ALSO insert into therapist_profiles
        if (userType === 'therapist') {
            console.log('User is therapist - inserting into therapist_profiles...');

            const { data: therapistProfileData, error: therapistProfileError } = await supabase
                .from('therapist_profiles')
                .insert({
                    user_id: authData.user.id,
                    specializations: [],
                    qualifications: null,
                    experience_years: 0,
                    hourly_rate: null,
                    available_days: [],
                    available_time_start: null,
                    available_time_end: null,
                    bio: null,
                    photo_url: null
                })
                .select()
                .single();

            if (therapistProfileError) {
                console.error('❌ therapist_profiles insert error:', therapistProfileError);
                throw new Error(`Failed to create therapist profile: ${therapistProfileError.message}`);
            }

            console.log('✅ therapist_profiles row created:', therapistProfileData);
        }

        console.log('✅ ALL PROFILES CREATED SUCCESSFULLY');

        return {
            success: true,
            user: authData.user,
            userProfile: userProfileData,
            message: authData.session
                ? `Account created successfully as ${userType}!`
                : 'Account created! Please check your email to confirm before logging in.'
        };

    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred during signup'
        };
    }
}

// Sign in user
async function signInUser(email, password) {
    try {
        console.log('=== LOGIN DEBUG ===');

        // 1. Authenticate with password
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (authError) throw authError;

        if (!authData.user) {
            throw new Error('Authentication failed - no user returned');
        }

        const user = authData.user;
        console.log('✅ User authenticated:', user.id);
        console.log('User metadata:', user.user_metadata);

        // 2. Check if user_profiles exists (required for ALL users)
        console.log('Checking for user_profiles row...');
        const { data: userProfile, error: profileCheckError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (profileCheckError) {
            console.error('❌ Error checking user_profiles:', profileCheckError);
            throw new Error(`Database error: ${profileCheckError.message}`);
        }

        // 3. Profile MUST exist - if not, signup was incomplete
        if (!userProfile) {
            console.error('❌ No user_profiles row found for user:', user.id);
            throw new Error('Profile not found. Please contact support or sign up again.');
        }

        console.log('✅ user_profiles row found:', userProfile);

        // 4. If therapist, verify therapist_profiles also exists
        if (userProfile.user_type === 'therapist') {
            console.log('User is therapist - checking therapist_profiles...');

            const { data: therapistProfile, error: therapistCheckError } = await supabase
                .from('therapist_profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (therapistCheckError) {
                console.error('❌ Error checking therapist_profiles:', therapistCheckError);
            }

            if (!therapistProfile) {
                console.warn('⚠️ Warning: therapist_profiles row missing for therapist user');
            } else {
                console.log('✅ therapist_profiles row found:', therapistProfile);
            }
        }

        console.log('✅ Login successful - all profiles verified');
        return { success: true, user: authData.user };

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
