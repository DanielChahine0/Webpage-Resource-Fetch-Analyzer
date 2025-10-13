# 🔧 GitHub Pages Setup Guide

## ⚠️ Important: First-Time Setup Required

GitHub Pages needs to be manually enabled the first time. Follow these steps:

## 📝 Step-by-Step Setup

### 1. Push Your Code to GitHub

```powershell
# If not already initialized
git init
git add .
git commit -m "Initial commit - deployment ready"

# Add your GitHub repository as remote
git remote add origin https://github.com/DanielChahine0/Webpage-Resource-Fetch-Analyzer.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages (Critical!)

1. **Go to your repository on GitHub**
   - Visit: `https://github.com/DanielChahine0/Webpage-Resource-Fetch-Analyzer`

2. **Navigate to Settings**
   - Click the **⚙️ Settings** tab at the top

3. **Find Pages Settings**
   - Scroll down the left sidebar
   - Click **Pages** (under "Code and automation")

4. **Configure Source**
   - Under "Build and deployment"
   - **Source**: Select **GitHub Actions** from dropdown
   - ✅ This enables the workflow to deploy

5. **Save**
   - The page will refresh
   - You should see a message about GitHub Actions being enabled

### 3. Trigger Deployment

After enabling Pages, trigger a deployment:

**Option A: Push a new commit**
```powershell
# Make a small change (or empty commit)
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

**Option B: Manual trigger**
1. Go to **Actions** tab on GitHub
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Click **Run workflow** (green button)

### 4. Wait for Deployment

1. Go to **Actions** tab
2. Watch the deployment progress (takes 1-3 minutes)
3. ✅ Green checkmark = Success!

### 5. Access Your Site

Your site will be live at:
```
https://danielchahine0.github.io/Webpage-Resource-Fetch-Analyzer/
```

## 🐛 Troubleshooting

### Error: "Get Pages site failed"

**Cause**: GitHub Pages not enabled in repository settings

**Solution**: 
1. Go to Settings → Pages
2. Set Source to "GitHub Actions"
3. Try deploying again

### Error: "pages build and deployment"

**Cause**: Workflow permissions issue

**Solution**:
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Click Save

### Error: "Resource not accessible by integration"

**Cause**: Missing permissions

**Solution**:
1. Go to Settings → Actions → General
2. Under "Workflow permissions"
3. Ensure "Read and write permissions" is selected
4. Save and re-run workflow

### Site Shows 404 After Deployment

**Cause**: Pages not configured or deployment incomplete

**Solution**:
1. Verify Settings → Pages shows "Your site is live at..."
2. Wait 5 minutes for DNS propagation
3. Hard refresh browser (Ctrl+Shift+R)
4. Check Actions tab for deployment status

## 🔐 Repository Settings Checklist

Before deploying, verify these settings:

### General Settings
- [ ] Repository is **public** (or you have GitHub Pro for private Pages)
- [ ] Repository name is correct
- [ ] Default branch is `main`

### Pages Settings (Settings → Pages)
- [ ] Source: **GitHub Actions** ✅ (NOT "Deploy from branch")
- [ ] Custom domain: (optional)
- [ ] Enforce HTTPS: ✅ Checked (recommended)

### Actions Settings (Settings → Actions → General)
- [ ] Actions permissions: "Allow all actions and reusable workflows"
- [ ] Workflow permissions: "Read and write permissions"
- [ ] Allow GitHub Actions to create and approve pull requests: ✅ Checked

## 📊 Verify Deployment

After successful deployment:

1. **Check Actions Tab**
   ```
   ✅ Deploy to GitHub Pages - Passed
   ```

2. **Check Pages Settings**
   ```
   Your site is live at https://danielchahine0.github.io/Webpage-Resource-Fetch-Analyzer/
   ```

3. **Visit Your Site**
   - Click the URL
   - Test the analyzer functionality
   - Verify all resources load correctly

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Repository is public (or GitHub Pro)
- [ ] Settings → Pages → Source = "GitHub Actions"
- [ ] Settings → Actions → Workflow permissions = "Read and write"
- [ ] Workflow triggered (push or manual)
- [ ] Actions tab shows successful deployment
- [ ] Site accessible at github.io URL

## 🚀 Automatic Deployments

Once set up, future deployments are automatic:

```powershell
# 1. Make changes to your code
# 2. Commit
git add .
git commit -m "Update feature"

# 3. Push
git push origin main

# 4. GitHub Actions automatically deploys!
# Check Actions tab to watch progress
```

## 📝 Update README with Live URL

After deployment, update your README.md:

```markdown
## 🌐 Live Demo

Visit: https://danielchahine0.github.io/Webpage-Resource-Fetch-Analyzer/
```

Commit and push:
```powershell
git add README.md
git commit -m "Add live demo URL"
git push origin main
```

## 🎉 Success!

Once deployed, your site will:
- ✅ Auto-deploy on every push to `main`
- ✅ Be accessible via HTTPS
- ✅ Have global CDN (fast loading)
- ✅ Support custom domains (optional)

## 🆘 Still Having Issues?

### Check Workflow Logs
1. Go to Actions tab
2. Click on failed workflow run
3. Click on job name
4. Expand each step to see error details

### Common Issues and Fixes

| Issue | Fix |
|-------|-----|
| "Pages not enabled" | Enable in Settings → Pages |
| "Permission denied" | Check Actions permissions |
| "404 on site" | Wait 5 min, hard refresh |
| "Workflow not running" | Check if Actions enabled |

### Contact Support

If still stuck:
- Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- Ask on [GitHub Community](https://github.community/)
- Open an issue in this repository

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Configuring Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

---

**Remember**: The first deployment requires manual setup in Settings → Pages. After that, everything is automatic! 🚀
