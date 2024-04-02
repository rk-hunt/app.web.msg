import { ProviderType } from "../constants";

type Provider = {
  _id: string;
  name: string;
  type: ProviderType;
  token: string;
  config?: {
    app_id: string;
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
  app_id?: string;
  app_hash?: string;
};

export type { Provider, ProviderInfo };
