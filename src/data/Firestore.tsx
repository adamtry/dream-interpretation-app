import { FirebaseApp, initializeApp } from "firebase/app";
import { CACHE_SIZE_UNLIMITED, Firestore, initializeFirestore } from "firebase/firestore";

function fetchFirebaseApp(): FirebaseApp {
  const firebaseOptions = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
  const app = initializeApp(firebaseOptions);
  return app;
}

export function fetchFirestore(): Firestore {
  const APP = fetchFirebaseApp();
  const firestoreSettings = {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  };
  const firestore = initializeFirestore(APP, firestoreSettings);
  return firestore;
}
