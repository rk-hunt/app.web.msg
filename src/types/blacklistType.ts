import { BlacklistType } from "../constants";
import { SelectLabelInValue } from "./commonType";

type Blacklist = {
  _id: string;
  type: BlacklistType;
  value: string;
  created_at: number;
  updated_at: number;
};

type BlacklistInfo = {
  type: SelectLabelInValue;
  value: string;
};

type BlacklistFilterBy = {
  type?: BlacklistType;
  value?: string;
};

export type { Blacklist, BlacklistFilterBy, BlacklistInfo };
