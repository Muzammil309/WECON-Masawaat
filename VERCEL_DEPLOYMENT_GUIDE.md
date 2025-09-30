# Vercel Deployment Guide - WECON Event Management Platform

## 📋 Overview

This guide will help you deploy the WECON Event Management Platform to Vercel with automatic deployments from GitHub.

## ✅ Prerequisites

- [x] Git repository initialized
- [x] GitHub repository: https://github.com/Muzammil309/WECON-Masawaat.git
- [x] Supabase project configured
- [ ] Vercel account (free tier is sufficient)

## 🚀 Quick Start Deployment

### Step 1: Commit Recent Changes

```powershell
# Navigate to project directory
cd "D:\event management\event-management-platform"

# Check current status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add Soft UI Dashboard components and enhanced features"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Vercel (Web Interface)

1. **Visit Vercel**: Go to [https://vercel.com](https://vercel.com)

2. **Sign In with GitHub**:
   - Click "Sign Up" or "Log In"
   - Select "Continue with GitHub"
   - Authorize Vercel to access your repositories

3. **Import Project**:
   - Click "Add New..." → "Project"
   - Find "WECON-Masawaat" in your repository list
   - Click "Import"

4. **Configure Build Settings**:
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./event-management-platform
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Node.js Version: 18.x or higher
   ```

5. **Add Environment Variables**:
   
   Click "Environment Variables" and add the following:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://umywdcihtqfullbostxo.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |

   **⚠️ Security Note**: The service role key should only be used in server-side code and API routes.

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-5 minutes for the build to complete
   - You'll receive a deployment URL (e.g., `https://wecon-masawaat.vercel.app`)

### Step 3: Configure Automatic Deployments

Vercel automatically configures continuous deployment. Verify settings:

1. Go to Project Settings → Git
2. Ensure these settings:
   - **Production Branch**: `main`
   - **Automatic Deployments**: ✅ Enabled
   - **Deploy Previews**: ✅ Enabled for all branches

**How it works**:
- Push to `main` → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Automatic preview deployment with unique URL

## 🔧 Alternative: Deploy via Vercel CLI

### Install Vercel CLI

```powershell
npm install -g vercel
```

### Login and Deploy

```powershell
# Login to Vercel
vercel login

# Navigate to project
cd "D:\event management\event-management-platform"

# Initial deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? wecon-masawaat
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Deploy to production
vercel --prod
```

## 🧪 Testing the Deployment

### Test Automatic Deployment

```powershell
# Make a small change
echo "Deployment test" > DEPLOYMENT_TEST.md

# Commit and push
git add DEPLOYMENT_TEST.md
git commit -m "test: Verify automatic deployment"
git push origin main
```

### Verify in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Deployments"
4. You should see a new deployment in progress
5. Wait for "Ready" status
6. Click the deployment to get the URL
7. Visit the URL to verify your app

### Check Deployment Logs

If deployment fails:
1. Click on the failed deployment
2. View "Build Logs" tab
3. Check for errors
4. Common issues:
   - Missing environment variables
   - Build errors in code
   - Dependency issues

## 🔐 Environment Variables Reference

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://umywdcihtqfullbostxo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional Variables (for future features)

```env
# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
```

## 📊 Monitoring Your Deployment

### Vercel Analytics

1. Go to Project → Analytics
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Deployment Status

- **Building**: Deployment in progress
- **Ready**: Successfully deployed
- **Error**: Build failed (check logs)
- **Canceled**: Deployment was canceled

## 🔄 Deployment Workflow

```
Local Changes → Git Commit → Push to GitHub → Vercel Auto-Deploy → Live Site
```

### Branch Strategy

- `main` → Production (https://your-app.vercel.app)
- `develop` → Preview (https://your-app-git-develop.vercel.app)
- `feature/*` → Preview (https://your-app-git-feature-name.vercel.app)

## 🐛 Troubleshooting

### Build Fails

**Check**:
1. Environment variables are set correctly
2. All dependencies are in `package.json`
3. Build command is correct
4. Node.js version compatibility

**Solution**:
```powershell
# Test build locally
npm run build

# If it works locally, check Vercel logs
```

### Environment Variables Not Working

**Check**:
1. Variables are set for correct environment (Production/Preview/Development)
2. Variable names match exactly (case-sensitive)
3. No extra spaces in values
4. Redeploy after adding variables

**Solution**:
```powershell
# Redeploy with new environment variables
vercel --prod --force
```

### Supabase Connection Issues

**Check**:
1. Supabase URL is correct
2. Anon key is valid
3. RLS policies allow access
4. Database tables exist

**Solution**:
- Verify in Supabase Dashboard → Settings → API
- Test connection locally first

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase with Vercel](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## ✅ Post-Deployment Checklist

- [ ] Deployment successful
- [ ] All environment variables configured
- [ ] Automatic deployments working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active

## 🎯 Next Steps

1. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Team Collaboration**:
   - Invite team members in Settings → Team
   - Set up role-based access

3. **Production Optimization**:
   - Enable Edge Functions
   - Configure caching strategies
   - Set up monitoring alerts

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/Muzammil309/WECON-Masawaat/issues

