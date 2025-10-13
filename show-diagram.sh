#!/bin/bash

# Start Next.js dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to be ready
echo "Starting dev server..."
sleep 3

# Open browser
open http://localhost:3000/diagram

# Keep script running
echo "Diagram opened in browser. Press Ctrl+C to stop the dev server."
wait $DEV_PID
