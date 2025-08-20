"use client";

import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export async function getCurrentUserProfile(): Promise<any | null> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return null;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data();
    }
    
    return null;
}

export async function getCurrentUserRole(): Promise<'admin' | 'client'> {
    const profile = await getCurrentUserProfile();
    return profile?.role || 'client';
}
