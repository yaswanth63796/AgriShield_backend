# Render Deployment Guide for AgriShield Backend

## Prerequisites
- GitHub account with your repository pushed
- Render account (free at render.com)
- Your Firebase credentials ready

---

## Step 1: Prepare Your Repository

### 1.1 Make sure your `.gitignore` is set up correctly
Your `.gitignore` already excludes:
```
node_modules
firebase_key.json
.env
```
✅ This is correct - don't commit secrets!

### 1.2 Push to GitHub
```bash
git add .
git commit -m "Deploy: Add Render configuration"
git push origin main
```

---

## Step 2: Create Render Account & Service

### 2.1 Go to Render Dashboard
- Visit https://render.com
- Sign up or log in with GitHub
- Click **"New +"** → **"Web Service"**

### 2.2 Connect Your GitHub Repository
- Select **"Build and deploy from a Git repository"**
- Authorize GitHub access
- Select your `AgriShield_backend` repository
- Choose **main** branch

### 2.3 Configure Service
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | agrishield-backend |
| **Environment** | Node |
| **Region** | Choose closest to your users |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free (or Paid for better performance) |

---

## Step 3: Add Environment Variables

In the Render Dashboard, scroll to **"Environment"** section and add these secrets:

### 3.1 Required Variables

1. **PORT**
   - Key: `PORT`
   - Value: `5000`

2. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

3. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `your_super_secret_key` (change to something secure)

4. **FIREBASE_KEY** (Your entire service account JSON as one line)
   - Key: `FIREBASE_KEY`
   - Value: Copy the entire content from your `.env` file's FIREBASE_KEY value

5. **FIREBASE_API_KEY**
   - Key: `FIREBASE_API_KEY`
   - Value: `AIzaSyCGHxbPh06che0Z0KSui6hWw1E70E9yjnM`

---

## Step 4: How to Add Environment Variables in Render

### Option A: Through Dashboard (Easiest)
1. Click **"Environment"** in your service settings
2. Click **"Add Secret"**
3. Enter key and value (Render will encrypt sensitive data)
4. Click **"Save Changes"**
5. Service will auto-redeploy with new variables

### Option B: Using render.yaml (Already Created)
The `render.yaml` file in your repo defines the service configuration, including:
- Build and start commands
- Environment variables references

---

## Step 5: Deploy

### 5.1 Manual Deploy
1. Click **"Deploy"** button on the Render dashboard
2. Wait for build to complete (2-5 minutes)
3. Check build logs for errors

### 5.2 Auto Deploy
- Enable "Auto Deploy" - redeploys on every push to `main` branch

### 5.3 Check Deployment Status
- Green status = Running ✅
- Check the logs for startup messages like `"Server running on port 5000"`

---

## Step 6: Get Your Live URL

After deployment succeeds:
1. Your service gets a public URL like: `https://agrishield-backend.onrender.com`
2. Use this URL for all API calls from your frontend
3. All endpoints will be at: `https://agrishield-backend.onrender.com/api/...`

---

## Step 7: Test Your Deployment

Open a terminal and test endpoints:

```bash
# Test if server is running
curl https://agrishield-backend.onrender.com

# Test crops endpoint
curl https://agrishield-backend.onrender.com/api/crops

# Test farmers endpoint
curl https://agrishield-backend.onrender.com/api/farmers

# Test auth endpoint (POST with JSON)
curl -X POST https://agrishield-backend.onrender.com/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken": "your_id_token"}'
```

---

## Step 8: Troubleshooting

### Issue: "Build failed"
- Check build logs in Render dashboard
- Ensure all dependencies in `package.json` are listed
- Run `npm install && npm start` locally to test

### Issue: "Port already in use"
- Render assigns a PORT automatically; ensure your code uses `process.env.PORT`
- Your code already does this ✅

### Issue: "Firebase authentication failed"
- Double-check your FIREBASE_KEY is correctly formatted
- Make sure there are actual newlines (not `\\n`) in the key
- Test locally with `.env` file first

### Issue: Environment variables not loaded
- Restart the service: Click "Restart service" in Render
- Redeploy: Push a new commit to GitHub

### Issue: "Module not found"
- Run `npm install` locally: `npm install`
- Commit `package-lock.json` if created
- Push to GitHub and redeploy

---

## Step 9: Production Best Practices

### Security Checklist
- ✅ Don't commit `.env` file
- ✅ Use strong JWT_SECRET (min 32 characters)
- ✅ Regenerate Firebase key if exposed
- ✅ Enable HTTPS (Render does this automatically)

### Performance Tips
- Use Render paid plan for better uptime SLA
- Enable browser caching headers in Express
- Use CDN for static assets
- Monitor logs for errors

### Monitoring
- Check "Logs" tab in Render dashboard regularly
- Set up email alerts for crashes
- Add error tracking (e.g., Sentry)

---

## Step 10: Update Frontend to Use Live URL

In your frontend code, change API base URL:

```javascript
// OLD (localhost)
const API_URL = "http://localhost:5000";

// NEW (Render deployment)
const API_URL = "https://agrishield-backend.onrender.com";
```

---

## Common Render Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | production |
| JWT_SECRET | Token signing key | abc123xyz... |
| FIREBASE_KEY | Google credentials | {type: service_account...} |

---

## Getting Help

- **Render Docs**: https://render.com/docs
- **Common Issues**: https://render.com/docs/troubleshooting
- **API Status**: https://status.render.com

---

## Next Steps After Deployment

1. Test all API endpoints with live URL
2. Update frontend to use live backend URL
3. Monitor logs in Render dashboard
4. Set up error logging/monitoring
5. Plan for paid plan if traffic increases

