# 🌐 Unified Deployment Guide (One URL)

This guide shows how to deploy both Frontend and Backend to a **SINGLE Vercel URL** (e.g., `my-app.vercel.app`).

## 1. Commit Changes
I have created the `vercel.json` file needed for this.
```bash
git add .
git commit -m "configure monorepo deployment"
git push
```

## 2. Vercel Project Settings

You only need **ONE** Vercel project now.

1. **New Project**: Import your git repo.
2. **Root Directory**: Leave it **EMPTY** (Do not select `client` or `server`).
3. **Build Command**: `cd client && npm run build` (Optional/Fallback, but the vercel.json usually handles it).
   *Actually, because we use `vercel.json` builds, Vercel might ignore the UI build settings, but usually it's safest to leave Framework Preset as "Other".*
4. **Environment Variables**: Add them here!
   - `MONGODB_URI`: ...
   - `JWT_SECRET`: ...
   - `NODE_ENV`: `production`

## 3. Verify
After deployment:
- `https://your-app.vercel.app` -> Loads React App
- `https://your-app.vercel.app/api/pets` -> Loads Backend Data

## Troubleshooting
- If you see "404" for static assets (js/css), Vercel might not be serving them correctly with the rewrite rule.
- If that happens, verify the browser console for "404" on `.js` files.

**Benefits:**
- No CORS issues (Same domain!)
- Login cookies work perfectly (Same domain!)
- Simpler management (One project)
