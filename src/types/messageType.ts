import { ProviderType } from "../constants";
import { DateRange, SelectLabelInValue } from "./commonType";

type Message = {
  _id: string;
  provider_id: string;
  provider_name: string;
  provider_type: ProviderType;
  server_id: string;
  server_name: string;
  channel_id?: string;
  channel_name?: string;
  received_at: number;
  author_id: string;
  author_username?: string;
  author_display_name?: string;
  content: string;
  weight: number;
  highlight?: boolean;
  created_at: number;
  updated_at: number;
};

type MessageFilterBy = {
  provider?: SelectLabelInValue;
  provider_id?: string;
  servers?: SelectLabelInValue[];
  server_id?: string[];
  channels?: SelectLabelInValue[];
  channel_id?: string[];
  author_username?: string;
  received_at?: DateRange;
  content?: string;
};

type MessageSortBy = {
  server_id?: string;
  author_username?: string;
  received_at?: string;
};

type MessageRefreshInterval = {
  key: number;
  label: string;
};

type MessageHighlightContent = MessageRefreshInterval;

export type {
  Message,
  MessageFilterBy,
  MessageRefreshInterval,
  MessageHighlightContent,
  MessageSortBy,
};
