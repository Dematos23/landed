
"use server";

import { db, auth } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
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
 * Creates a new landing page document in Firestore.
 * @param {Partial<LandingPageData>} data - The initial data for the new landing page, must include an ID.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function createLandingPage(data: Partial<LandingPageData>): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Authentication required to create a landing page.");
    }
    
    if (!data.id) {
        throw new Error("An ID must be provided to create a landing page.");
    }

    const now = serverTimestamp();

    // The data parameter already contains the structure of LandingPageData from the client
    const newLanding: LandingPageData = {
      userId: currentUser.uid,
      createdAt: now,
      updatedAt: now,
      isPublished: false,
      // Ensure all fields from data are spread, and default values are applied if missing
      id: data.id,
      name: data.name || "Nueva Página de Aterrizaje",
      subdomain: data.subdomain || `pagina-${data.id.substring(0, 8)}`,
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
      // Allow fetching if the user is not logged in, for published pages, but for now we restrict it.
      // This could be changed later if we want public pages.
      console.error("Authentication required.");
      return null;
    }
    
    const docRef = doc(db, "landings", pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as LandingPageData;
        // Only return data if the user owns the page
        if(data.userId === currentUser.uid) {
            // Ensure backwards compatibility for pages saved before padding was introduced
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
      // This is expected when checking for a new page, so not an error.
      // console.log("No such document!");
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
    const currentUser = await getCurrentUser();
     if (!currentUser) {
      throw new Error("Authentication required.");
    }

    const pageRef = doc(db, "landings", pageId);
    // We don't need to check for existence here again as the save handler does it.
    // We just need to make sure we have a user.

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
    // Ensure the page exists and the user has permission before deleting
    const existingPage = await getLandingPage(pageId);
    if (!existingPage) {
        // getLandingPage already handles auth check and console logs
        return false; 
    }

    await deleteDoc(pageRef);
    return true;
  } catch (error) {
    console.error("Error deleting landing page:", error);
    return false;
  }
}
