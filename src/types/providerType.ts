import { ProviderType, ServerChannelType } from "../constants";

type Provider = {
  _id: string;
  name: string;
  token: string;
  created_at: number;
  updated_at: number;
};

type Server = {
  _id: string;
  provider_id: string;
  provider_name: string;
  type: ProviderType;
  server_id: string;
  server_name: string;
  created_at: number;
  updated_at: number;
};

type ServerFilterBy = {
  provider_id?: string;
  server_id?: string;
  server_name?: string;
};

type ServerInfo = {
  provider_id: string;
  type: ProviderType;
  server_id: string;
  server_name: string;
};

type Channel = {
  _id: string;
  provider_id: string;
  provider_name: string;
  type: ServerChannelType;
  server_id: string;
  server_name: string;
  channel_id: string;
  channel_name: string;
  created_at: number;
  updated_at: number;
};

type ChannelFilterBy = {
  server_id?: string;
  channel_id?: string;
  channel_name?: string;
};

export type {
  Provider,
  Server,
  ServerFilterBy,
  ServerInfo,
  Channel,
  ChannelFilterBy,
};
