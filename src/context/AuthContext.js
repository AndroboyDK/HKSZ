//In this file we will create an authentication context to manage user authentication state and provide authentication functions throughout the app.
//What this means is that we will create a context that will hold the current user's information and provide functions to sign in, sign up, and sign out.



import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

//We have now imported things such as createContext, useContext, useEffect, useMemo, and useState from React to help us manage state and context.
//We have also imported necessary functions from our firebase.js file and Firebase Authentication and Firestore modules. For example a document function from Firestore to create and manage user profiles.


// Create the AuthContext with default value null
const AuthContext = createContext(null);

// AuthProvider component to wrap around the app and provide auth state and functions
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Auth state changed: Logged in as", firebaseUser.displayName || firebaseUser.email);
      } else {
        console.log("Auth state changed: Logged out");
      }
      setUser(firebaseUser || null);
      if (initializing) setInitializing(false);
    });
    return () => unsub();
  }, []);

  const signUp = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    // Create user profile doc on first sign-up
    const uref = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(uref);
    if (!snap.exists()) {
      await setDoc(uref, {
        email,
        displayName: displayName || '',
        role: 'customer', // default; we can change later in UI
        createdAt: serverTimestamp(),
      });
    }
    return cred.user;
  };

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signOut = () => firebaseSignOut(auth);

  const value = useMemo(
    () => ({ user, initializing, signIn, signUp, signOut }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
