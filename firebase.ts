
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isDemoMode = false;

try {
  const configStr = process.env.FIREBASE_CONFIG;
  if (configStr && configStr !== '{}') {
    const firebaseConfig = JSON.parse(configStr);
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("No Firebase config found, switching to Demo Mode.");
    isDemoMode = true;
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  isDemoMode = true;
}

export { auth, db, isDemoMode };
