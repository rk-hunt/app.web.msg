import {
  ProviderServerType,
  ProviderType,
  ServerChannelType,
} from "../constants";
import { SelectLabelInValue } from "./commonType";

type Provider = {
  _id: string;
  name: string;
  type: ProviderType;
  token: string;
  created_at: number;
  updated_at: number;
};

type ProviderInfo = {
  token: string;
};

type Server = {
  _id: string;
  provider_id: string;
  provider_name: string;
  type: ProviderServerType;
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
  _id?: string;
  provider: SelectLabelInValue;
  type: ProviderServerType;
  server_id: string;
  server_name: string;
};

type ServerReqInfo = {
  _id?: string;
  provider_id: string;
  type: ProviderServerType;
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

type ChannelInfo = {
  _id?: string;
  server: SelectLabelInValue;
  type: ServerChannelType;
  channel_id?: string;
  channel_name?: string;
};

type ChannelReqInfo = {
  _id?: string;
  type: ServerChannelType;
  server_id: string;
  channel_id?: string;
  channel_name?: string;
};

export type {
  Provider,
  ProviderInfo,
  Server,
  ServerFilterBy,
  ServerInfo,
  ServerReqInfo,
  Channel,
  ChannelFilterBy,
  ChannelInfo,
  ChannelReqInfo,
};
