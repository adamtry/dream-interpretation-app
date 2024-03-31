import { Dream } from "../types/Dream";

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  initializeFirestore,
} from "firebase/firestore";

function fetchFirebaseApp(): FirebaseApp {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
  const app = initializeApp(firebaseConfig);
  return app;
}

function fetchFirestore(): Firestore {
  const APP = fetchFirebaseApp();
  const firestoreSettings = {
    ignoreUndefinedProperties: true,
    timestampsInSnapshots: true,
  };
  const firestore = initializeFirestore(APP, firestoreSettings);
  return firestore;
}

const FIRESTORE = fetchFirestore();

async function addDream(dream: Dream, callback: (dream: Dream) => void) {
  const res = await addDoc(collection(FIRESTORE, "dreams"), dream)
    .then(() => {
      callback(dream);
      console.log("Document written with ID: ", res);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  const dreamList: Dream[] = [];
  const querySnapshot = await getDocs(collection(FIRESTORE, "dreams"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const dream = {
      id: doc.id,
      title: data.title,
      description: data.description,
      date: data.date,
    } as Dream;
    dreamList.push(dream);
  });
  return dreamList;
}

export { addDream, getAllDreams };
