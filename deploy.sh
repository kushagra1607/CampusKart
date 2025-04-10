#!/bin/bash

# Install dependencies
npm install

# Build frontend
npm run build

# Deploy to Netlify
netlify deploy --prod

# Output the URL
echo "Your application is now live at:"
netlify sites:list
