
"use server";

import { db, auth } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import type { LandingPageData } from "@/lib/types";

const landingsCollection = collection(db, "landings");

const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    // onAuthStateChanged returns an unsubscriber, but also resolves with the user
    // on the initial call if the SDK has already initialized and knows the user state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};


/**
 * Creates a new landing page document in Firestore.
 * @param {Partial<LandingPageData>} data - The initial data for the new landing page.
 * @returns {Promise<string | null>} The ID of the newly created landing page, or null on error.
 */
export async function createLandingPage(data: Partial<LandingPageData>): Promise<string | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Authentication required to create a landing page.");
    }

    const newId = uuidv4();
    const now = serverTimestamp();

    const newLanding: LandingPageData = {
      id: newId,
      userId: currentUser.uid,
      name: data.name || "Nueva Página de Aterrizaje",
      subdomain: data.subdomain || `pagina-${newId.substring(0, 8)}`,
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
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(landingsCollection, newId), newLanding);
    return newId;
  } catch (error) {
    console.error("Error creating landing page:", error);
    return null;
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
      throw new Error("Authentication required.");
    }
    
    const docRef = doc(db, "landings", pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as LandingPageData;
        if(data.userId === currentUser.uid) {
            return data;
        }
        console.error("User does not have permission to access this page.");
        return null;
    } else {
      console.log("No such document!");
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
        
        const landings = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<LandingPageData, 'createdAt' | 'updatedAt'> & { createdAt: any, updatedAt: any };
            return {
                ...data,
                // Firestore Timestamps need to be handled carefully in Server Components
                // For now, we'll pass them as-is, but they might need conversion for the client
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as LandingPageData;
        });
        return landings;

    } catch (error) {
        console.error("Error fetching user landings: ", error);
        return [];
    }
}


/**
 * Updates a landing page document in Firestore.
 * @param {string} pageId - The ID of the landing page to update.
 * @param {Partial<LandingPageData>} data - The data to update.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function updateLandingPage(pageId: string, data: Partial<LandingPageData>): Promise<boolean> {
  try {
    const pageRef = doc(db, "landings", pageId);
    // Ensure the page exists and the user has permission before updating
    const existingPage = await getLandingPage(pageId);
    if (!existingPage) {
        return false; // getLandingPage already handles auth check
    }

    await updateDoc(pageRef, {
      ...data,
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
    const pageRef = doc(db, "landings", pageId);
    const existingPage = await getLandingPage(pageId);
    if (!existingPage) {
        return false; // getLandingPage already handles auth check
    }

    await deleteDoc(pageRef);
    return true;
  } catch (error) {
    console.error("Error deleting landing page:", error);
    return false;
  }
}
