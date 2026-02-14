# Firebase Setup for React Native Google Sign-In

## 📋 Step 1: Firebase Console Configuration

### 1.1 Create Firebase Project (if not done)
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name: "AgriShield" (or your project name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Google Sign-In
1. In Firebase Console, go to **Authentication**
2. Click **"Set up sign-in method"**
3. Click **Google**
4. Toggle **Enable**
5. Select support email
6. Click **Save**

### 1.3 Get Web Client ID (IMPORTANT FOR REACT NATIVE)
1. Go to **Project Settings** (gear icon)
2. Click **"Service Accounts"** tab
3. Under "Firebase SDK Admin", click **"Web"**
4. In the dialog, find and copy your **Web Client ID**
   - It looks like: `xxxxx.apps.googleusercontent.com`
5. Save this - you'll need it for React Native

---

## 📱 Step 2: React Native Setup

### 2.1 Install Dependencies

```bash
# Navigation (if not already installed)
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context

# Firebase
npm install @react-native-firebase/app
npm install @react-native-firebase/auth

# Google Sign-In
npm install @react-native-google-signin/google-signin

# AsyncStorage (for token storage)
npm install @react-native-async-storage/async-storage
```

### 2.2 Link Google Play Services (Android)

For Android, you need to ensure Google Play Services are available:

**In `android/build.gradle`:**
```gradle
buildscript {
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

**In `android/app/build.gradle`:**
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
  implementation 'com.google.android.gms:play-services-auth:20.4.0'
  implementation 'com.google.firebase:firebase-auth'
}
```

### 2.3 Initialize Firebase

**Create `src/config/firebaseConfig.js`:**
```javascript
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Initialize Firebase (auto-configured from google-services.json)
export const firebaseApp = initializeApp();
export const firebaseAuth = auth();
```

---

## 🔑 Step 3: Configure Google Sign-In in React Native App

**In your main App component:**

```javascript
import React, { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function App() {
  useEffect(() => {
    // Configure Google Sign-In with Web Client ID from Firebase Console
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  return (
    // Your app components
  );
}
```

**Where to get Web Client ID:**
1. Firebase Console → Project Settings → Service Accounts
2. Look for "OAuth 2.0 credential" section
3. Find "Web Client ID"
4. It ends with `.apps.googleusercontent.com`

---

## 🧪 Step 4: Testing Setup

### Test 1: Check Firebase Configuration
```javascript
import auth from '@react-native-firebase/auth';

console.log('Firebase Auth Configured:', auth().app.name);
```

### Test 2: Test Google Sign-In
```javascript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const testGoogleSignIn = async () => {
  try {
    const userInfo = await GoogleSignin.signIn();
    console.log('Google Sign-In Success:', userInfo);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
  }
};
```

### Test 3: Get ID Token
```javascript
import auth from '@react-native-firebase/auth';

const getIdToken = async () => {
  try {
    const user = auth().currentUser;
    const token = await user.getIdToken();
    console.log('ID Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
  }
};
```

---

## 🔗 Step 5: Complete Google Sign-In Flow

```javascript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'https://agrishield-backend-e9yg.onrender.com';

export function GoogleSignInScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Step 1: Sign in with Google
      console.log('[1] Starting Google Sign-In...');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('[2] Google Sign-In successful:', userInfo.user.email);

      // Step 2: Get Firebase ID Token
      console.log('[3] Getting Firebase ID token...');
      const user = auth().currentUser;
      const idToken = await user.getIdToken();
      console.log('[4] ID token obtained');

      // Step 3: Send to Backend
      console.log('[5] Sending to backend...');
      const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log('[6] Backend response:', data);

      if (data.success) {
        // Step 4: Store JWT Token
        console.log('[7] Storing JWT token...');
        await AsyncStorage.setItem('authToken', data.data.jwtToken);
        await AsyncStorage.setItem('userData', JSON.stringify(data.data));

        Alert.alert('Success', `Welcome ${data.data.name}!`);
      } else {
        Alert.alert('Error', data.message);
      }

    } catch (error) {
      console.error('[Error]', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <ActivityIndicator size="large" color="blue" />}
      {!loading && (
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          style={{ backgroundColor: '#4285F4', padding: 15, borderRadius: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

---

## 📋 Troubleshooting Firebase Setup

### Issue: "Play Services not available"
```javascript
try {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
} catch (error) {
  console.error('Play Services Error:', error);
}
```

### Issue: "Cannot create a custom Google API client"
- Make sure `webClientId` is configured in GoogleSignin.configure()
- Check that you copied the correct Web Client ID from Firebase Console

### Issue: "User UID is not available"
```javascript
// Make sure user is signed in before accessing UID
if (auth().currentUser) {
  console.log('UID:', auth().currentUser.uid);
} else {
  console.log('No user signed in');
}
```

### Issue: "ID Token is null"
```javascript
// Force refresh token
const idToken = await user.getIdToken(true); // forceRefresh = true
```

---

## 🚀 Production Checklist

- [ ] Web Client ID added to GoogleSignin.configure()
- [ ] Firebase project created and configured
- [ ] Google Sign-In enabled in Firebase Console
- [ ] Backend URL uses HTTPS (https://agrishield-backend-e9yg.onrender.com)
- [ ] AsyncStorage installed for token persistence
- [ ] Error handling added for all async operations
- [ ] ID token obtained before sending to backend
- [ ] JWT token stored after authentication
- [ ] User data persisted locally
- [ ] Logout functionality implemented

---

## 🔗 Important Links

| Link | Purpose |
|------|---------|
| https://console.firebase.google.com | Firebase Console |
| https://rnfirebase.io/reference/auth | React Native Firebase Docs |
| https://react-native-google-signin.readthedocs.io | Google Sign-In Docs |
| https://render.com/dashboard | Render Backend Dashboard |

---

## 📞 Getting Help

If you encounter issues:

1. Check console logs: `adb logcat` (Android) or Xcode console (iOS)
2. Verify Firebase project ID matches in both console and code
3. Ensure Web Client ID is correct (ends with .apps.googleusercontent.com)
4. Check that backend is running: `curl https://agrishield-backend-e9yg.onrender.com/health`
5. Review [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md) for backend issues

