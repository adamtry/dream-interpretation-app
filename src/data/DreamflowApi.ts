import { User, getAuth } from "firebase/auth";
import { Dream, DreamReq, DreamUpdate } from "../types/Dream";
import { DreamUser } from "../types/User";

const DREAMFLOW_API_URL = import.meta.env.VITE_DREAMFLOW_API_URL;

function fetchUser(): User {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not logged in");

  return user;
}

async function fetchAuthHeader(): Promise<string> {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not logged in");
  return `Bearer ${await user.getIdToken()}`;
}

async function addDream(dreamReq: DreamReq) {
  console.log(`Adding dream: ${dreamReq.title} ${dreamReq.description} ${dreamReq.date} to Firestore`);
  await fetch(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: await fetchAuthHeader(),
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
    headers: {
      Authorization: await fetchAuthHeader(),
    },
  });
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
      Authorization: await fetchAuthHeader(),
    },
    body: JSON.stringify(dreamUpdate),
  });

  if (!response.ok) {
    throw new Error("Failed to update dream");
  }

  return dreamUpdate.id;
}

async function deleteDream(id: string): Promise<void> {
  console.log(`Deleting dream: ${id}`);
  const response = await fetch(`${DREAMFLOW_API_URL}/dreams/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: await fetchAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete dream");
  }
}

async function getAllDreams(): Promise<Dream[]> {
  console.log(`Fetching all dreams`);

  const response = await fetch(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams`, {
    method: "GET",
    headers: {
      Authorization: await fetchAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get all dreams");
  }

  const dreamData = (await response.json()) as Dream[];
  return dreamData;
}

async function getDreamUser(): Promise<DreamUser> {
  console.log("Fetching user");
  const response = await fetch(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}`, {
    method: "GET",
    headers: {
      Authorization: await fetchAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  return response.json() as Promise<DreamUser>;
}

async function tryCreateDreamUser() {
  const userDb = await getDreamUser().catch(() => undefined);
  if (userDb?.id) {
    console.log(`User ${userDb.id} already exists`);
    return;
  }

  console.log("Creating user");
  const user = fetchUser();
  const response = await fetch(`${DREAMFLOW_API_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: await fetchAuthHeader(),
    },
    body: JSON.stringify({ id: user.uid, name: "First Last" }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }
}

export { addDream, deleteDream, getAllDreams, getDream, tryCreateDreamUser, updateDream };
