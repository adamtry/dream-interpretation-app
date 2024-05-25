import { Dream, DreamReq, DreamUpdate } from "../types/Dream";


const USER_ID = "540e507a-ea64-4382-8ee0-53a47a4ecc9f";
const DREAMFLOW_API_URL = import.meta.env.VITE_DREAMFLOW_API_URL;

async function addDream(dreamReq: DreamReq) {
  console.log(`Adding dream: ${dreamReq.title} ${dreamReq.description} ${dreamReq.date} to Firestore`);

  await fetch(`${DREAMFLOW_API_URL}/users/${USER_ID}/dreams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dreamReq),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to add dream");
    }
  });
}

async function getDream(id: string): Promise<Dream | undefined> {
  console.log(`Fetch dream with id: ${id}`);
  const response = await fetch(`${DREAMFLOW_API_URL}/dreams/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw new Error(`No dream with id ${id}`);
  }
  return response.json() as Promise<Dream>;
}


async function updateDream(dreamUpdate: DreamUpdate): Promise<string | undefined> {
  console.log(`Updating dream ${dreamUpdate.id}: ${dreamUpdate.title} ${dreamUpdate.description} ${dreamUpdate.date}`);
  const response = await fetch(`${DREAMFLOW_API_URL}/dreams/${dreamUpdate.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dreamUpdate),
  })
  
  if (!response.ok) {
    throw new Error("Failed to update dream");
  }
  
  return dreamUpdate.id;

}

async function deleteDream(id: string): Promise<void> {
  console.log(`Deleting dream: ${id}`);
  const response = await fetch(`${DREAMFLOW_API_URL}/dreams/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete dream");
  }
}

async function getAllDreams(userId?: string): Promise<Dream[]> {
  userId = userId || USER_ID;
  console.log(`Fetching all dreams for user ${userId}`);

  const response = await fetch(`${DREAMFLOW_API_URL}/users/${userId}/dreams`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get all dreams");
  }

  const dreamData = await response.json() as Dream[];
  return dreamData;
}

export { addDream, deleteDream, getAllDreams, getDream, updateDream };