#!/bin/bash

echo "Running migrations..."
php artisan migrate --force

echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Deployment complete!"
