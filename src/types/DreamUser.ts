export interface DreamUser {
  id: string;
  name: string;
}

export interface UserReq extends Omit<DreamUser, "id"> {}
