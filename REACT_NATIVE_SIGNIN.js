// React Native Google Sign-In Implementation
// This guide shows how to properly integrate the backend authentication

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { auth } from '@react-native-firebase/auth';

// Configuration
const BACKEND_URL = 'https://agrishield-backend-e9yg.onrender.com';
// For local testing: const BACKEND_URL = 'http://192.168.1.100:5000';

export default function GoogleSignInScreen() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Get from Firebase Console
      offlineAccess: true,
    });

    // Check if user is already signed in
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        const userInfo = await GoogleSignin.getCurrentUser();
        setUser(userInfo);
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
    }
  };

  // Main login handler
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Step 1: Sign in with Google
      console.log('[Google SignIn] Starting Google Sign-In...');
      const userInfo = await GoogleSignin.signIn();
      console.log('[Google SignIn] Google Sign-In successful');

      // Step 2: Get Firebase ID Token
      console.log('[Firebase] Getting ID token...');
      const user = auth().currentUser;
      if (!user) {
        throw new Error('No user signed in after Google Sign-In');
      }

      const idToken = await user.getIdToken();
      console.log('[Firebase] ID token obtained');

      // Step 3: Send to backend for verification
      console.log('[Backend] Sending ID token to backend...');
      const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });

      console.log('[Backend] Response status:', response.status);
      const data = await response.json();
      console.log('[Backend] Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Authentication failed');
      }

      // Step 4: Success! Store tokens
      if (data.success && data.data) {
        setUser(data.data);

        // Store JWT token locally for authenticated requests
        // Example: AsyncStorage.setItem('authToken', data.data.jwtToken);

        Alert.alert('Success', `Welcome ${data.data.name || data.data.email}!`);
      }

    } catch (error) {
      console.error('[Error] Google Sign-In failed:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'You cancelled the sign-in process');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available');
      } else {
        Alert.alert('Error', error.message || 'Sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      await auth().signOut();
      setUser(null);
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      Alert.alert('Error', 'Logout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {user ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Logged in as:
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>{user.name || user.email}</Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
            {user.email}
          </Text>
          {user.jwtToken && (
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>
              Token expires in: {user.expiresIn}
            </Text>
          )}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={loading}
            style={{
              backgroundColor: '#FF6B6B',
              paddingHorizontal: 30,
              paddingVertical: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={loading}
          style={{
            backgroundColor: '#4285F4',
            paddingHorizontal: 40,
            paddingVertical: 15,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ============================================
// Using the JWT Token in Subsequent Requests
// ============================================

/**
 * Example function to make authenticated requests
 */
export async function makeAuthenticatedRequest(endpoint, method = 'GET', body = null) {
  try {
    // Get stored JWT token (you should have stored it from sign-in)
    // const token = await AsyncStorage.getItem('authToken');

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`, // Include token if available
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('[Request Error]:', error);
    throw error;
  }
}

// ============================================
// Installation Steps for React Native
// ============================================

/*
1. Install required packages:
   npm install @react-native-google-signin/google-signin
   npm install @react-native-firebase/app
   npm install @react-native-firebase/auth

2. For development testing on Android:
   - Configure Firebase Console with your Android app
   - Get SHA-1 certificate: ./gradlew signingReport
   - Add SHA-1 to Firebase Console

3. Get Web Client ID from Firebase Console:
   - Go to Firebase Console → Project Settings
   - Under "Service Accounts" → Generate new private key
   - Look for Web Client ID in OAuth 2.0 credentials

4. Configure your backend URL:
   - Change BACKEND_URL for production/development
   - For local testing: BACKEND_URL = 'http://YOUR_IP:5000'

5. Test the flow:
   - Press "Sign in with Google"
   - Should see console logs showing each step
   - Verify response from backend
*/

// ============================================
// Testing Endpoint Manually (for debugging)
// ============================================

/*
// Using curl from terminal:
curl -X POST \
  https://agrishield-backend-e9yg.onrender.com/api/auth/google \
  -H 'Content-Type: application/json' \
  -d '{
    "idToken": "YOUR_FIREBASE_ID_TOKEN_HERE"
  }'

// Using JavaScript fetch:
const idToken = await user.getIdToken();
const response = await fetch('https://agrishield-backend-e9yg.onrender.com/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ idToken }),
});
const data = await response.json();
console.log('Response:', data);
*/
