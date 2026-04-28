#!/bin/bash
# ========================================
# Wedding Invitation - Automated Deployment Script
# ========================================
# Usage: ./deploy-to-production.sh
# 
# Prerequisites:
# - Server dengan Node.js 18+, MySQL, Nginx
# - SSH access ke server
# - PM2 installed globally
#
# This script handles:
# 1. Database backup
# 2. Code deployment
# 3. Dependencies installation
# 4. Application build
# 5. PM2 restart
# 6. Health check

set -e  # Exit on any error

# ========================================
# Configuration
# ========================================

PROD_SERVER="${PROD_SERVER:-production-server}"
PROD_USER="${PROD_USER:-miftah}"
PROD_PATH="/opt/wedding-invitation"
APP_NAME="wedding-invitation-prod"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ========================================
# Functions
# ========================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ========================================
# Pre-flight Checks
# ========================================

log_info "Starting deployment process..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    log_error ".env.production not found!"
    log_info "Copy from .env.production.example and update values"
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    log_warn "Uncommitted changes detected"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

log_info "Pre-flight checks passed ✓"

# ========================================
# Step 1: Database Backup
# ========================================

log_info "Step 1: Creating database backup..."

BACKUP_DIR="$HOME/backups/wedding-invitation-prod"
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/pre-deploy-$(date +%Y%m%d_%H%M%S).sql"

# Note: Replace password if different
ssh "$PROD_USER@$PROD_SERVER" << EOF
    DB_PASS=\$(grep DB_PASSWORD /opt/wedding-invitation/.env.production | cut -d= -f2)
    mysqldump -u wedding_user -p"\$DB_PASS" wedding_db_prod > "$BACKUP_FILE"
    echo "Backup created: $BACKUP_FILE"
EOF

log_info "Database backup completed ✓"

# ========================================
# Step 2: Code Deployment
# ========================================

log_info "Step 2: Deploying code to production..."

# Push to git (if using git-based deployment)
git push origin main

# Deploy to production
ssh "$PROD_USER@$PROD_SERVER" << EOF
    cd $PROD_PATH
    git pull origin main
    log_info "Code updated ✓"
EOF

log_info "Code deployed ✓"

# ========================================
# Step 3: Build Application
# ========================================

log_info "Step 3: Building application..."

ssh "$PROD_USER@$PROD_SERVER" << EOF
    cd $PROD_PATH
    
    # Install dependencies
    npm ci --production
    
    # Build
    npm run build
    
    # Verify build
    if [ -d build ]; then
        echo "Build completed successfully"
    else
        echo "Build FAILED" >&2
        exit 1
    fi
EOF

log_info "Application built ✓"

# ========================================
# Step 4: Restart PM2
# ========================================

log_info "Step 4: Restarting PM2 process..."

ssh "$PROD_USER@$PROD_SERVER" << EOF
    pm2 restart $APP_NAME
    sleep 3
    pm2 show $APP_NAME | grep -E "status|uptime|memory"
EOF

log_info "PM2 restarted ✓"

# ========================================
# Step 5: Health Check
# ========================================

log_info "Step 5: Running health check..."

# Wait for service to start
sleep 5

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://wedding.example.com/api/health)

if [ "$HEALTH_CHECK" = "200" ]; then
    log_info "Health check passed ✓"
else
    log_error "Health check failed (HTTP $HEALTH_CHECK)"
    log_warn "Check logs with: pm2 logs $APP_NAME"
    exit 1
fi

# ========================================
# Step 6: Post-Deployment Summary
# ========================================

log_info ""
log_info "========================================="
log_info "Deployment completed successfully! ✓"
log_info "========================================="
log_info ""

# Get current status
ssh "$PROD_USER@$PROD_SERVER" << EOF
    echo "Current PM2 status:"
    pm2 show $APP_NAME | grep -E "status|uptime|memory|restarts"
    echo ""
    echo "Recent logs:"
    pm2 logs $APP_NAME --lines 10 --nostream
EOF

log_info ""
log_info "Production URL: https://wedding.example.com"
log_info "Dashboard: https://wedding.example.com/admin"
log_info ""

log_warn "Remind:"
log_warn "1. Test payment flow with test card"
log_warn "2. Verify database integrity"
log_warn "3. Monitor logs for next 30 minutes"
log_warn "4. Keep backup file: $BACKUP_FILE"

log_info ""
log_info "Deployment complete!"
