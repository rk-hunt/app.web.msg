import { WeightType } from "../constants";

type Weight = {
  _id: string;
  type: WeightType;
  value: string;
  weight: number;
  created_at: number;
  updated_at: number;
};

export type { Weight };
