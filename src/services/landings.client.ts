
"use client";

import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  Timestamp
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import type { LandingPageData } from "@/lib/types";

const landingsCollection = collection(db, "landings");

const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

/**
 * Creates a new landing page document in Firestore from the client.
 * @param {Partial<LandingPageData>} data - The initial data for the new landing page.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function createLandingPage(data: Partial<LandingPageData>): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Authentication required to create a landing page.");
    }
    
    const pageId = data.id || uuidv4();
    const now = serverTimestamp();

    const newLanding: LandingPageData = {
      userId: currentUser.uid,
      createdAt: now as Timestamp,
      updatedAt: now as Timestamp,
      isPublished: false,
      id: pageId,
      name: data.name || "Nueva Página de Aterrizaje",
      subdomain: data.subdomain || `pagina-${pageId.substring(0, 8)}`,
      components: data.components || [],
      theme: data.theme || {
        primary: '#3F51B5',
        primaryForeground: '#FFFFFF',
        secondary: '#7986CB',
        accent: '#7C4DFF',
        foreground: '#1A237E',
        mutedForeground: '#5C6BC0',
        background1: '#E8EAF6',
        background2: '#FFFFFF',
        fontFamily: 'Inter',
      },
    };

    await setDoc(doc(landingsCollection, newLanding.id), newLanding);
    return true;
  } catch (error) {
    console.error("Error creating landing page:", error);
    return false;
  }
}

/**
 * Retrieves a single landing page document from Firestore.
 * @param {string} pageId - The ID of the landing page to retrieve.
 * @returns {Promise<LandingPageData | null>} The landing page data, or null if not found or on error.
 */
export async function getLandingPage(pageId: string): Promise<LandingPageData | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error("Authentication required.");
      return null;
    }
    
    const docRef = doc(db, "landings", pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as LandingPageData;
        if(data.userId === currentUser.uid) {
            const sanitizedComponents = data.components.map(component => {
                if (!component.props.padding) {
                    return {
                        ...component,
                        props: {
                            ...component.props,
                            padding: { top: 80, bottom: 80, left: 32, right: 32 }
                        }
                    };
                }
                return component;
            });
            return { ...data, components: sanitizedComponents };
        }
        console.error("User does not have permission to access this page.");
        return null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting landing page:", error);
    return null;
  }
}

/**
 * Retrieves all landing pages for the currently authenticated user.
 * @returns {Promise<LandingPageData[]>} An array of the user's landing pages.
 */
export async function getUserLandings(): Promise<LandingPageData[]> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            console.log("No authenticated user found.");
            return [];
        }

        const q = query(landingsCollection, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => doc.data() as LandingPageData);

    } catch (error) {
        console.error("Error fetching user landings: ", error);
        return [];
    }
}

/**
 * Updates a landing page document in Firestore from the client.
 * @param {string} pageId - The ID of the landing page to update.
 * @param {Partial<LandingPageData>} data - The data to update.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function updateLandingPage(pageId: string, data: Partial<LandingPageData>): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Authentication required.");
    }
    const pageRef = doc(db, "landings", pageId);
    
    // Ensure client cannot set isPublished
    const { isPublished, ...clientSafeData } = data;

    await updateDoc(pageRef, {
      ...clientSafeData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating landing page:", error);
    return false;
  }
}

/**
 * Deletes a landing page document from Firestore.
 * @param {string} pageId - The ID of the landing page to delete.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function deleteLandingPage(pageId: string): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser();
    const pageRef = doc(db, "landings", pageId);
    const docSnap = await getDoc(pageRef);

    if (!docSnap.exists() || docSnap.data().userId !== currentUser?.uid) {
        console.error("User does not have permission to delete this page or page does not exist.");
        return false;
    }

    await deleteDoc(pageRef);
    return true;
  } catch (error) {
    console.error("Error deleting landing page:", error);
    return false;
  }
}
