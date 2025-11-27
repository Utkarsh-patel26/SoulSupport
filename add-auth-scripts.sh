#!/bin/bash

# Add Supabase CDN to head of about.html, resources.html, forum.html
for file in about.html resources.html forum.html; do
    # Check if Supabase script already exists
    if ! grep -q "supabase-js" "$file"; then
        # Add Supabase CDN script before </head>
        sed -i 's|</head>|    <!-- Supabase JS -->\n    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n</head>|' "$file"
        echo "Added Supabase CDN to $file"
    fi

    # Check if auth scripts already exist
    if ! grep -q "navbar-auth.js" "$file"; then
        # Add auth scripts before </body>
        sed -i 's|</body>|    <script src="supabase-client.js"></script>\n    <script src="navbar-auth.js"></script>\n</body>|' "$file"
        echo "Added auth scripts to $file"
    fi
done

echo "Authentication scripts added to all pages!"
