# BetterLyf - Setup Instructions

## Step 1: Setup Supabase Database

1. **Login to Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Login to your account
   - Navigate to your project: `https://zioiyxmawceadcsxrffj.supabase.co`

2. **Run the Database Schema**
   - In your Supabase dashboard, click on "SQL Editor" in the left sidebar
   - Click on "New Query"
   - Open the file `supabase-schema.sql` from your project folder
   - Copy ALL the contents of `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema

3. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `user_profiles`
     - `forum_posts`
     - `forum_comments`
     - `post_likes`

4. **Enable Email Authentication**
   - Go to "Authentication" > "Providers"
   - Make sure "Email" provider is enabled
   - Configure email templates if needed (optional)

## Step 2: Test Your Website

1. **Open the Website**
   - Open `index.html` in your browser
   - You can use a local server (recommended) or open directly

2. **Create a Test Account**
   - Click on "Login" in the navigation bar
   - Switch to "Sign Up" tab
   - Select user type (User or Therapist)
   - Fill in:
     - Full Name: Your name
     - Email: your-email@example.com
     - Password: At least 6 characters
     - Confirm Password: Same password
   - Click "Create Account"

3. **Verify Email (if required)**
   - Supabase may send a confirmation email
   - Check your email inbox and click the verification link
   - If email confirmation is disabled, you can skip this step

4. **Login to Dashboard**
   - After signup, you'll be redirected to your dashboard
   - **Users** will see: "Hello, Welcome!" dashboard
   - **Therapists** will see: "Hello, Therapist!" dashboard

5. **Test Forum**
   - Navigate to "Community" in the navigation bar
   - **Important**: You must be logged in to create posts
   - Try creating a post:
     - Select a category (Anxiety, Depression, etc.)
     - Write some content
     - Click "Post"
   - The post will be saved to Supabase database
   - Try liking posts and adding comments

## Step 3: Verify Database

1. **Check User Profile**
   - Go to Supabase dashboard > Table Editor > `user_profiles`
   - You should see your user profile with:
     - full_name
     - email
     - user_type (user or therapist)

2. **Check Forum Posts** (if you created any)
   - Go to Table Editor > `forum_posts`
   - You should see your posts with:
     - content
     - category
     - likes_count
     - comments_count

## Troubleshooting

### Issue: Login/Signup not working
- **Solution**: Open browser console (F12) and check for errors
- Verify Supabase credentials are correct in `supabase-client.js`
- Check if database schema was run successfully

### Issue: "Must be logged in" error when posting
- **Solution**: Make sure you're logged in
- Try logging out and logging back in
- Check browser console for authentication errors

### Issue: Posts not showing up
- **Solution**:
  - Verify the `forum_posts` table exists in Supabase
  - Check Row Level Security policies are enabled
  - Open browser console and check for database errors

### Issue: Email confirmation required
- **Solution**:
  - Go to Supabase dashboard > Authentication > Settings
  - Toggle "Enable email confirmations" OFF for testing
  - Or check your email for confirmation link

## File Structure

```
d:\dbms\
├── index.html              # Home page
├── about.html              # About page
├── resources.html          # Resources page
├── forum.html              # Community forum
├── auth.html               # Login/Signup page
├── user-dashboard.html     # User dashboard
├── therapist-dashboard.html # Therapist dashboard
├── style.css               # Global styles
├── script.js               # Global scripts
├── supabase-client.js      # Supabase configuration & auth functions
├── forum-db.js             # Forum database functions (optional)
└── supabase-schema.sql     # Database schema
```

## Authentication Flow

1. **Signup Process**:
   - User fills signup form
   - Supabase creates auth user
   - User profile is created in `user_profiles` table
   - User is redirected to appropriate dashboard

2. **Login Process**:
   - User fills login form
   - Supabase authenticates user
   - User profile is fetched from database
   - User is redirected based on `user_type`

3. **Persistent Login**:
   - Supabase automatically maintains session
   - Session persists across page navigation
   - Session expires after timeout or logout

4. **Protected Routes**:
   - Dashboard pages check authentication
   - If not logged in, redirects to auth.html

## Next Steps

After successful setup:

1. **Customize**:
   - Update colors in `style.css`
   - Add your own content and images
   - Customize email templates in Supabase

2. **Extend Forum**:
   - The forum currently works with local JavaScript
   - To fully integrate with database, update `forum.html` to use `forum-db.js` functions

3. **Add Features**:
   - User profile editing
   - Therapist-client messaging
   - Appointment scheduling
   - Payment integration

## Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Verify Supabase project is active
3. Ensure all SQL queries ran successfully
4. Check Row Level Security policies are correct

## Security Notes

- Never expose your Supabase `service_role` key in client-side code
- The `anon` key is safe to use in the browser
- Row Level Security (RLS) policies protect your data
- All database operations require authentication (except viewing posts)
