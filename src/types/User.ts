export interface User {
  id: string;
  name: string;
}

export interface UserReq extends Omit<User, "id"> {}
