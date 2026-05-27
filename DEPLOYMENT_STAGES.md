# Wedding Invitation - Production Deployment Stages

Tahapan lengkap untuk membawa wedding-invitation dari development ke production dengan aman.

## Stage Overview

```
Stage 1: Planning & Preparation (Week -1)
Stage 2: Development & Testing (Week 0)
Stage 3: Staging Environment (Day -1)
Stage 4: Production Deployment (Day 0 - Launch)
Stage 5: Post-Launch Monitoring (Day 1-7)
Stage 6: Stabilization (Week 1-2)
```

---

## STAGE 1: Planning & Preparation (Week -1)

### Checklist
- [ ] All features implemented and tested
- [ ] Database schema finalized
- [ ] Payment flow tested in sandbox
- [ ] UI/UX approved by stakeholders
- [ ] Production server specifications confirmed
- [ ] Domain name registered
- [ ] SSL certificate provider selected
- [ ] Database backup location secured
- [ ] Security review completed

---

## STAGE 2: Development & Testing (Week 0)

### Code Freeze
```bash
git tag -a v1.0.0-rc1 -m "Release Candidate 1"
git push origin v1.0.0-rc1
```

### Final Testing
- [ ] Smoke tests passed
- [ ] Payment flow fully tested
- [ ] Database migration tested
- [ ] Performance testing completed
- [ ] Security scanning passed

### Build Production Artifact
```bash
cd ~/wedding-invitation
npm run check
npm run build
tar -czf wedding-invitation-v1.0.0.tar.gz build/ package.json ecosystem.config.js
```

---

## STAGE 3: Staging Environment (Day -1)

### Deploy to Staging
```bash
ssh user@staging-server
cd /opt/wedding-invitation-staging
git clone https://github.com/your-repo/wedding-invitation.git .
git checkout v1.0.0-rc1
npm ci --production
npm run build
pm2 start ecosystem.config.js --name wedding-invitation-staging
```

### Full E2E Testing on Staging
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Invitation creation works
- [ ] Payment flow works (use test cards)
- [ ] Admin panel accessible
- [ ] Database queries optimized
- [ ] Logs clear and informative

---

## STAGE 4: Production Deployment (Launch Day)

### Pre-Launch Checklist (2 hours before)
- [ ] All team members on call
- [ ] Backup procedures verified
- [ ] Rollback procedure tested
- [ ] Production server resources checked
- [ ] Database backup completed
- [ ] SSL certificate valid

### Setup Production Database
```bash
mysql -u root -p
CREATE DATABASE wedding_db_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wedding_user'@'localhost' IDENTIFIED BY '<STRONG_PASSWORD>';
GRANT ALL PRIVILEGES ON wedding_db_prod.* TO 'wedding_user'@'localhost';
FLUSH PRIVILEGES;

-- Restore schema
mysqldump --no-data -u wedding_user -p'DevPassword!' wedding_db | \
  mysql -u wedding_user -p'ProdPassword!' wedding_db_prod
```

### Deploy Application
```bash
ssh user@production-server
cd /opt/wedding-invitation
git clone https://github.com/your-repo/wedding-invitation.git .
git checkout v1.0.0
cp ~/.env.production .env
npm ci --production
npm run build
pm2 start ecosystem.config.js
pm2 save
```

### Verify Production is Running
```bash
pm2 list
pm2 show wedding-invitation-prod
curl -s https://wedding.example.com/api/health | jq
pm2 logs wedding-invitation-prod --lines 20
```

---

## STAGE 5: Post-Launch Monitoring (Day 1-7)

### First 24 Hours
- Monitor page load times (target: < 2s)
- Monitor payment success rate (target: 95%+)
- Check database queries (target: < 100ms avg)
- Monitor server resources (CPU, Memory, Disk)
- Review error logs hourly
- Check all payment transactions

### Daily Tasks (Days 2-7)
```bash
pm2 show wedding-invitation-prod | grep -E "status|uptime|memory|restarts"

mysql -u wedding_user -p'ProdPassword!' wedding_db_prod << EOF
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status='success' THEN 1 ELSE 0 END) as successful,
    ROUND(100 * SUM(CASE WHEN status='success' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM payment_transactions
GROUP BY DATE(created_at)
ORDER BY date DESC;
EOF

pm2 logs wedding-invitation-prod --err --lines 100
```

### Performance Metrics to Track
- Response Time: Target < 2 seconds
- Error Rate: Target < 1%
- Payment Success Rate: Target 95%+
- Memory Usage: Target < 400MB per instance
- CPU Usage: Target < 80%

---

## STAGE 6: Stabilization (Week 1-2)

### Performance Optimization
- [ ] Analyze slow queries
- [ ] Add database indexes if needed
- [ ] Optimize images
- [ ] Enable caching headers
- [ ] Monitor CDN performance

### Security Hardening
- [ ] Review access logs
- [ ] Check for brute force attempts
- [ ] Verify rate limiting is working
- [ ] Update security headers
- [ ] Run security audit

### Team Handover
- [ ] Document all procedures
- [ ] Train support team
- [ ] Create FAQ document
- [ ] Setup automated alerts
- [ ] Establish on-call rotation

---

## Emergency Procedures

### If Payment System Goes Down

```bash
# 1. Restart application
pm2 restart wedding-invitation-prod
sleep 5
curl -s https://wedding.example.com/api/health

# 2. Check logs
pm2 logs wedding-invitation-prod --err

# 3. Check Midtrans status
# https://midtrans.com/status

# 4. Rollback if needed
git revert HEAD
npm run build
pm2 restart wedding-invitation-prod
```

### If Server Memory/CPU High

```bash
# Check what's using resources
pm2 monit
top -b -n 1 | head -20

# Restart if necessary
pm2 restart wedding-invitation-prod

# Scale up if needed
# Edit ecosystem.config.js: instances: '4'
pm2 start ecosystem.config.js
```

---

## Success Criteria

**Week 1:**
- 95%+ payment success rate
- 0 critical incidents
- < 1% error rate
- All features working
- Database integrity verified

**Week 2:**
- Team confident with new system
- No performance degradation
- All backups verified
- Documentation complete

**Month 1:**
- 100% uptime (or 99.9%+)
- Zero data loss
- User satisfaction > 95%

---

## Team Roles

| Role | Responsibilities | Contact |
|------|------------------|---------|
| Lead | Overall coordination | - |
| Backend | API, database | - |
| DevOps | Server, deployment | - |
| Support | Guest support | - |
| Manager | Communication, decisions | - |

---

## Files Reference

- `PRODUCTION_DEPLOYMENT.md` - Detailed deployment guide
- `ecosystem.config.js` - PM2 configuration
- `.env.production.example` - Environment variables template
- `deploy-to-production.sh` - Automated deployment script

---

Last Updated: 2026-04-26
Status: Ready for Deployment
