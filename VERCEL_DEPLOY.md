# Vercel Deployment Instructions

## Frontend Deployment (client folder)

**IMPORTANT**: Deploy ONLY the `client` folder to Vercel for the frontend.

### Steps:
1. In Vercel dashboard, import your repository
2. **Root Directory**: Set to `client` (very important!)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Why?
- The `client/vercel.json` handles frontend routing and API proxy
- The root `vercel.json` is for monorepo deployments (ignore it for separate deployments)

## Backend Deployment (server folder)

Your backend is already deployed at: `https://pet-server-seven.vercel.app`

Make sure CORS is configured in `server/index.js` to allow your frontend domain.

## After Deployment

✅ Test these:
- Homepage loads
- Navigate to /pets (should load pets)
- **Refresh /pets page** (should NOT show 404 - this was the bug!)
- Login should work
- All API calls should succeed

## Configuration Files

### ✅ client/vercel.json (ACTIVE - for frontend)
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://pet-server-seven.vercel.app/api/:path*" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

### ⚠️ vercel.json (ROOT - ignore for separate deployments)
This file is for monorepo deployments. When deploying frontend separately, Vercel won't use this file if you set Root Directory to `client`.
