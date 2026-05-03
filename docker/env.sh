#!/bin/sh
# Runtime environment variable injection for Vite SPA
# This replaces placeholder values in the built JS files with actual env vars at container startup

# Only process if env vars are set
if [ -n "$VITE_API_BASE_URL" ]; then
    echo "Injecting runtime environment variables..."
    
    # Find all JS files and replace the build-time placeholders
    find /usr/share/nginx/html/assets -name '*.js' -exec sed -i \
        "s|__VITE_API_BASE_URL__|${VITE_API_BASE_URL}|g" {} \;
    find /usr/share/nginx/html/assets -name '*.js' -exec sed -i \
        "s|__VITE_REVERB_APP_KEY__|${VITE_REVERB_APP_KEY}|g" {} \;
    find /usr/share/nginx/html/assets -name '*.js' -exec sed -i \
        "s|__VITE_REVERB_HOST__|${VITE_REVERB_HOST}|g" {} \;
    find /usr/share/nginx/html/assets -name '*.js' -exec sed -i \
        "s|__VITE_REVERB_PORT__|${VITE_REVERB_PORT}|g" {} \;
    find /usr/share/nginx/html/assets -name '*.js' -exec sed -i \
        "s|__VITE_REVERB_SCHEME__|${VITE_REVERB_SCHEME}|g" {} \;

    echo "Environment variables injected successfully!"
fi
