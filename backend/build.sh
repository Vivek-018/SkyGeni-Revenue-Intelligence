#!/bin/bash
set -e

echo "Installing dependencies with npm..."
npm install

echo "Building TypeScript..."
npm run build

echo "Build complete!"
