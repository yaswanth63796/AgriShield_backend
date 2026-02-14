# 🚀 Quick Render Deployment (5 Minutes)

## 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Deploy: Ready for Render"
git push origin main
```

## 2️⃣ Create Service on Render
1. Go to https://render.com → Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `AgriShield_backend` repo

## 3️⃣ Configure Service
- **Name**: agrishield-backend
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free or Paid

## 4️⃣ Add Environment Variables

Click **"Environment"** and add these:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `your_secret_key_here` |
| `FIREBASE_KEY` | `{paste entire FIREBASE_KEY from .env}` |
| `FIREBASE_API_KEY` | `AIzaSyCGHxbPh06che0Z0KSui6hWw1E70E9yjnM` |

## 5️⃣ Deploy
- Click **"Create Web Service"** button
- Wait 2-5 minutes for build to complete
- Green status = Success ✅

## 6️⃣ Your Live URL
```
https://agrishield-backend.onrender.com
```

Update your frontend to use this URL instead of localhost!

---

## Test Your API

```bash
# Test if running
curl https://agrishield-backend.onrender.com

# Get all farmers
curl https://agrishield-backend.onrender.com/api/farmers

# Get all crops
curl https://agrishield-backend.onrender.com/api/crops
```

---

## If Something Goes Wrong

1. Check **"Logs"** tab in Render dashboard
2. Look for error messages
3. Click **"Restart service"** to retry
4. Check `.env` file locally first

---

## Need Help?
Read the full guide: `RENDER_DEPLOYMENT.md`
