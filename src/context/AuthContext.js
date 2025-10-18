// src/context/AuthContext.js
// Authentication context that handles login, logout, and sign-up without role assignment.

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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Auth state changed: Logged in as', firebaseUser.displayName || firebaseUser.email);
      } else {
        console.log('Auth state changed: Logged out');
      }
      setUser(firebaseUser || null);
      if (initializing) setInitializing(false);
    });
    return () => unsub();
  }, []);

  /**
   * Sign up new user with optional extra info (no role)
   * @param {string} email 
   * @param {string} password 
   * @param {string} displayName 
   * @param {object} extraData { phone, carModel, licensePlate }
   */
  const signUp = async (email, password, displayName, extraData = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Update Firebase Auth profile
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    // Always create or merge Firestore user profile
    const uref = doc(db, 'users', cred.user.uid);
    await setDoc(
      uref,
      {
        email,
        displayName: displayName || '',
        phone: extraData.phone || '',
        carModel: extraData.carModel || '',
        licensePlate: extraData.licensePlate || '',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true } // ⬅️ merge to avoid overwriting existing data
    );

    return cred.user;
  };


  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signOut = () => firebaseSignOut(auth);

  const value = useMemo(
    () => ({ user, initializing, signIn, signUp, signOut }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
