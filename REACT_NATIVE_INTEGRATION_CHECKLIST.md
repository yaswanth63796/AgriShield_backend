# React Native Integration Checklist

## Phase 1: Firebase Console Setup ✅

- [ ] Go to https://console.firebase.google.com
- [ ] Select or create your Firebase project
- [ ] Go to **Authentication** tab
- [ ] Click **"Set up sign-in method"** → **Google**
- [ ] Toggle **Enable** and save
- [ ] Go to **Project Settings** (gear icon)
- [ ] Click **"Service Accounts"** tab
- [ ] Under Firebase SDK Admin, click **Web**
- [ ] Copy the **Web Client ID** (yourapp.apps.googleusercontent.com)
- [ ] Save the Web Client ID somewhere safe

## Phase 2: React Native Project Setup ✅

### Install Dependencies
```bash
npm install @react-native-google-signin/google-signin
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-async-storage/async-storage
```

### Android Setup (if applicable)
- [ ] Ensure `google-services.json` is in `android/app/`
- [ ] Add Google Play Services dependency to `android/app/build.gradle`

### iOS Setup (if applicable)
- [ ] Ensure `GoogleService-Info.plist` is in Xcode project
- [ ] Run `pod install` in `ios/` directory

## Phase 3: Create Auth Component

Create a new file: `src/screens/GoogleSignInScreen.js`

Copy the code from: `REACT_NATIVE_SIGNIN.js` (included in your backend repo)

Update these values:
```javascript
// Your Firebase Web Client ID from Phase 1
const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

// Backend URL
const BACKEND_URL = 'https://agrishield-backend-e9yg.onrender.com';
```

## Phase 4: Add Auth Screen to Navigation

In your main `App.js`:
```javascript
import GoogleSignInScreen from './src/screens/GoogleSignInScreen';

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="GoogleSignIn" 
        component={GoogleSignInScreen}
        options={{ title: 'Sign In with Google' }}
      />
      {/* Other screens... */}
    </Stack.Navigator>
  );
}
```

## Phase 5: Test on Device/Emulator

- [ ] Start Metro bundler: `npm start`
- [ ] Run on Android: `npm run android`
- [ ] Run on iOS: `npm run ios`
- [ ] Tap "Sign in with Google" button
- [ ] Check console for logs:
  - `[Google SignIn] Starting Google Sign-In...`
  - `[Firebase] Getting ID token...`
  - `[Backend] Sending ID token to backend...`
- [ ] Should see success alert with user name
- [ ] Verify backend received request (check Render logs)

## Phase 6: Store JWT Token for Future Use

In your auth component, after successful login:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save JWT token
await AsyncStorage.setItem('authToken', data.data.jwtToken);
await AsyncStorage.setItem('userData', JSON.stringify(data.data));

// Later, retrieve it for authenticated requests:
const authToken = await AsyncStorage.getItem('authToken');

// Use in subsequent API calls:
fetch('https://agrishield-backend-e9yg.onrender.com/api/crops', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify(cropData)
})
```

## Phase 7: Verify Integration

### Test Endpoint Health
```bash
curl https://agrishield-backend-e9yg.onrender.com/health
# Should return: { "status": "ok", ... }
```

### Check Backend Logs
1. Go to https://render.com → Your service
2. Click "Logs" tab
3. Sign in from React Native app
4. Should see logs with `[AUTH]` prefix

### Success Indicators
- ✅ Alert shows "Welcome [name]!" after sign-in
- ✅ Render logs show `[AUTH] Token verified for user:`
- ✅ No errors in React Native console
- ✅ JWT token is returned and stored

## Phase 8: Handle Logout

Add logout functionality:

```javascript
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogout = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    // Navigate to login screen
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

## 🐛 Troubleshooting Checklist

If not working:

- [ ] Web Client ID is correct and in GoogleSignin.configure()
- [ ] Firebase Authentication is enabled in Firebase Console
- [ ] Backend URL is updated to Render URL (not localhost)
- [ ] Check React Native console for error messages
- [ ] Check Render logs for backend errors
- [ ] Verify FIREBASE_KEY is set on Render dashboard
- [ ] Test with real Firebase credentials (not test tokens)
- [ ] Restart app after any Firebase config changes
- [ ] Clear app cache if using emulator
- [ ] Run `pod install` again if on iOS

## 📱 Common Issues

### "Cannot create custom Google API client"
→ WebClientID is missing or incorrect in GoogleSignin.configure()

### "ID Token is required"
→ Not sending idToken in request body, check API call format

### "Invalid or expired ID Token"
→ Using test/mock token instead of real Firebase token

### "CORS error"
→ Already fixed on backend, make sure backend URL is correct

### "Google Play Services not available"
→ Emulator may not have Google Play Services, test on real device

## 📊 Expected API Flow

```
1. React Native App
   ↓
2. User taps "Sign in with Google"
   ↓
3. GoogleSignin.signIn() opens Google UI
   ↓
4. User logs in with Google account
   ↓
5. Firebase Auth updates with user data
   ↓
6. App gets ID token: user.getIdToken()
   ↓
7. App sends ID token to: POST /api/auth/google
   ↓
8. Backend verifies token with Firebase Admin SDK
   ↓
9. Backend creates/updates user in Firestore
   ↓
10. Backend generates JWT token
    ↓
11. Backend returns: { success, data: { jwtToken, ... } }
    ↓
12. App stores JWT in AsyncStorage
    ↓
13. App can now make authenticated requests with JWT
```

## 🎯 Next API Calls to Implement

After authentication succeeds:

```javascript
// Get farmer crops
fetch('https://agrishield-backend-e9yg.onrender.com/api/farmers', {
  headers: { 'Authorization': `Bearer ${authToken}` }
})

// Submit crop report
fetch('https://agrishield-backend-e9yg.onrender.com/api/crops', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${authToken}` },
  body: FormData // with image
})
```

## 📝 Files to Review

In your backend repository:
- `REACT_NATIVE_SIGNIN.js` - Complete example code
- `FIREBASE_REACT_NATIVE_SETUP.md` - Detailed Firebase setup
- `AUTH_TROUBLESHOOTING.md` - Troubleshooting guide
- `FIXES_SUMMARY.md` - What was fixed
- `AUTH_TROUBLESHOOTING.md` - Backend troubleshooting

## ✅ Final Verification

Before considering this complete:

- [ ] React Native app signs in successfully
- [ ] JWT token is returned and stored
- [ ] Backend logs show successful verification
- [ ] No errors in either app or backend logs
- [ ] Logout clears stored tokens
- [ ] Second login doesn't create duplicate user

---

**You're all set!** 🚀 Your Google Sign-In is now ready for React Native.

