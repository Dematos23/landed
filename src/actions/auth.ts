
"use server";
import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

/**
 * Genera un cookie de sesión a partir del ID Token enviado por el cliente.
 */
export async function signInWithIdToken(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días en milisegundos
  // Crea el cookie de sesión con firebase-admin
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

  // Establece el cookie en la respuesta HTTP
  cookies().set("__session", sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/", // Disponible en todas las rutas
  });

  return { success: true };
}

/**
 * Elimina el cookie de sesión (logout).
 */
export async function signOut() {
  cookies().delete("__session");
  return { success: true };
}
