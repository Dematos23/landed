
"use server";

import { db, auth, FieldValue } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import type { LandingPageData } from '@/lib/types';

const landingsCollection = db.collection('landings');

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

async function getUser(uid: string) {
    try {
        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting user:", error);
        return null;
    }
}


function toPageSlug(name: string): string {
  return name.trim().replace(/\s+/g, '-');
}

/**
 * Publishes a landing page by setting `isPublished` to true and generating its public URL.
 * This is a server action and requires admin privileges.
 * @param pageId The ID of the landing page to publish.
 * @returns A promise that resolves to an object indicating success and the public URL, or failure.
 */
export async function publishLanding(pageId: string): Promise<{ success: boolean; publicUrl?: string; devPublicUrl?: string; needsSubdomain?: boolean; error?: string }> {
  try {
    const userClaims = await getAuthenticatedUser();
    if (!userClaims) {
      return { success: false, error: "Authentication required." };
    }
    
    const user = await getUser(userClaims.uid);
    if (!user) {
        return { success: false, error: "User not found." };
    }

    const pageRef = landingsCollection.doc(pageId);
    const pageDocSnap = await pageRef.get();
    
    if (!pageDocSnap.exists()) {
      return { success: false, error: `Page with ID ${pageId} not found.` };
    }
    
    const landingData = pageDocSnap.data() as LandingPageData;

    if (landingData.userId !== userClaims.uid) {
      return { success: false, error: "User does not have permission to publish this page." };
    }

    let userSubdomain = landingData.userSubdomain;
    
    // If the page doesn't have a subdomain, check if the user has one claimed
    if (!userSubdomain && user.subdomain) {
      userSubdomain = user.subdomain;
    }
    
    // If still no subdomain, then the user needs to claim one.
    if (!userSubdomain) {
        return { success: false, needsSubdomain: true, error: "Subdomain required for publication." };
    }

    let pageSlug = toPageSlug(landingData.name);

    // --- Slug Collision Check (Optional but recommended) ---
    let finalSlug = pageSlug;
    let suffix = 1;
    let isUnique = false;
    while (!isUnique) {
        const q = db.collection('landings').where("userId", "==", userClaims.uid).where("pageSlug", "==", finalSlug).where("isPublished", "==", true);
        const collisionSnapshot = await q.get();
        const collisionDocs = collisionSnapshot.docs.filter(doc => doc.id !== pageId); // Exclude the current page
        
        if (collisionDocs.length === 0) {
            isUnique = true;
        } else {
            suffix++;
            finalSlug = `${pageSlug}-${suffix}`;
        }
    }
    pageSlug = finalSlug;
    // --- End of Slug Collision Check ---

    const PROD_BASE_DOMAIN = process.env.NEXT_PUBLIC_PROD_BASE_DOMAIN || "landed.pe";
    const DEV_HOST = process.env.NEXT_PUBLIC_DEV_HOST || "localhost:3000";

    const publicUrl = `https://${userSubdomain}.${PROD_BASE_DOMAIN}/${pageSlug}`;
    const devPublicUrl = `https://${DEV_HOST}/${userSubdomain}/${pageSlug}`;

    await pageRef.update({
      isPublished: true,
      userSubdomain, // This will be the newly found or existing subdomain
      pageSlug,
      publicUrl,
      devPublicUrl,
      publishedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`Page ${pageId} published successfully at ${publicUrl}`);
    
    const response: { success: boolean; publicUrl: string; devPublicUrl?: string } = {
        success: true,
        publicUrl,
    };

    if (user.role === 'admin') {
        response.devPublicUrl = devPublicUrl;
    }

    return response;

  } catch (error) {
    console.error("Error publishing landing page:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Unpublishes a landing page by setting `isPublished` to false.
 * This is a server action and requires admin privileges.
 * @param pageId The ID of the landing page to unpublish.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function unpublishLanding(pageId: string): Promise<boolean> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      console.error("Unpublishing error: User is not authenticated.");
      return false;
    }

    const pageRef = landingsCollection.doc(pageId);
    const docSnap = await pageRef.get();

    if (!docSnap.exists()) {
      console.error(`Unpublishing error: Page with ID ${pageId} not found.`);
      return false;
    }

    if (docSnap.data()?.userId !== user.uid) {
       console.error(`Unpublishing error: User ${user.uid} does not have permission to unpublish page ${pageId}.`);
       return false;
    }

    await pageRef.update({
      isPublished: false,
      publishedAt: null, // Clear the published date
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`Page ${pageId} unpublished successfully.`);
    return true;
  } catch (error) {
    console.error("Error unpublishing landing page:", error);
    return false;
  }
}
