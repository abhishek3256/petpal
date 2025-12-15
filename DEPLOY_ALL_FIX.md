# 🚀 COMPLETE FIX: Frontend & Backend Deployment

This guide fixes "Error 127", "404 Not Found", and "Login Issues" permanently.

## Step 1: Commit the Latest Fixes
I created `server/vercel.json` and updated config files. You must push these first.

```bash
cd c:\Users\Acer Nitro\Desktop\pet
git add .
git commit -m "fix: deploy settings for both frontend and backend"
git push
```

---

## Step 2: Configure FRONTEND Project (pet-client-one)

Go to Vercel Dashboard → Your **Frontend** Project → **Settings**

### General Section
- **Root Directory**: `client` (Type this and Save)

### Build & Development Settings (Crucial for Error 127)
- **Framework Preset**: `Vite` (Select this!)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

*Note: If "Override" switches are off, turn them ON and enter these values exactly.*

---

## Step 3: Configure BACKEND Project (pet-server-seven)

Go to Vercel Dashboard → Your **Backend** Project → **Settings**

### General Section
- **Root Directory**: `server` (Type this and Save)

### Build & Development Settings
- **Framework Preset**: `Other`
- **Build Command**: (Leave empty)
- **Output Directory**: (Leave empty)
- **Install Command**: `npm install`

---

## Step 4: Verify Environment Variables

### Frontend Project (.env)
Ensure `VITE_API_BASE_URL` is set to `/api` (or empty if using vercel.json rewrites, but `/api` is safest with our setup).
*Actually, our code uses `client/.env.production` which sets it to `/api`. This is handled by code, so Vercel Env Vars are optional for this.*

### Backend Project (.env)
Ensure `MONGODB_URI` is set in Vercel **Settings → Environment Variables**.
Ensure `JWT_SECRET` is set if you use it.

---

## Step 5: Redeploy BOTH

1. Go to **Deployments** tab for Frontend → **Redeploy**.
2. Go to **Deployments** tab for Backend → **Redeploy**.

## Checklist for Success
- [ ] Backend redeploys without error.
- [ ] Frontend redeploys without "Error 127" (because Root Dir is `client` and correct commands used).
- [ ] Login works (CORS fixed).
- [ ] Refreshing `/pets` works (404 fixed).
