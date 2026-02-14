# Google Sign-In Authentication Troubleshooting Guide

## ✅ Issues Fixed

1. **Profile Data Missing**: Firebase ID tokens don't include `name` and `picture` by default
   - ✅ Fixed: Now extracts only available data and uses email as fallback

2. **No JWT Token Returned**: React Native needs a token for subsequent authenticated requests
   - ✅ Fixed: Now returns a JWT token that expires in 7 days

3. **Poor Error Messages**: Debugging was difficult
   - ✅ Fixed: Added detailed logging and console messages

4. **CORS Issues**: React Native requests were blocked
   - ✅ Fixed: Improved CORS configuration

5. **Inconsistent Response Format**: Different responses for new/existing users
   - ✅ Fixed: Consistent response format with `success`, `message`, `data`

---

## 🧪 Testing the Endpoint

### Test 1: Check if Backend is Running

```bash
# Test health endpoint
curl https://agrishield-backend-e9yg.onrender.com/health

# Expected response:
{
  "status": "ok",
  "message": "AgriShield Backend API is running",
  "timestamp": "2026-02-14T10:30:00.000Z",
  "environment": "production"
}
```

### Test 2: Test Auth Endpoint (Requires Real Firebase ID Token)

You need a real Firebase ID token from Google Sign-In. Here's how to get one:

#### Option A: Get Token from React Native App (Recommended)

In your React Native app:
```javascript
import { auth } from '@react-native-firebase/auth';

const user = auth().currentUser;
const idToken = await user.getIdToken();
console.log('ID Token:', idToken);
```

Copy the token and use in next test.

#### Option B: Get Token from Firebase Console

1. Go to Firebase Console → Authentication → Your Project
2. Click a user → Copy "User UID"
3. Use Firebase Admin SDK to generate a token (advanced)

### Test 3: Send Request to Backend

```bash
# Replace TOKEN with your actual ID token
curl -X POST \
  https://agrishield-backend-e9yg.onrender.com/api/auth/google \
  -H 'Content-Type: application/json' \
  -d '{"idToken":"YOUR_TOKEN_HERE"}'

# Expected successful response (status 200 or 201):
{
  "success": true,
  "message": "User logged in successfully",
  "isNewUser": false,
  "data": {
    "uid": "user_id_here",
    "email": "user@example.com",
    "name": "User Name",
    "jwtToken": "eyJhbGc...",
    "expiresIn": "7d"
  }
}
```

---

## 🔍 Common Issues and Solutions

### Issue 1: "ID Token is required"

**Cause**: You didn't send the idToken in the request body

**Solution**:
```javascript
// ❌ WRONG
fetch('URL/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

// ✅ CORRECT
fetch('URL/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken: token })
});
```

### Issue 2: "Invalid or expired ID Token"

**Cause**: 
- Token has expired (tokens expire in 1 hour)
- Token is malformed or from wrong Firebase project
- Firebase service account is misconfigured

**Solution**:
```javascript
// Get a fresh token
const user = auth().currentUser;
const freshToken = await user.getIdToken(true); // forceRefresh = true
```

### Issue 3: CORS Error in React Native

**Cause**: React Native strict CORS requirements

**Solution**: Already fixed in middleware, but ensure:
- Headers include `Content-Type: application/json`
- Backend is accessible from React Native environment
- Using correct URL (not localhost if on physical device)

```javascript
// For physical device, use your machine's IP:
const BACKEND_URL = 'http://192.168.1.100:5000'; // Not localhost!
```

### Issue 4: "Cannot read property 'collection' of undefined"

**Status**: ✅ FIXED in previous update

**Cause**: Firebase config was exporting wrong module

**Solution**: Firebase config now correctly exports Firestore database instance

### Issue 5: Response Timeout

**Cause**:
- Backend not running
- Render service sleeping (free tier)
- Network connectivity issue

**Solution**:
```bash
# Check if backend is up
curl https://agrishield-backend-e9yg.onrender.com/health

# If not responding, restart on Render dashboard
# Check logs: Render → Your Service → Logs
```

---

## 📱 React Native Implementation Checklist

- [ ] Firebase project created in Firebase Console
- [ ] Google Sign-In configured in Firebase Console
- [ ] Web Client ID obtained from Firebase Console
- [ ] `@react-native-google-signin/google-signin` installed
- [ ] `@react-native-firebase/auth` installed
- [ ] GoogleSignin.configure() called with webClientId
- [ ] User signs in with GoogleSignin.signIn()
- [ ] ID token obtained with `user.getIdToken()`
- [ ] Token sent to backend `/api/auth/google` endpoint
- [ ] JWT token stored from response
- [ ] BACKEND_URL points to https://agrishield-backend-e9yg.onrender.com

---

## 🔐 Backend Response Structure

### Success Response (New User)
```json
{
  "success": true,
  "message": "User registered successfully",
  "isNewUser": true,
  "data": {
    "uid": "Firebase UID",
    "email": "user@example.com",
    "name": "Extracted from email",
    "jwtToken": "JWT token for auth header",
    "expiresIn": "7d"
  }
}
```

### Success Response (Existing User)
```json
{
  "success": true,
  "message": "User logged in successfully",
  "isNewUser": false,
  "data": {
    "uid": "Firebase UID",
    "email": "user@example.com",
    "name": "User's name",
    "jwtToken": "JWT token for auth header",
    "expiresIn": "7d"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details (only in development)"
}
```

---

## 📊 Step-by-Step Flow Diagram

```
React Native App
       |
       | 1. User taps "Sign in"
       v
GoogleSignin.signIn()
       |
       | 2. Opens Google Sign-In UI
       v
Firebase Auth Sign-In
       |
       | 3. Token obtained
       v
user.getIdToken()
       |
       | 4. POST to /api/auth/google
       v
Backend Controller
       |
       | 5. Verify token with Firebase
       v
Firebase Admin SDK
       |
       | 6. Check Firestore for user
       v
Firestore Database
       |
       | 7. Create/update user
       v
Generate JWT Token
       |
       | 8. Response with JWT
       v
React Native App
       |
       | 9. Store JWT locally
       v
Make Authenticated Requests
```

---

## 🚀 Quick Debug Checklist

1. ✅ Check backend is running: `curl https://agrishield-backend-e9yg.onrender.com/health`
2. ✅ Verify Firebase config loaded: Check server logs for any Firebase errors
3. ✅ Test with real token: Get actual ID token from successful Google Sign-In
4. ✅ Check network tab: Verify request/response in React Native debugger
5. ✅ Verify FIREBASE_KEY: Make sure environment variable is set on Render
6. ✅ Check logs on Render: Look for detailed error messages

---

## 📝 Monitoring and Logging

Check server logs in Render dashboard:

**Look for these log patterns:**
- `[AUTH] Verifying ID token` - Token verification started
- `[AUTH] Token verified for user:` - Token is valid
- `[AUTH] New user detected` - First-time user
- `[AUTH] Response sent with status` - Successful response

**Error log patterns:**
- `[AUTH] Firebase token verification failed:` - Token invalid
- `[AUTH] Unexpected error:` - Server error

---

## 💡 Best Practices

1. **Always handle errors** in React Native
2. **Refresh token** if older than 1 hour
3. **Store JWT locally** using AsyncStorage
4. **Include JWT in Authorization header** for protected routes
5. **Log all authentication steps** for debugging
6. **Use HTTPS** in production (Render provides this)

---

## 🔗 Useful Links

- Firebase Console: https://console.firebase.google.com
- Render Dashboard: https://render.com/dashboard
- React Native Firebase: https://rnfirebase.io
- Google Sign-In: https://react-native-google-signin.readthedocs.io

