import { User, getAuth } from "firebase/auth";
import useSWR, { SWRResponse, mutate } from "swr";
import { Dream, DreamReq, DreamUpdate } from "../types/Dream";
import { DreamUser } from "../types/DreamUser";

export const DREAMFLOW_API_URL = import.meta.env.VITE_DREAMFLOW_API_URL;

export function fetchUser(): User {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not logged in");
  return user;
}

async function fetchAuthHeader(): Promise<string> {
  return `Bearer ${await fetchUser().getIdToken()}`;
}

/**
 * Fetches data from the given URL - used by SWR for data fetching
 * This can be cached and revalidated by SWR
 */
export async function fetcher(url: string): Promise<{ data: any; headers: Headers }> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: await fetchAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  const data = await response.json();
  const headers = await response.headers;

  return { data, headers };
}

export function useDreams(queryParams?: Record<string, string>): SWRResponse<{ data: Dream[]; headers: Headers }> {
  const queryString = new URLSearchParams(queryParams).toString();
  return useSWR<{ data: Dream[]; headers: Headers }>(`${DREAMFLOW_API_URL}/dreams/?${queryString}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 2 || error.status === 404 || error.status >= 500) {
        mutate((key: string) => key.split("?")[0].endsWith("/dreams/"));
      }
      return new Promise((resolve) => setTimeout(resolve, 5000));
    },
  });
}

export function useDream(id: string): SWRResponse<{ data: Dream; headers: Headers }> {
  return useSWR<{ data: Dream; headers: Headers }>(`${DREAMFLOW_API_URL}/dreams/${id}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 2 || error.status === 404 || error.status >= 500) {
        mutate((key: string) => key.includes(`/dreams/${id}`));
      }
      return new Promise((resolve) => setTimeout(resolve, 5000));
    },
  });
}

async function addDream(dreamReq: DreamReq): Promise<Dream> {
  console.log(`Adding dream: ${dreamReq.title} ${dreamReq.description} ${dreamReq.date}`);
  const response = await fetch(`${DREAMFLOW_API_URL}/dreams/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: await fetchAuthHeader(),
    },
    body: JSON.stringify(dreamReq),
  });

  if (!response.ok) {
    throw new Error("Failed to add dream");
  }

  mutate((key: string) => key.includes("/dreams/"));
  return response.json() as Promise<Dream>;
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

  mutate((key: string) => key.includes("/dreams/"));

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

  mutate((key: string) => key.includes(`/dreams/${id}`), undefined, false);
  mutate((key: string) => key.startsWith(`${DREAMFLOW_API_URL}/dreams`));
}

async function deleteUserAndAllDreams() {
  console.log("Deleting user and all dreams");
  const user = fetchUser();
  const response = await fetch(`${DREAMFLOW_API_URL}/users/${user.uid}`, {
    method: "DELETE",
    headers: {
      Authorization: await fetchAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
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

async function getAllDreams(): Promise<Dream[]> {
  console.log(`Fetching all dreams`);

  const params = new URLSearchParams({
    page: "1",
    page_size: "100",
  });

  var allDreams: Dream[] = [];
  while (true) {
    const response = await fetch(`${DREAMFLOW_API_URL}/dreams/?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: await fetchAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get dreams");
    }

    const dreamData = (await response.json()) as Dream[];

    allDreams.push(...dreamData);

    const totalPagesHeader = response.headers.get("X-Total-Pages");
    var page = parseInt(params.get("page") || "1");
    const morePagesExist = totalPagesHeader ? page < parseInt(totalPagesHeader) : false;
    if (!morePagesExist) break;
    const nextPage = response.headers.get("X-Next-Page") || (parseInt(params.get("page") || "1") + 1).toString();
    params.set("page", nextPage);
  }

  return allDreams;
}

export { addDream, deleteDream, deleteUserAndAllDreams, getAllDreams, getDream, tryCreateDreamUser, updateDream };
