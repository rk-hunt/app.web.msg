import { DateRange } from "./commonType";

type Message = {
  _id: string;
  provider_id: string;
  provider_name: string;
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
  provider_id?: string;
  author_username?: string;
  received_at?: DateRange;
  content?: string;
};

export type { Message, MessageFilterBy };
