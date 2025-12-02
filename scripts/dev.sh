#!/usr/bin/env bash
# Startup script for Restaurant Rating Website local development
# This script starts Supabase, Edge Functions, and the frontend dev server

set -e

echo "🚀 Starting Restaurant Rating Website..."
echo ""

# Check if Supabase is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

# Start Supabase (if not already running)
echo "📦 Starting Supabase local stack..."
supabase start || echo "Supabase already running"
echo ""

# Serve Edge Functions
echo "⚡ Starting Edge Functions..."
pkill -f "supabase functions serve" 2>/dev/null || true
sleep 1
supabase functions serve --no-verify-jwt > /tmp/supabase-functions.log 2>&1 &
FUNCTIONS_PID=$!
echo "   Functions PID: $FUNCTIONS_PID"
sleep 3
echo ""

# Test backend
echo "🧪 Testing backend connection..."
if curl -s "http://127.0.0.1:54321/functions/v1/get-restaurants?limit=1" > /dev/null; then
    echo "   ✅ Backend is responding"
else
    echo "   ❌ Backend not responding. Check /tmp/supabase-functions.log"
    exit 1
fi
echo ""

# Start frontend dev server
echo "🎨 Starting frontend dev server..."
echo "   Opening http://localhost:3000"
echo ""
npm run dev

# Cleanup on exit
trap "echo ''; echo 'Shutting down...'; kill $FUNCTIONS_PID 2>/dev/null || true" EXIT
