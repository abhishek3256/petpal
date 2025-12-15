# 🌟 Fresh Deployment Guide (New Repo & New Vercel Project)

Follow these steps exactly to deploy your app from scratch without errors.

## Phase 1: Prepare Code (Local)

I have already:
1. ✅ **Fixed CORS**: Your server now accepts ANY Vercel URL (so your new frontend will work immediately).
2. ✅ **Fixed Cookies**: Login cookies are secure and work across domains.
3. ✅ **Fixed Routes**: SPA routing (`client/vercel.json`) is set up correctly (though we'll update the API URL later).
4. ✅ **Removed Bad Config**: Disabled `server/vercel.json` which caused the "server returning code" error.

**Action Required:**
```bash
git add .
git commit -m "prepare for fresh deployment"
```

## Phase 2: Push to New GitHub Repo

1. Go to **GitHub** -> Create New Repository (e.g., `pet-marketplace-v2`).
2. Run these commands in your project folder:
   ```bash
   # Remove old git link
   rmdir /s /q .git  # (Windows Command Prompt)
   
   # Initialize new git
   git init
   git add .
   git commit -m "Initial commit for v2"
   
   # Link to new repo (Replace URL with YOUR new repo URL)
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pet-marketplace-v2.git
   git push -u origin main
   ```

## Phase 3: Deploy Backend (Server)

1. Go to **Vercel Dashboard** -> **Add New ...** -> **Project**.
2. Import your **New Repository**.
3. **Project Name**: e.g., `pet-server-v2`.
4. **Root Directory**: `server` (Click Edit -> select `server` folder).
5. **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: Your secret key.
   - `NODE_ENV`: `production`
6. Click **Deploy**.

**✅ AFTER DEPLOYMENT:**
- Copy the **Backend Domains URL** (e.g., `https://pet-server-v2.vercel.app`).
- **Test it**: Visit `https://pet-server-v2.vercel.app`. It should show "Cannot GET /" (which is normal) or your API response. It should NOT show code.

## Phase 4: Update Frontend Config

Now we need to tell the Frontend where the new Backend is.

1. In your local code, open `client/vercel.json`.
2. Update the URL to your **NEW Backend URL**:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://pet-server-v2.vercel.app/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
3. Commit and push this change:
   ```bash
   git add client/vercel.json
   git commit -m "update api url"
   git push
   ```

## Phase 5: Deploy Frontend (Client)

1. Go to **Vercel Dashboard** -> **Add New ...** -> **Project**.
2. Import the **Same Repository**.
3. **Project Name**: e.g., `pet-client-v2`.
4. **Root Directory**: `client` (Click Edit -> select `client` folder).
5. **Build Settings** (Framework Preset):
   - Select **Vite**.
   - Output Directory: `dist`.
6. Click **Deploy**.

## Phase 6: Final Verification

1. Open your **New Frontend URL** (e.g., `https://pet-client-v2.vercel.app`).
2. **Login**: Should work perfectly.
3. **Refresh Page**: Should stay on the page (no 404).

**🎉 You are done!**
