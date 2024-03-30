import { DBSchema, openDB } from "idb";

type Dream = {
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
};

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

export async function addDream({ title, description, date }: Dream) {
  const db = await openDB<DreamDB>("index-db", 1);
  await db.put("dreams", {
    title,
    description,
    date,
  });
}
