# Deployment Guide

This guide covers deploying the Event Management Platform to production using Vercel and Supabase.

## Prerequisites

- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- [GitHub Account](https://github.com) (for CI/CD)
- Domain name (optional)

## 1. Supabase Setup

### Create Production Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `event-management-production`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users

### Configure Database

1. Run the migration files in order:
   ```sql
   -- Copy content from supabase/migrations/001_initial_schema.sql
   -- Copy content from supabase/migrations/002_rls_policies.sql
   ```

2. Configure Storage:
   - Go to Storage > Buckets
   - Create bucket: `event-files`
   - Set as public bucket
   - Configure RLS policies for the bucket

### Configure Authentication

1. Go to Authentication > Settings
2. Configure Site URL: `https://your-domain.vercel.app`
3. Configure Redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
4. Enable OAuth providers (optional):
   - GitHub: Add Client ID and Secret
   - Google: Add Client ID and Secret

## 2. Vercel Deployment

### Initial Setup

1. Fork/clone this repository to your GitHub account
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Environment Variables

Add these environment variables in Vercel Dashboard:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

## 3. CI/CD Setup

### GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to Repository Settings > Secrets and Variables > Actions
2. Add the following secrets:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create new token with appropriate scope
3. Copy token to GitHub secrets

### Organization and Project IDs

Find these in your Vercel project settings or by running:
```bash
npx vercel link
cat .vercel/project.json
```

## 4. Database Migrations

### Production Migration

1. Connect to your production Supabase project
2. Run migrations in order:
   ```bash
   # Use Supabase CLI or Dashboard SQL Editor
   supabase db push --db-url "your_production_db_url"
   ```

### Backup Strategy

1. Enable Point-in-Time Recovery in Supabase
2. Set up automated backups
3. Test restore procedures

## 5. Monitoring & Analytics

### Performance Monitoring

- Vercel Analytics: Automatically enabled
- Web Vitals: Implemented in the app
- Lighthouse CI: Runs on every deployment

### Error Monitoring

Optional: Set up Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

### Health Checks

The app includes a health check endpoint:
- URL: `https://your-domain.vercel.app/api/health`
- Monitor this endpoint for uptime

## 6. Security Checklist

- [ ] Environment variables are properly set
- [ ] RLS policies are enabled on all tables
- [ ] CORS is properly configured
- [ ] Security headers are set (via vercel.json)
- [ ] Authentication is working correctly
- [ ] File upload permissions are restricted
- [ ] API rate limiting is considered

## 7. Post-Deployment

### Testing

1. Test all major user flows:
   - User registration/login
   - Event creation
   - Ticket purchasing
   - File uploads
   - Real-time features

2. Test performance:
   - Run Lighthouse audits
   - Check Core Web Vitals
   - Test on different devices

### Monitoring

1. Set up uptime monitoring
2. Monitor error rates
3. Track performance metrics
4. Monitor database usage

## 8. Scaling Considerations

### Database

- Monitor connection limits
- Consider read replicas for high traffic
- Optimize queries with indexes

### Storage

- Monitor storage usage
- Consider CDN for file delivery
- Implement file cleanup policies

### Compute

- Monitor function execution times
- Consider edge functions for global performance
- Implement caching strategies

## 9. Maintenance

### Regular Tasks

- Update dependencies monthly
- Review security advisories
- Monitor performance metrics
- Backup verification
- Database maintenance

### Updates

1. Test in staging environment
2. Run automated tests
3. Deploy during low-traffic periods
4. Monitor post-deployment

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify dependencies
   - Check TypeScript errors

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Verify network connectivity

3. **Authentication Issues**
   - Check redirect URLs
   - Verify OAuth configuration
   - Check site URL configuration

### Support

- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
