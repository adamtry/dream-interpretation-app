import { User } from "./User";

export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
  user: User;
}

export interface DreamReq extends Omit<Dream, "id"> {}

export interface DreamUpdate extends Partial<Dream> {
  id: string;
}
