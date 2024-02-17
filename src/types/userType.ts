import { UserStatus } from "../constants";

type User = {
  _id: string;
  name: string;
  username?: string;
  email: string;
  last_login_at?: string;
  is_admin: boolean;
  status: UserStatus;
  created_at: number;
  updated_at: number;
};

export type { User };
