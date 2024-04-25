import { Dream, DreamReq, DreamUpdate } from "../types/Dream";

import "firebase/firestore";
import { QuerySnapshot, addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
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

  await addDoc(collection(firestore, "dreams"), dreamReq).then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    const dream = {
      id: docRef.id,
      ...dreamReq,
    };
    callback(dream);
  });
}

async function getDream(id: string): Promise<Dream | undefined> {
  const firestore = fetchFirestore();
  const dreamDoc = doc(firestore, "dreams", id);
  const dream = await getDoc(dreamDoc)
    .then((doc) => {
      const data = doc.data() as Dream;
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.date,
      } as Dream;
    })
    .catch((error) => {
      console.error("Error getting dream: ", error);
      return undefined;
    });
  return dream;
}

async function updateDream(dreamUpdate: DreamUpdate): Promise<string | undefined> {
  const firestore = fetchFirestore();
  console.log(
    `Updating dream: ${dreamUpdate.title} ${dreamUpdate.description} ${dreamUpdate.date} in Firestore ${firestore.app.options.projectId}`,
  );

  const dreamDoc = doc(firestore, "dreams", dreamUpdate.id);

  updateDoc(dreamDoc, { ...dreamUpdate }).then(() => {
    console.log("Document updated with ID: ", dreamUpdate.id);
    return dreamUpdate.id;
  });
  return undefined;
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  const querySnapshot = await getDocs(collection(fetchFirestore(), "dreams"));
  return snapshotToDreams(querySnapshot);
}

export { addDream, getAllDreams, getDream, updateDream };
