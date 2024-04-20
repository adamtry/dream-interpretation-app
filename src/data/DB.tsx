import { Dream, DreamReq } from "../types/Dream";

import "firebase/firestore";
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";
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

async function addDream(dream: DreamReq, callback: (dream: DreamReq) => void) {
  const firestore = fetchFirestore();
  console.log(
    `Adding dream: ${dream.title} ${dream.description} ${dream.date} to Firestore ${firestore.app.options.projectId}`,
  );
  callback(dream);
  // await addDoc(collection(firestore, "dreams"), dream).then(() => {
  //   callback(dream);
  // });
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  const querySnapshot = await getDocs(collection(fetchFirestore(), "dreams"));
  return snapshotToDreams(querySnapshot);
}

export { addDream, getAllDreams };
