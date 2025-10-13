# 🚀 Quick Start Guide

Get your Webpage Resource Fetch Analyzer deployed in under 5 minutes!

## Option 1: GitHub Pages (Easiest - 2 minutes)

### ⚠️ IMPORTANT: First-Time Setup Required

1. **Push your code to GitHub**:
   ```powershell
   git add .
   git commit -m "Deploy"
   git push origin main
   ```

2. **Enable GitHub Pages** (Critical - Do this first!):
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - **Source**: Select **GitHub Actions** (NOT "Deploy from branch")
   - Click **Save**
   
   📖 **Detailed instructions**: See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

3. **Trigger deployment**:
   ```powershell
   # Push another commit to trigger the workflow
   git commit --allow-empty -m "Trigger Pages deployment"
   git push origin main
   ```

4. **Wait for deployment** (1-3 minutes):
   - Go to **Actions** tab on GitHub
   - Watch the "Deploy to GitHub Pages" workflow
   - ✅ Green checkmark = Success!

5. **Done!** 🎉
   - Your site will be live at: `https://yourusername.github.io/repository-name/`
   - Future pushes auto-deploy automatically

## Option 2: Netlify (Fastest - 1 minute)

1. **Click to Deploy**:
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

2. **Connect your repository**

3. **Deploy!** Settings are pre-configured in `netlify.toml`

## Option 3: Vercel (Lightning Fast - 1 minute)

1. **Click to Deploy**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

2. **Import your repository**

3. **Deploy!** Settings are pre-configured in `vercel.json`

## Local Development

Want to test locally first?

```powershell
# Method 1: Python (if installed)
python -m http.server 8000

# Method 2: Node.js (if installed)
npx http-server

# Method 3: Just open index.html in browser
# (drag and drop into browser window)
```

Visit: `http://localhost:8000`

## Before Deploying to Production

Run the preparation script:

```powershell
.\prepare-deploy.ps1
```

This will:
- ✓ Disable development logging
- ✓ Verify all critical files
- ✓ Check for TODO comments
- ✓ Verify Git status

## Need Help?

- 📖 Full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🛠️ Build instructions: [BUILD.md](BUILD.md)
- 📚 Documentation: [docs/](docs/)

## Common Issues

### Issue: CORS errors when testing locally
**Solution**: Use a local server (Python or Node.js) instead of opening `index.html` directly

### Issue: Resources not loading
**Solution**: Check browser console for errors, ensure all paths are correct

### Issue: GitHub Pages shows 404
**Solution**: Make sure GitHub Actions is enabled in Settings → Pages

## That's It! 🎉

Your Webpage Resource Fetch Analyzer is now live and ready to analyze web resources!

---

**Pro Tip**: Star ⭐ the repository and share with others!
