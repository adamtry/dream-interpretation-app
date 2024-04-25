export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
}

/**
 * Represents a Dream object before it is sent to the server\
 * It matches the schema of Dream, but the id is not set
 */
export interface DreamReq extends Omit<Dream, "id"> {}

export interface DreamUpdate extends Partial<Dream> {
  id: string;
}
