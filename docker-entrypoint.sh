#!/bin/sh
set -e

echo "🌙 Starting Ramadan Tracker..."
echo "Running database migrations..."

# Run prisma migrations
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "✅ Migrations complete"
echo "Starting Next.js..."

exec node apps/web/server.js
