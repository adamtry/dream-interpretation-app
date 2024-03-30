import { DBSchema, openDB } from "idb";
import { Dream } from "../types/Dream";

interface DreamDB extends DBSchema {
  dreams: {
    value: {
      title: string;
      description: string;
      date: string;
    };
    key: number;
    indexes: { "by-date": string };
    autoIncrement: true;
  };
}

export async function createIndexedDb() {
  const db = await openDB<DreamDB>("index-db", 1, {
    upgrade(db) {
      const dreamStore = db.createObjectStore("dreams", {
        autoIncrement: true,
      });
      dreamStore.createIndex("by-date", "dreams");
    },
  });
  return db;
}

interface AddDreamProps {
  dream: Dream;
  callback: (dream: Dream) => void;
}

export async function addDream({ dream, callback }: AddDreamProps) {
  const { title, description, date } = dream;
  const db = await openDB<DreamDB>("index-db", 1);
  await db
    .put("dreams", {
      title,
      description,
      date,
    })
    .then(() => {
      callback(dream);
    });
}

export async function getAllDreams(): Promise<Dream[]> {
  const db = await openDB<DreamDB>("index-db", 1);
  const transaction = db.transaction("dreams");
  const objectStore = transaction.objectStore("dreams");
  const res = await objectStore.getAll();
  // Reverse by date
  res.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  return res;
}
