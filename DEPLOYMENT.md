# Deployment Guide

This guide walks you through deploying OrganicStore to Vercel with automatic deployments on GitHub push.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Project pushed to GitHub

## Step-by-Step Deployment

### 1. Initialize Git Repository (if not already done)

```bash
cd c:\organic agent
git init
git add .
git commit -m "Initial commit: OrganicStore e-commerce platform"
```

### 2. Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Name it `organic-store` (or your preferred name)
5. Add description: "Fresh organic produce e-commerce platform"
6. Choose **Public** or **Private**
7. Click **Create repository**

### 3. Push to GitHub

```bash
git remote add origin https://github.com/yourusername/organic-store.git
git branch -M main
git push -u origin main
```

Replace `yourusername` with your GitHub username.

### 4. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** or **Log In**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account
5. Click **New Project**
6. Find and select your `organic-store` repository
7. Click **Import**

### 5. Configure Project

Vercel will auto-detect the following settings:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

These are already configured in `vercel.json`, so you can just click **Deploy**.

### 6. Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (usually 24-48 hours)

### 7. Environment Variables (Optional)

If you need environment variables:

1. Go to **Settings** → **Environment Variables**
2. Add your variables (e.g., API keys, database URLs)
3. Click **Save**
4. Redeploy to apply changes

## Automatic Deployments

After connecting to Vercel, every push to your main branch will automatically:

1. ✅ Trigger a build
2. ✅ Run tests (if configured)
3. ✅ Deploy to production
4. ✅ Generate preview URL for pull requests

## Project URLs

After deployment, you'll have:

- **Production**: `https://organic-store.vercel.app` (or your custom domain)
- **Preview**: Unique URL for each pull request
- **Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)

## Monitoring Deployments

1. Go to your Vercel dashboard
2. Click on the `organic-store` project
3. View **Deployments** tab to see:
   - Deployment status
   - Build logs
   - Performance metrics
   - Analytics

## Rollback (if needed)

1. Go to **Deployments** tab
2. Find the previous working deployment
3. Click the **⋮** menu
4. Select **Promote to Production**

## GitHub Actions (Optional CI/CD)

For additional CI/CD, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v23
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

Then add the secrets in GitHub:
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## Troubleshooting

### Build fails
- Check `npm run build` works locally
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Styling not loading
- Ensure `tailwind.config.js` paths are correct
- Check `postcss.config.js` configuration
- Clear Vercel cache and redeploy

### Environment variables not working
- Add variables to Vercel project settings
- Redeploy after adding variables
- Check variable names match code usage

## Performance Optimization

1. **Image Optimization**: Consider using services like Cloudinary or Vercel Image Optimization
2. **Code Splitting**: React Router automatically code-splits pages
3. **Caching**: Vercel handles static asset caching automatically
4. **Analytics**: Enable Vercel Analytics to monitor performance

## Security Best Practices

1. ✅ Use environment variables for sensitive data
2. ✅ Never commit secrets to repository
3. ✅ Enable branch protection on main
4. ✅ Use HTTPS (automatic with Vercel)
5. ✅ Keep dependencies updated

## Next Steps

After deployment:

1. Share your live URL with friends/family
2. Collect feedback
3. Monitor analytics
4. Plan feature improvements
5. Consider adding:
   - Database (Firebase, Supabase, MongoDB)
   - User authentication
   - Payment processing (Stripe, Razorpay)
   - Email notifications
   - Admin dashboard

## Support

For Vercel support: [vercel.com/support](https://vercel.com/support)
For GitHub help: [docs.github.com](https://docs.github.com)

---

Happy deploying! 🚀
