
"use server";

import { db, auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';
import { promises as dns } from 'dns';

const domainsCollection = db.collection('domains');

// --- Helpers ---

async function getAuthenticatedUser() {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) return null;
    return await auth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
  return domainRegex.test(domain);
}

// --- Constants for Verification ---
const A_RECORD_VALUE = "76.76.21.21";
const TXT_RECORD_PREFIX = "landed-verification=";


// --- Server Actions ---

/**
 * Adds a new custom domain for the authenticated user.
 * @param domainName The domain name to add (e.g., "my-cool-site.com").
 * @returns A promise that resolves to an object indicating success or failure.
 */
export async function addCustomDomain(domainName: string): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const normalizedDomain = domainName.toLowerCase().trim();
  if (!isValidDomain(normalizedDomain)) {
    return { success: false, error: "Formato de dominio no válido." };
  }
  
  try {
    const existingDomainQuery = await domainsCollection.where('name', '==', normalizedDomain).limit(1).get();
    if (!existingDomainQuery.empty) {
        return { success: false, error: "Este dominio ya ha sido añadido." };
    }

    const verificationTxt = `${TXT_RECORD_PREFIX}${user.uid}`;

    await domainsCollection.add({
      userId: user.uid,
      name: normalizedDomain,
      status: 'pending',
      addedAt: FieldValue.serverTimestamp(),
      verificationTxt,
    });
    
    return { success: true };

  } catch (error) {
    console.error("Error adding custom domain:", error);
    return { success: false, error: "No se pudo añadir el dominio. Inténtalo de nuevo." };
  }
}

/**
 * Verifies a custom domain by checking its DNS records.
 * @param domainId The Firestore document ID of the domain to verify.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export async function verifyCustomDomain(domainId: string): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { success: false, error: "Authentication required." };
    }

    const domainRef = domainsCollection.doc(domainId);
    
    try {
        const domainDoc = await domainRef.get();
        if (!domainDoc.exists || domainDoc.data()?.userId !== user.uid) {
            return { success: false, error: "Domain not found or permission denied." };
        }
        
        const { name, verificationTxt } = domainDoc.data()!;

        // 1. Verify A record
        const aRecords = await dns.resolve4(name);
        if (!aRecords.includes(A_RECORD_VALUE)) {
            return { success: false, error: `El registro A no apunta a ${A_RECORD_VALUE}.` };
        }

        // 2. Verify TXT record
        const txtRecords = await dns.resolveTxt(name);
        // dns.resolveTxt returns arrays of chunks for a single record, so we flatten them
        const flatTxtRecords = txtRecords.flat();
        if (!flatTxtRecords.includes(verificationTxt)) {
             return { success: false, error: "El registro TXT de verificación no se encontró o no es correcto." };
        }

        // 3. If both pass, update status
        await domainRef.update({
            status: 'verified',
            verifiedAt: FieldValue.serverTimestamp(),
        });
        
        return { success: true };

    } catch (error: any) {
        console.error("Error verifying domain:", error);
        // Provide more specific feedback for common DNS errors
        if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
            return { success: false, error: `No se encontraron registros DNS para ${error.hostname}. Asegúrate de que los registros se hayan propagado.` };
        }
        return { success: false, error: "Error de verificación. Asegúrate de que los registros DNS sean correctos y se hayan propagado." };
    }
}

/**
 * Deletes a custom domain for the authenticated user.
 * @param domainId The Firestore document ID of the domain to delete.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export async function deleteCustomDomain(domainId: string): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { success: false, error: "Authentication required." };
    }
    
    const domainRef = domainsCollection.doc(domainId);

    try {
        const domainDoc = await domainRef.get();
        if (!domainDoc.exists || domainDoc.data()?.userId !== user.uid) {
            return { success: false, error: "Domain not found or permission denied." };
        }

        await domainRef.delete();
        
        return { success: true };

    } catch (error) {
        console.error("Error deleting domain:", error);
        return { success: false, error: "No se pudo eliminar el dominio." };
    }
}
