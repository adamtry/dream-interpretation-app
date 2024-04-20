import { Dream, DreamReq } from "../types/Dream";

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

async function addDream(dreamReq: DreamReq, callback: (dream: Dream) => void) {
  const firestore = fetchFirestore();
  console.log(
    `Adding dream: ${dreamReq.title} ${dreamReq.description} ${dreamReq.date} to Firestore ${firestore.app.options.projectId}`,
  );
  // callback(dream);
  await addDoc(collection(firestore, "dreams"), dreamReq).then((docRef) => {
    const dream = {
      id: docRef.id,
      ...dreamReq,
    };
    callback(dream);
  });
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  const querySnapshot = await getDocs(collection(fetchFirestore(), "dreams"));
  return snapshotToDreams(querySnapshot);
}

export { addDream, getAllDreams };
