#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  sleep 2
done

echo "✅ Database is ready"

echo "🚀 Running migrations..."
node database/migrations/run.js

echo "🌱 Running seed data..."
node database/seeds/seed.js

echo "✅ Migrations & seeds completed"

echo "🔥 Starting backend server..."
node src/server.js
