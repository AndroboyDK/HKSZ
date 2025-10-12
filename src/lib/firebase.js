// FØLGENDE DELES LIGE NU I GITHUB; MEN VIL IKE VÆRE INKLUDERET I DEN FÆRDIGE APP PÅ GITHUB NÅR REPO SKAL VÆRE OFFENTLIG. 


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
