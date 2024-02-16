import { BlacklistType } from "../constants";

type Blacklist = {
  _id: string;
  type: BlacklistType;
  value: string;
  created_at: number;
  updated_at: number;
};

type BlacklistInfo = {
  type: string;
  value: string;
};

type BlacklistFilterBy = {
  type?: BlacklistType;
  value?: string;
};

export type { Blacklist, BlacklistFilterBy, BlacklistInfo };
