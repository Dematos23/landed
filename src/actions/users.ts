
"use server";

import { db, auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

async function getAuthenticatedUser() {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

/**
 * Gets the role of a user from Firestore.
 * @param uid The user's ID.
 * @returns A promise that resolves to the user's role ('admin' or 'client').
 */
export async function getUserRole(uid: string): Promise<'admin' | 'client'> {
    if (!uid) {
        return 'client';
    }

    try {
        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();
        
        if (userDoc.exists) {
            return userDoc.data()?.role || 'client';
        }
        return 'client';
    } catch (error) {
        console.error("Error getting user role:", error);
        return 'client'; // Default to client on error
    }
}

/**
 * Claims a unique subdomain for the authenticated user.
 * This function uses a transaction to ensure atomic reservation of the subdomain.
 * @param desiredSubdomain The subdomain string requested by the user.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export async function claimUserSubdomain(desiredSubdomain: string): Promise<{ success: boolean; normalized?: string; error?: string }> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Authentication required." };
  }
  
  if (!desiredSubdomain || desiredSubdomain.trim().length < 3) {
      return { success: false, error: "El subdominio debe tener al menos 3 caracteres." };
  }

  const normalized = desiredSubdomain.trim().toLowerCase().replace(/\s+/g, '-');
  
  // Basic validation for subdomain format
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(normalized)) {
      return { success: false, error: "Formato de subdominio no válido. Solo letras, números y guiones." };
  }

  const userRef = db.collection('users').doc(user.uid);
  const claimRef = db.collection('subdomainClaims').doc(normalized);

  try {
    await db.runTransaction(async (transaction) => {
      const claimDoc = await transaction.get(claimRef);
      
      if (claimDoc.exists) {
        // If the claim exists and it's not owned by the current user, it's taken.
        if (claimDoc.data()?.ownerUserId !== user.uid) {
            throw new Error(`El subdominio '${normalized}' ya está en uso.`);
        }
        // If the user already owns this claim, do nothing.
      } else {
        // The subdomain is available, claim it.
        transaction.set(claimRef, { ownerUserId: user.uid });
        transaction.update(userRef, { subdomain: normalized });
      }
    });

    return { success: true, normalized };
  } catch (error: any) {
    console.error("Error claiming subdomain:", error);
    return { success: false, error: error.message || "No se pudo reservar el subdominio." };
  }
}
