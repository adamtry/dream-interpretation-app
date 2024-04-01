import { Dream } from "../types/Dream";

import { addDoc, collection, getDocs } from "firebase/firestore";
import { fetchFirestore } from "./Firestore";

async function addDream(dream: Dream, callback: (dream: Dream) => void) {
  await addDoc(collection(fetchFirestore(), "dreams"), dream)
    .then((res) => {
      callback(dream);
      console.log("Document written with ID: ", res);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  const dreamList: Dream[] = [];
  const querySnapshot = await getDocs(collection(fetchFirestore(), "dreams"));
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
