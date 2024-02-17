import { UserStatus } from "../constants";

type User = {
  _id: string;
  name: string;
  username?: string;
  email: string;
  last_login_at?: number;
  is_admin: boolean;
  status: UserStatus;
  created_at: number;
  updated_at: number;
};

type UserFilterBy = {
  email?: string;
  status?: UserStatus;
};

export type { User, UserFilterBy };
