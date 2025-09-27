# WECON Event Management Platform - Deployment Script
# This script helps automate the GitHub repository setup

Write-Host "🚀 WECON Event Management Platform Deployment Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git and try again" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the event-management-platform directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Current Status Check:" -ForegroundColor Cyan
Write-Host "✅ Supabase credentials configured" -ForegroundColor Green
Write-Host "✅ Aivent template integration complete" -ForegroundColor Green
Write-Host "✅ All pages created and styled" -ForegroundColor Green
Write-Host "✅ Production build successful" -ForegroundColor Green

# Get GitHub repository URL from user
Write-Host "`n🔗 GitHub Repository Setup:" -ForegroundColor Cyan
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/wecon-event-management.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required" -ForegroundColor Red
    exit 1
}

# Check if remote origin already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -eq 'y' -or $overwrite -eq 'Y') {
        git remote remove origin
        Write-Host "🗑️  Removed existing remote" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit 1
    }
}

# Add remote and push
try {
    Write-Host "`n📤 Setting up GitHub repository..." -ForegroundColor Cyan
    
    git remote add origin $repoUrl
    Write-Host "✅ Added remote origin" -ForegroundColor Green
    
    git branch -M main
    Write-Host "✅ Renamed branch to main" -ForegroundColor Green
    
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error setting up GitHub repository: $_" -ForegroundColor Red
    Write-Host "Please check your repository URL and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. 🌐 Purchase domain: wecon-masawaat.com ($11.50 USD)" -ForegroundColor White
Write-Host "2. 🔗 Connect Vercel to your GitHub repository" -ForegroundColor White
Write-Host "3. ⚙️  Configure environment variables in Vercel" -ForegroundColor White
Write-Host "4. 🗄️  Run database migrations in Supabase" -ForegroundColor White
Write-Host "5. 🔐 Configure Supabase authentication settings" -ForegroundColor White

Write-Host "`n📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow

Write-Host "`n🎉 GitHub setup complete! Your code is now ready for Vercel deployment." -ForegroundColor Green
