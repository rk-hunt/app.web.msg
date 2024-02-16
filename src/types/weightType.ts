import { WeightType } from "../constants";

type Weight = {
  _id: string;
  type: WeightType;
  value: string;
  weight: number;
  created_at: number;
  updated_at: number;
};

type WeightInfo = {
  type: string;
  value: string;
};

type WeightFilterBy = {
  type?: WeightType;
  value?: string;
};

export type { Weight, WeightInfo, WeightFilterBy };
