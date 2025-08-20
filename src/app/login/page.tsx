
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo, GoogleIcon } from '@/components/icons';
import { app, db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const auth = getAuth(app);

function LoadingSpinner() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        setShowLoadingSpinner(true);
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);
  
  const handleUserInFirestore = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { uid, email, displayName, photoURL } = firebaseUser;
      
      const adminEmails = (process.env.NEXT_PUBLIC_ADMINS || '').split(',');
      const role = email && adminEmails.includes(email) ? 'admin' : 'client';
      
      await setDoc(userRef, {
        uid,
        email,
        displayName: displayName || email?.split('@')[0] || 'Usuario',
        photoURL: photoURL || null,
        createdAt: new Date(),
        role: role,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setShowLoadingSpinner(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleUserInFirestore(result.user);
      // The onAuthStateChanged listener will handle the redirect
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
      });
      setShowLoadingSpinner(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowLoadingSpinner(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await handleUserInFirestore(userCredential.user);
        toast({
          title: "¡Cuenta creada!",
          description: "Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.",
        });
        setIsSignUp(false);
        setShowLoadingSpinner(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          toast({
            variant: "destructive",
            title: "Verificación requerida",
            description: "Por favor, verifica tu correo electrónico antes de iniciar sesión. ¿Reenviar correo?",
            action: <Button onClick={async () => await sendEmailVerification(userCredential.user)}>Reenviar</Button>
          });
          setShowLoadingSpinner(false);
          setIsSubmitting(false);
          return;
        }
        // The onAuthStateChanged listener will handle the redirect
      }
    } catch (error: any) {
      let title = isSignUp ? "Error de registro" : "Error de inicio de sesión";
      let description = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";

      switch (error.code) {
        case 'auth/email-already-in-use':
          description = "Este correo electrónico ya está registrado. Intenta iniciar sesión.";
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          description = "El correo o la contraseña son incorrectos. Por favor, inténtalo de nuevo.";
          break;
        case 'auth/user-not-found':
          description = "No se encontró ninguna cuenta con este correo electrónico.";
          break;
        case 'auth/invalid-email':
          description = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          description = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
          break;
        case 'auth/unauthorized-domain':
            description = "El dominio de esta aplicación no está autorizado para operaciones de autenticación. Por favor, añádelo en la configuración de Firebase.";
            break;
        default:
          break;
      }
      
      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
      setShowLoadingSpinner(false);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      {showLoadingSpinner && <LoadingSpinner />}
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Logo className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? 'Crear una cuenta' : 'Bienvenido a Landed'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Completa tus datos para registrarte' : 'Ingresa para acceder a tu panel de control'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (isSignUp ? 'Creando cuenta...' : 'Ingresando...') : (isSignUp ? 'Crear cuenta' : 'Ingresar')}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              {isSignUp ? (
                <>
                  ¿Ya tienes una cuenta?{" "}
                  <Button variant="link" onClick={() => setIsSignUp(false)} className="p-0 h-auto" disabled={isSubmitting}>
                    Inicia sesión
                  </Button>
                </>
              ) : (
                <>
                  ¿No tienes una cuenta?{" "}
                  <Button variant="link" onClick={() => setIsSignUp(true)} className="p-0 h-auto" disabled={isSubmitting}>
                    Regístrate
                  </Button>
                </>
              )}
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  O continuar con
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
