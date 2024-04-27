import { Dream, DreamReq, DreamUpdate } from "../types/Dream";

import "firebase/firestore";
import { QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
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

async function addDream(dreamReq: DreamReq) {
  const firestore = fetchFirestore();
  console.log(
    `Adding dream: ${dreamReq.title} ${dreamReq.description} ${dreamReq.date} to Firestore ${firestore.app.options.projectId}`,
  );

  await addDoc(collection(firestore, "dreams"), dreamReq).then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });
}

async function getDream(id: string): Promise<Dream | undefined> {
  console.log("Fetch dream");
  const firestore = fetchFirestore();
  const dreamDoc = doc(firestore, "dreams", id);
  const dream = await getDoc(dreamDoc).then((doc) => {
    if (!doc.exists()) {
      throw new Error(`No dream with id ${id}`);
    }
    const data = doc.data() as Dream;
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      date: data.date,
    } as Dream;
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

async function deleteDream(id: string): Promise<void> {
  const firestore = fetchFirestore();
  console.log(`Deleting dream: ${id} from Firestore ${firestore.app.options.projectId}`);

  const dreamDoc = doc(firestore, "dreams", id);
  deleteDoc(dreamDoc).then(() => {
    console.log("Document deleted with ID: ", id);
  });
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  console.log("Fetch all dreams");
  const querySnapshot = await getDocs(collection(fetchFirestore(), "dreams"));
  return snapshotToDreams(querySnapshot);
}

export { addDream, deleteDream, getAllDreams, getDream, updateDream };
