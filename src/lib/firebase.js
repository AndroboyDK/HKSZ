// //ToDO: 3) Create a single Firebase init file

// Create: src/lib/firebase.js (we’ll keep all Firebase bootstrapping here).

// What you’ll put in that file (conceptually):

// Import initializeApp and initialize with your firebaseConfig.

// Set up Auth with React Native persistence using AsyncStorage.

// Export auth and db (Firestore) for the rest of the app to use.

// (I’ll give you the exact snippet in the next step when we code—right now just create the file and keep it empty or with a TODO comment.)



// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6Chi6cnkc6_1XaIuB9LfIYuBmzD-X7iw",
  authDomain: "parking-share-mvp.firebaseapp.com",
  projectId: "parking-share-mvp",
  storageBucket: "parking-share-mvp.firebasestorage.app",
  messagingSenderId: "665218960257",
  appId: "1:665218960257:web:c2565d428b7378a086f680"
};

const app = initializeApp(firebaseConfig);

// Ensure native persistence for RN
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
