// ============================================
// NAVBAR AUTHENTICATION HANDLER
// Updates navbar based on authentication state
// Include this on all pages after supabase-client.js
// ============================================

// Initialize navbar authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    await updateNavbarAuth();
});

// Update navbar based on authentication state
async function updateNavbarAuth() {
    try {
        // Get current user session
        const { data: { user } } = await supabase.auth.getUser();

        // Get navbar buttons container
        const navButtons = document.querySelector('.nav-buttons');

        if (!navButtons) return;

        if (user) {
            // User is logged in - show Dashboard + Logout buttons
            const profile = await getUserProfile(user.id);
            const dashboardUrl = profile?.user_type === 'therapist'
                ? 'therapist-dashboard.html'
                : 'user-dashboard.html';

            navButtons.innerHTML = `
                <a href="${dashboardUrl}" class="btn btn-secondary">Dashboard</a>
                <button onclick="handleNavbarLogout()" class="btn btn-primary">Logout</button>
            `;
        } else {
            // User is not logged in - show Login button
            navButtons.innerHTML = `
                <a href="auth.html" class="btn btn-primary">Login</a>
            `;
        }
    } catch (error) {
        console.error('Error updating navbar:', error);
    }
}

// Handle logout from navbar
async function handleNavbarLogout() {
    const result = await signOutUser();
    if (result.success) {
        window.location.href = 'index.html';
    }
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);

    // Update navbar when auth state changes
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        updateNavbarAuth();
    }
});
