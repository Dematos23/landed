"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo, GoogleIcon } from '@/components/icons';
import { app, db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';


export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInFirestore = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      // The user document doesn't exist, create it
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date()
      });
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleUserInFirestore(result.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error de autenticación",
        description: "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // First, try to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleUserInFirestore(userCredential.user);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        // If user not found or wrong password, ask if they want to create an account
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await handleUserInFirestore(userCredential.user);
           toast({
            title: "Cuenta Creada",
            description: "¡Tu cuenta ha sido creada con éxito! Bienvenido.",
          });
          router.push('/dashboard');
        } catch (createError: any) {
          toast({
            title: "Error al crear cuenta",
            description: "No se pudo crear la cuenta. Por favor, verifica tus datos.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error de autenticación",
          description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Bienvenido a Landed</CardTitle>
          <CardDescription>Ingresa para acceder a tu panel de control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
              {isLoading ? 'Cargando...' : <> <GoogleIcon className="mr-2 h-4 w-4" /> Continuar con Google </>}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nombre@ejemplo.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
               <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Continuar con Correo'}
              </Button>
            </form>
        </CardContent>
        <CardFooter className="flex-col text-xs text-center text-muted-foreground">
           <p>
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="underline font-medium hover:text-primary">Términos de Servicio</a>
              {' y '} 
              <a href="#" className="underline font-medium hover:text-primary">Política de Privacidad</a>.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
