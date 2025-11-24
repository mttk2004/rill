#!/bin/bash

# Start queue worker in background
php artisan queue:work database --tries=3 --timeout=90 --sleep=3 --max-jobs=1000 &

# Start web server in foreground
php artisan serve --host=0.0.0.0 --port=$PORT
