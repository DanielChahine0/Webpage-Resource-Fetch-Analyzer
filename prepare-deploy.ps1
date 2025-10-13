# PowerShell Deployment Preparation Script
Write-Host "🚀 Preparing Webpage Resource Fetch Analyzer for deployment..." -ForegroundColor Green
Write-Host ""

# Step 1: Disable development logging
Write-Host "📝 Step 1: Disabling development logging..." -ForegroundColor Yellow
$loggerFile = "src\js\utils\logger.js"
if (Test-Path $loggerFile) {
    $content = Get-Content $loggerFile -Raw
    if ($content -match 'const isDevelopment = true') {
        $content = $content -replace 'const isDevelopment = true', 'const isDevelopment = false'
        Set-Content $loggerFile $content -NoNewline
        Write-Host "  ✓ Development logging disabled" -ForegroundColor Green
    } else {
        Write-Host "  ℹ Development logging already disabled" -ForegroundColor Cyan
    }
} else {
    Write-Host "  ✗ Logger file not found!" -ForegroundColor Red
}
Write-Host ""

# Step 2: Verify critical files exist
Write-Host "✅ Step 2: Verifying critical files..." -ForegroundColor Yellow
$criticalFiles = @{
    "index.html" = "Main HTML file"
    "manifest.json" = "PWA manifest"
    "LICENSE" = "License file"
    "README.md" = "Documentation"
    "DEPLOYMENT.md" = "Deployment guide"
    "netlify.toml" = "Netlify config"
    "vercel.json" = "Vercel config"
    ".gitignore" = "Git ignore file"
    "src\js\app.js" = "Main JavaScript"
    "src\css\main.css" = "Main CSS"
}

$allExist = $true
foreach ($file in $criticalFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file - $($criticalFiles[$file])" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file - $($criticalFiles[$file]) MISSING!" -ForegroundColor Red
        $allExist = $false
    }
}
Write-Host ""

# Step 3: Check for TODO/FIXME comments
Write-Host "🔍 Step 3: Checking for TODO/FIXME comments..." -ForegroundColor Yellow
$todos = Get-ChildItem -Recurse -Include *.js,*.css,*.html | Select-String -Pattern "TODO|FIXME" -SimpleMatch
if ($todos) {
    Write-Host "  Found $($todos.Count) TODO/FIXME comment(s):" -ForegroundColor Yellow
    $todos | Select-Object -First 5 | ForEach-Object {
        Write-Host "    - $($_.Filename):$($_.LineNumber)" -ForegroundColor Yellow
    }
    if ($todos.Count -gt 5) {
        Write-Host "    ... and $($todos.Count - 5) more" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✓ No TODO/FIXME comments found" -ForegroundColor Green
}
Write-Host ""

# Step 4: Check Git status
Write-Host "📦 Step 4: Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain 2>$null
if ($LASTEXITCODE -eq 0) {
    if ($gitStatus) {
        Write-Host "  ⚠ Uncommitted changes detected:" -ForegroundColor Yellow
        Write-Host $gitStatus
        Write-Host "  Commit changes before deploying!" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ Git repository is clean" -ForegroundColor Green
    }
} else {
    Write-Host "  ℹ Not a Git repository or Git not installed" -ForegroundColor Cyan
}
Write-Host ""

# Step 5: Summary
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Cyan
if ($allExist) {
    Write-Host "✨ All critical files present" -ForegroundColor Green
} else {
    Write-Host "❌ Some critical files are missing" -ForegroundColor Red
}
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review and commit any changes" -ForegroundColor White
Write-Host "  2. Push to your Git repository" -ForegroundColor White
Write-Host "  3. Follow instructions in DEPLOYMENT.md" -ForegroundColor White
Write-Host "  4. Deploy to your chosen platform:" -ForegroundColor White
Write-Host "     - GitHub Pages (free)" -ForegroundColor Gray
Write-Host "     - Netlify (free)" -ForegroundColor Gray
Write-Host "     - Vercel (free)" -ForegroundColor Gray
Write-Host ""

if ($allExist -and -not $gitStatus) {
    Write-Host "✅ Ready for deployment! 🚀" -ForegroundColor Green
} else {
    Write-Host "⚠️  Please address the issues above before deploying" -ForegroundColor Yellow
}
Write-Host ""
