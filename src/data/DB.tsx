import { Dream } from "../types/Dream";

import "firebase/firestore";
import { QuerySnapshot, addDoc, collection, getDocs } from "firebase/firestore";
import { fetchFirestore } from "./Firestore";

function snapshotToDreams(snapshot: QuerySnapshot): Dream[] {
  const dreamList: Dream[] = [];
  snapshot.forEach((doc: any) => {
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

async function addDream(dream: Dream, callback: (dream: Dream) => void) {
  const firestore = fetchFirestore();
  await addDoc(collection(firestore, "dreams"), dream).then(() => {
    callback(dream);
  });
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  const querySnapshot = await getDocs(collection(fetchFirestore(), "dreams"));
  return snapshotToDreams(querySnapshot);
}

export { addDream, getAllDreams };
