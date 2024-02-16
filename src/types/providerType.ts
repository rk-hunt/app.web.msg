type Provider = {
  _id: string;
  name: string;
  token: string;
  created_at: number;
  updated_at: number;
};

type ProviderServer = {
  _id: string;
  provider_id: string;
  provider_name: string;
  type: string;
  server_id: string;
  server_name: string;
  created_at: number;
  updated_at: number;
};

export type { Provider, ProviderServer };
