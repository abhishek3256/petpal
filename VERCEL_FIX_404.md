# CRITICAL: Vercel Deployment Checklist for 404 Fix

## ⚠️ MOST IMPORTANT - Vercel Dashboard Settings

When you deployed your frontend on Vercel, you MUST have these exact settings:

### 1. Root Directory
- **MUST BE SET TO**: `client`
- **NOT**: Leave blank or set to root `/`
- This tells Vercel to deploy ONLY the client folder

### 2. Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build` or `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables (if needed)
- Add `VITE_API_BASE_URL` = `/api` (if not using .env.production)

## How to Check/Fix Your Vercel Project

1. Go to your Vercel dashboard
2. Select your **frontend project**
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. **If it says "Not set" or shows "/":**
   - Click Edit
   - Set to: `client`
   - Save
   - **Redeploy the project**

## After Changing Root Directory

You MUST redeploy after changing Root Directory:
1. Go to **Deployments** tab
2. Click the **three dots** on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete
5. Test by refreshing /pets page

## Why This Matters

- If Root Directory is NOT set to `client`, Vercel uses the ROOT vercel.json (monorepo config)
- This causes conflicts and the rewrites in `client/vercel.json` are ignored
- Result: 404 errors on refresh

## Test After Deployment

✅ Visit: https://your-app.vercel.app/pets
✅ **Refresh the page** (F5 or Ctrl+R)
✅ Should load pets, NOT show 404

If still getting 404 after setting Root Directory correctly, check browser DevTools:
- Network tab → Look for the failed request
- Console tab → Check for errors
- Share the error message
