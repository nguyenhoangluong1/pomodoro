# Deployment Guide

## Quick Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pomodoro timer app"
   git branch -M main
   git remote add origin https://github.com/yourusername/pomodoro-timer.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework
   - Click "Deploy" - Done! 🎉

## Manual Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (run from project root)
npm run deploy
```

## Other Deployment Options

### Netlify
1. Build: `npm run build`
2. Drag `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages
1. Build: `npm run build`
2. Push `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Traditional Hosting
1. Build: `npm run build`
2. Upload `dist` folder contents to your web server

## Environment Setup

No environment variables needed - the app works out of the box!

## Build Output

- Production files are generated in the `dist` folder
- All assets are optimized and minified
- Ready for any static hosting service