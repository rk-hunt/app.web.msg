import { ProviderServerType } from "../constants";
import { SelectLabelInValue } from "./commonType";

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

export type { Server, ServerFilterBy, ServerInfo, ServerReqInfo };
