export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
  userId: string;
}

export interface DreamReq extends Omit<Dream, "id" | "userId"> {}

export interface DreamUpdate extends Partial<Dream> {
  id: string;
}
