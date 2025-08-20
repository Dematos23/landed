
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const app: App = getApps().length ? getApps()[0] : initializeApp({
  credential: cert(serviceAccount),
});

const db: Firestore = getFirestore(app);
const authInstance: Auth = getAuth(app);

export { app, db, authInstance as auth, FieldValue };
