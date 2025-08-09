# ToyResaleWizard Production Runbook

## Overview
Production operations guide for ToyResaleWizard deployment, monitoring, and troubleshooting.

## Health Checks & Monitoring

### Endpoints
- `GET /healthz` - Liveness probe (returns 200 if app is running)
- `GET /readyz` - Readiness probe (includes database connectivity)
- `GET /health` - Detailed status with service configuration

### Expected Responses
```json
// /healthz
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0"
}

// /readyz  
{
  "status": "ready",
  "services": {
    "database": "connected",
    "ai_service": "configured",
    "marketplace": "configured"
  }
}
```

## Environment Configuration

### Critical Environment Variables
```bash
# Required
DATABASE_URL=postgresql://...
VITE_API_BASE=https://api.toyresalewizard.com
SESSION_SECRET=32char_minimum_secret

# Provider Configuration
ANALYSIS_PROVIDER=openai|mock
PRICING_PROVIDER=market_api|mock
EMAIL_PROVIDER=smtp|mock
PAYMENTS_PROVIDER=stripe|mock

# Feature Flags
USE_MOCK_AI=false
USE_MOCK_MARKETPLACE=false
USE_MOCK_EMAIL=false
USE_MOCK_PAYMENTS=false
```

### Rotating Secrets
1. **Session Secret:** Can be rotated without user impact
2. **API Keys:** Update provider keys in environment and restart
3. **Database Password:** Update connection string and restart

## Common Issues & Solutions

### Application Won't Start
**Symptoms:** Process exits immediately or port binding fails

**Check:**
```bash
# Verify environment
curl http://localhost:5000/healthz

# Check logs for specific errors
pm2 logs toyresalewizard  # if using PM2
docker logs container_name  # if using Docker
```

**Solutions:**
- Verify `PORT` environment variable (default: 5000)
- Check database connectivity with `DATABASE_URL`
- Ensure all required environment variables are set

### Database Connection Issues
**Symptoms:** `/readyz` returns 503, "database": "disconnected"

**Check:**
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Verify connection string format
echo $DATABASE_URL
```

**Solutions:**
- Verify PostgreSQL server is running
- Check firewall rules for database port
- Validate connection string format
- Check database user permissions

### WebSocket Connection Failures
**Symptoms:** Mobile apps show "disconnected", real-time features not working

**Check:**
```bash
# Test WebSocket endpoint
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: test" \
  http://localhost:5000/ws/api
```

**Solutions:**
- Verify WebSocket path `/ws/api` is accessible
- Check reverse proxy WebSocket configuration
- Ensure firewall allows WebSocket connections

### AI Service Failures
**Symptoms:** Scan results show "analysis failed", provider errors in logs

**Check:**
```bash
# Verify provider configuration
curl http://localhost:5000/health | jq '.providers'

# Test with mock mode
USE_MOCK_AI=true npm start
```

**Solutions:**
- Verify `OPENAI_API_KEY` is valid and has credits
- Check API rate limits and quotas
- Enable mock mode temporarily: `USE_MOCK_AI=true`
- Review OpenAI service status

### File Upload Issues
**Symptoms:** Image uploads fail, camera scanning not working

**Check:**
- Verify `uploads/` directory exists and is writable
- Check file size limits (default: 10MB)
- Verify image format support (JPEG, PNG, WebP)

**Solutions:**
```bash
# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Check disk space
df -h

# Verify multer configuration in server/routes.ts
```

## Deployment Procedures

### Standard Deployment
```bash
# 1. Build application
npm run build

# 2. Run database migrations (if needed)
npm run db:push

# 3. Start production server
NODE_ENV=production npm start

# 4. Verify health
curl https://api.toyresalewizard.com/healthz
```

### Zero-Downtime Deployment
```bash
# 1. Build new version
npm run build

# 2. Start new instance on different port
PORT=5001 NODE_ENV=production npm start &

# 3. Health check new instance
curl http://localhost:5001/healthz

# 4. Update load balancer to new instance
# 5. Stop old instance
```

### Database Migrations
```bash
# Push schema changes
npm run db:push

# Verify migration
npm run db:migrate:status
```

## Monitoring & Alerting

### Key Metrics to Monitor
- **Health check status** (200 responses)
- **Database connection** (readiness probe)
- **Response times** (< 2s for API calls)
- **Error rates** (< 1% for core endpoints)
- **WebSocket connections** (active connections count)

### Log Monitoring
```bash
# Application logs
tail -f /var/log/toyresalewizard/app.log

# Error patterns to watch
grep -i "error\|failed\|exception" /var/log/toyresalewizard/app.log

# Database connection errors
grep "database" /var/log/toyresalewizard/app.log
```

### Performance Monitoring
- **CPU usage** < 80%
- **Memory usage** < 85%
- **Disk usage** < 90%
- **Database connections** < pool limit

## Scaling Considerations

### Horizontal Scaling
- **Stateless design** - session data in database
- **Load balancer** required for multiple instances
- **WebSocket sticky sessions** may be needed

### Database Scaling
- **Connection pooling** configured in Drizzle
- **Read replicas** for heavy read workloads
- **Index optimization** for large datasets

## Security Checklist

### Regular Security Tasks
- [ ] Rotate API keys quarterly
- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Backup database daily

### Access Control
- API endpoints require authentication
- File uploads are validated and restricted
- Rate limiting configured for all endpoints

## Backup & Recovery

### Database Backup
```bash
# Daily backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250101.sql
```

### File Backup
```bash
# Backup uploaded files
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

## Support Contacts

- **Engineering:** engineering@toyresalewizard.com
- **Operations:** ops@toyresalewizard.com  
- **Emergency:** +1-555-0123 (on-call rotation)

## Version History

- **v1.0.0** - Initial production release
- **v1.0.1** - Bug fixes and performance improvements