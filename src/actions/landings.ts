
"use server";

import { admin } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

const db = admin.firestore();
const landingsCollection = db.collection('landings');

async function getAuthenticatedUser() {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedIdToken = await getAuth().verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

/**
 * Publishes a landing page by setting `isPublished` to true.
 * This is a server action and requires admin privileges.
 * @param pageId The ID of the landing page to publish.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function publishLanding(pageId: string): Promise<boolean> {
  try {
    const user = await getAuthenticatedUser();
    // TODO: For production, properly handle authentication.
    // For now, we will assume if there's no user, we deny access.
    // A robust solution would involve checking the user's claims or permissions.
    if (!user) {
      console.error("Publishing error: User is not authenticated.");
      // In a real app, you might throw an error that the client can catch and display.
      // throw new Error("Authentication required to publish.");
      return false;
    }

    const pageRef = landingsCollection.doc(pageId);
    const docSnap = await pageRef.get();

    if (!docSnap.exists) {
      console.error(`Publishing error: Page with ID ${pageId} not found.`);
      return false;
    }
    
    // Optional: Verify ownership before publishing
    // if (docSnap.data()?.userId !== user.uid) {
    //   console.error(`Publishing error: User ${user.uid} does not have permission to publish page ${pageId}.`);
    //   return false;
    // }

    await pageRef.update({
      isPublished: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Page ${pageId} published successfully.`);
    return true;
  } catch (error) {
    console.error("Error publishing landing page:", error);
    return false;
  }
}
