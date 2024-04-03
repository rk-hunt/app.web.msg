import { ProviderType } from "../constants";

type Provider = {
  _id: string;
  name: string;
  type: ProviderType;
  token: string;
  config?: {
    app_id: number;
    app_hash: string;
  };
  created_at: number;
  updated_at: number;
};

type ProviderInfo = {
  _id?: string;
  name: string;
  type: ProviderType;
  token?: string;
  api_id?: number;
  api_hash?: string;
};

export type { Provider, ProviderInfo };
