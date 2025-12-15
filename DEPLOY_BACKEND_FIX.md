# URGENT: Deploy Backend CORS Fix

## What I Fixed
Updated `server/index.js` to allow ANY Vercel subdomain (`.vercel.app`) instead of specific URLs.

## Why This Fixes Login

**Before:** Backend only allowed specific frontend URLs in CORS
**After:** Backend allows ANY `.vercel.app` domain

This means your frontend can login no matter what Vercel URL it's deployed to!

## Deploy Steps

### 1. Commit and Push to Backend
```bash
cd c:\Users\Acer Nitro\Desktop\pet
git add server/index.js
git commit -m "fix: update CORS to allow any vercel.app domain"
git push
```

### 2. Verify Backend Deployment
- Your backend Vercel project will auto-deploy
- Wait for deployment to complete (check Vercel dashboard)

### 3. Test Login
After backend redeploys:
1. Go to your frontend URL
2. Try logging in
3. Should work now! ✅

## What Changed in Code

```javascript
// OLD - only specific URLs
const allowedOrigins = [
  'https://petpal-3zse.vercel.app',
  'https://pet-client.vercel.app',
  ...
];

// NEW - any vercel.app subdomain
if (origin.endsWith('.vercel.app')) return callback(null, true);
```

Now your backend accepts requests from ANY Vercel deployment URL!
