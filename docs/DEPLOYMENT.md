# Deployment Guide

## Quick Start - GitHub Pages (Recommended)

### Prerequisites
- Code pushed to GitHub repository
- GitHub account

### Setup Steps

1. **Enable GitHub Pages** (One-time setup):
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - **Source**: Select **GitHub Actions**
   - Save the changes

2. **Deploy**:
   ```powershell
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Monitor**:
   - Go to **Actions** tab
   - Watch "Deploy to GitHub Pages" workflow
   - Wait for green checkmark (1-3 minutes)

4. **Access**:
   - Your site: `https://yourusername.github.io/repository-name/`
   - Future pushes auto-deploy automatically

### Troubleshooting

**Deployment fails?**
- Verify GitHub Pages is enabled with **GitHub Actions** as source
- Check Actions → General → Workflow permissions → "Read and write permissions"

**Site not loading?**
- Wait 5 minutes after first deployment
- Clear browser cache (Ctrl+F5)
- Check Actions tab for errors


## Alternative Platforms

### Netlify (Free Tier)
1. Sign up at [netlify.com](https://www.netlify.com/)
2. Click "Add new site" → Import from Git
3. Select your repository
4. Deploy (settings pre-configured in `netlify.toml`)

### Vercel (Free Tier)
1. Sign up at [vercel.com](https://vercel.com/)
2. Click "Add New Project"
3. Import your repository
4. Deploy (settings pre-configured in `vercel.json`)

## Configuration Files

The following files are pre-configured for deployment:
- `.github/workflows/deploy.yml` - GitHub Pages workflow
- `netlify.toml` - Netlify configuration
- `vercel.json` - Vercel configuration
- `robots.txt` - SEO configuration

## Production Checklist

Before deploying:
- [ ] Test locally (open `index.html`)
- [ ] Verify all features work
- [ ] Check console for errors
- [ ] Test with multiple URLs
- [ ] Review performance scores

After deploying:
- [ ] Test live site with multiple browsers
- [ ] Verify CORS proxy functionality
- [ ] Check mobile responsiveness
- [ ] Monitor for errors

## Custom Domain (Optional)

### GitHub Pages:
1. Settings → Pages → Custom domain
2. Add your domain (e.g., `analyzer.example.com`)
3. Update DNS records with your provider:
   - CNAME record pointing to `yourusername.github.io`

### Netlify/Vercel:
1. Project Settings → Domain
2. Add custom domain
3. Follow DNS configuration instructions

## Security

All platforms include:
- HTTPS enabled by default
- Security headers configured
- CORS properly handled
- No sensitive data exposed
