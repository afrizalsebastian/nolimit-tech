#!/bin/sh

echo "Waiting for database to be ready..."
/app/wait-for-it.sh database:3306 -t 60

echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec npm run start