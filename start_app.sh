#!/bin/bash
set -e  # Exit on first error

# Load env variables
echo "💡 Loading environment variables..."
export $(grep -v '^#' .env | xargs)

DB_NAME=${DB_NAME:-sternguard}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-}
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-5432}

# Check PostgreSQL connection
echo "🔗 Checking PostgreSQL connection..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -lqt > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to PostgreSQL. Please check credentials."
    exit 1
fi

# Create database if it doesn't exist
echo "🛠️ Creating database '$DB_NAME' if it doesn't exist..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME;"

echo "🚀 Running migrations..."
npx knex migrate:latest --knexfile ./src/config/knexfile.cjs

echo "🌱 Running seed script..."
node src/seeds/seed.js

echo "🔑 Resetting admin password..."
node reset_admin_password.js

echo "🎯 Starting server..."
node server.js
