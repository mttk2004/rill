# Deployment Strategy - Rill

## Tổng quan
Tài liệu này mô tả chiến lược triển khai và cấu hình production cho Rill MVP.

---

## 1. Infrastructure Requirements

### 1.1 Server Specifications (Minimum)
```
Production Server:
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- Bandwidth: 100Mbps
- OS: Ubuntu 22.04 LTS

Database Server:
- CPU: 2 cores
- RAM: 4GB
- Storage: 100GB SSD
- MySQL 8.0 hoặc MariaDB 10.6+
```

### 1.2 Recommended Hosting Providers
```
Budget Options (MVP):
- DigitalOcean Droplet ($24/month)
- Linode Nanode ($12/month)
- Vultr Regular ($12/month)

Managed Options:
- Laravel Forge + DigitalOcean
- Ploi + Vultr
- Laravel Vapor (AWS)
```

---

## 2. Environment Setup

### 2.1 Production Environment Variables
```env
APP_NAME="Rill"
APP_ENV=production
APP_KEY=base64:generated_key
APP_DEBUG=false
APP_URL=https://rill.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rill_production
DB_USERNAME=rill_user
DB_PASSWORD=secure_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your_mailgun_username
MAIL_PASSWORD=your_mailgun_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@rill.com
MAIL_FROM_NAME="Rill"

SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_PATH=/
SESSION_DOMAIN=.rill.com

CACHE_DRIVER=redis
QUEUE_CONNECTION=database

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 2.2 Security Configuration
```php
// config/app.php
'debug' => env('APP_DEBUG', false),
'url' => env('APP_URL', 'https://rill.com'),

// config/session.php
'lifetime' => env('SESSION_LIFETIME', 120),
'secure' => env('SESSION_SECURE_COOKIE', true),
'http_only' => true,
'same_site' => 'lax',
```

---

## 3. Deployment Process

### 3.1 Automated Deployment với Laravel Forge
```bash
# 1. Setup Forge server
forge server create --provider=digitalocean --size=2gb

# 2. Install Laravel site
forge site create rill.com --database=rill_production

# 3. Configure deployment script
forge deploy rill.com
```

### 3.2 Manual Deployment Steps
```bash
# 1. Clone repository
git clone https://github.com/your-org/rill.git
cd rill

# 2. Install dependencies
composer install --optimize-autoloader --no-dev
npm ci && npm run build

# 3. Environment setup
cp .env.example .env
php artisan key:generate

# 4. Database setup
php artisan migrate --force
php artisan db:seed --force

# 5. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

---

## 4. Database Management

### 4.1 Production Database Setup
```sql
-- Create database
CREATE DATABASE rill_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'rill_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON rill_production.* TO 'rill_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4.2 Backup Strategy
```bash
# Daily automated backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u rill_user -p rill_production > /backups/rill_$DATE.sql
gzip /backups/rill_$DATE.sql

# Keep only last 7 days
find /backups -name "rill_*.sql.gz" -mtime +7 -delete
```

---

## 5. SSL & Domain Configuration

### 5.1 SSL Certificate
```bash
# Using Let's Encrypt (Certbot)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d rill.com -d www.rill.com
```

### 5.2 Nginx Configuration
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name rill.com www.rill.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rill.com www.rill.com;
    root /home/forge/rill.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 6. Monitoring & Logging

### 6.1 Application Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Laravel Telescope (development only)
composer require laravel/telescope --dev
php artisan telescope:install
```

### 6.2 Log Management
```bash
# Log rotation
sudo nano /etc/logrotate.d/laravel

# Content:
/home/forge/rill.com/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 forge forge
}
```

---

## 7. Performance Optimization

### 7.1 PHP-FPM Configuration
```ini
; /etc/php/8.2/fpm/pool.d/www.conf
pm = dynamic
pm.max_children = 20
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 10
pm.max_requests = 1000
```

### 7.2 MySQL Optimization
```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 100
query_cache_size = 64M
query_cache_type = 1
```

---

## 8. Backup & Recovery

### 8.1 Automated Backup Script
```bash
#!/bin/bash
# /home/forge/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/forge/backups"
SITE_DIR="/home/forge/rill.com"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u rill_user -p rill_production > $BACKUP_DIR/db_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C $SITE_DIR .

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/db_$DATE.sql s3://rill-backups/
# aws s3 cp $BACKUP_DIR/files_$DATE.tar.gz s3://rill-backups/

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 8.2 Recovery Process
```bash
# Database recovery
mysql -u rill_user -p rill_production < /backups/db_20240101_120000.sql

# Files recovery
tar -xzf /backups/files_20240101_120000.tar.gz -C /home/forge/rill.com/
```

---

## 9. Security Checklist

### 9.1 Server Security
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] Fail2ban installed
- [ ] SSL certificate valid
- [ ] Database user with limited privileges

### 9.2 Application Security
- [ ] APP_DEBUG=false
- [ ] Strong APP_KEY generated
- [ ] Database credentials secure
- [ ] File permissions correct (755/644)
- [ ] .env file not accessible via web
- [ ] CSRF protection enabled
- [ ] XSS protection headers

---

## 10. Maintenance Tasks

### 10.1 Daily Tasks
```bash
# Check disk space
df -h

# Check application logs
tail -f /home/forge/rill.com/storage/logs/laravel.log

# Monitor database
mysql -u rill_user -p -e "SHOW PROCESSLIST;"
```

### 10.2 Weekly Tasks
```bash
# Update packages
sudo apt update && sudo apt upgrade

# Clear Laravel caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Optimize database
mysql -u rill_user -p -e "OPTIMIZE TABLE products, orders, users;"
```

---

## 11. Scaling Considerations (Phase 2)

### 11.1 Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple application servers
- Database read replicas
- Redis for session storage
- CDN for static assets

### 11.2 Vertical Scaling
- Increase server resources
- Database optimization
- Application caching
- Image optimization
- Code optimization

---

*Tài liệu này cung cấp hướng dẫn cơ bản cho việc triển khai MVP. Các tối ưu hóa nâng cao sẽ được thêm vào Phase 2.*
