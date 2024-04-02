import { ServerChannelType } from "../constants";
import { SelectLabelInValue } from "./commonType";

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

export type { Channel, ChannelFilterBy, ChannelInfo, ChannelReqInfo };
