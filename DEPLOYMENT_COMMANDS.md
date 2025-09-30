# Quick Deployment Commands Reference

## 🚀 Essential Git Commands

### Check Status
```powershell
cd "D:\event management\event-management-platform"
git status
```

### Commit and Push Changes
```powershell
# Add all changes
git add .

# Commit with message
git commit -m "your commit message here"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

### View Commit History
```powershell
git log --oneline -10
```

### Create a New Branch
```powershell
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Push new branch to GitHub
git push -u origin feature/your-feature-name
```

### Switch Branches
```powershell
# Switch to main
git checkout main

# Switch to another branch
git checkout branch-name
```

## 🔧 Vercel CLI Commands

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Login
```powershell
vercel login
```

### Deploy to Preview
```powershell
vercel
```

### Deploy to Production
```powershell
vercel --prod
```

### View Deployments
```powershell
vercel ls
```

### View Logs
```powershell
vercel logs [deployment-url]
```

### Environment Variables
```powershell
# List all environment variables
vercel env ls

# Add new environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# Pull environment variables to local
vercel env pull
```

### Link Project
```powershell
vercel link
```

## 📦 NPM Commands

### Install Dependencies
```powershell
npm install
```

### Run Development Server
```powershell
npm run dev
```

### Build for Production
```powershell
npm run build
```

### Start Production Server (locally)
```powershell
npm start
```

### Run Tests
```powershell
npm test
```

### Lint Code
```powershell
npm run lint
```

## 🔄 Complete Deployment Workflow

### Standard Deployment
```powershell
# 1. Navigate to project
cd "D:\event management\event-management-platform"

# 2. Pull latest changes (if working in team)
git pull origin main

# 3. Make your changes...

# 4. Test locally
npm run dev

# 5. Build to check for errors
npm run build

# 6. Add changes
git add .

# 7. Commit
git commit -m "feat: Add new feature"

# 8. Push (triggers automatic Vercel deployment)
git push origin main
```

### Feature Branch Workflow
```powershell
# 1. Create feature branch
git checkout -b feature/new-dashboard

# 2. Make changes and commit
git add .
git commit -m "feat: Add new dashboard"

# 3. Push feature branch (creates preview deployment)
git push -u origin feature/new-dashboard

# 4. Create Pull Request on GitHub

# 5. After review, merge to main
git checkout main
git pull origin main
```

## 🐛 Troubleshooting Commands

### Reset Local Changes
```powershell
# Discard all local changes
git reset --hard HEAD

# Discard changes in specific file
git checkout -- filename
```

### View Differences
```powershell
# See what changed
git diff

# See staged changes
git diff --staged
```

### Undo Last Commit (keep changes)
```powershell
git reset --soft HEAD~1
```

### Force Push (use with caution!)
```powershell
git push origin main --force
```

### Clean Untracked Files
```powershell
# Preview what will be deleted
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and directories
git clean -fd
```

## 🔐 Environment Setup

### Copy Environment Variables
```powershell
# Copy from example
cp .env.example .env.local

# Or create new
New-Item .env.local
```

### View Environment Variables (Vercel)
```powershell
vercel env ls
```

## 📊 Monitoring Commands

### Check Deployment Status
```powershell
vercel ls
```

### View Recent Deployments
```powershell
vercel ls --limit 10
```

### Inspect Specific Deployment
```powershell
vercel inspect [deployment-url]
```

## 🎯 Quick Actions

### Emergency Rollback
```powershell
# 1. Find previous deployment
vercel ls

# 2. Promote previous deployment to production
vercel promote [previous-deployment-url]
```

### Redeploy Current Version
```powershell
vercel --prod --force
```

### Cancel Deployment
```powershell
vercel cancel [deployment-url]
```

## 📝 Useful Git Aliases (Optional)

Add these to your PowerShell profile for shortcuts:

```powershell
# Open PowerShell profile
notepad $PROFILE

# Add these aliases:
function gs { git status }
function ga { git add . }
function gc { param($msg) git commit -m $msg }
function gp { git push origin main }
function gpl { git pull origin main }
function gco { param($branch) git checkout $branch }
function gcb { param($branch) git checkout -b $branch }
```

Then use:
```powershell
gs          # git status
ga          # git add .
gc "message"  # git commit -m "message"
gp          # git push origin main
```

## 🔗 Important URLs

- **GitHub Repository**: https://github.com/Muzammil309/WECON-Masawaat
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Production Site**: https://wecon-masawaat.vercel.app (after deployment)

## 📞 Getting Help

```powershell
# Git help
git --help
git [command] --help

# Vercel help
vercel --help
vercel [command] --help

# NPM help
npm help
npm [command] --help
```

---

**Pro Tip**: Keep this file open in a separate window for quick reference during development!

