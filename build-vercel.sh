#!/bin/bash
echo "Building for Vercel deployment..."

# Build the frontend
echo "Building frontend..."
npm run build

echo "Vercel build completed!"