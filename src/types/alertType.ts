import {
  AlertFrequencyType,
  AlertOperator,
  AlertRuleType,
  AlertType,
} from "../constants";
import { SelectLabelInValue } from "./commonType";

type Alert = {
  _id: string;
  name: string;
  frequency_type: AlertFrequencyType;
  filters: AlertFilter[];
  rules: AlertRule[];
  alert_channel_ids: any[];
  alert_channels?: AlertChannel[];
  alert_msg_template: string;
  last_alert_at: number;
  created_at: number;
  updated_at: number;
};

type AlertFilterBy = {
  name?: string;
  frequency_type?: AlertFrequencyType;
};

type AlertHistory = {
  _id: string;
  alert_at: number;
  message: string;
  created_at: number;
  updated_at: number;
};

type AlertFilterDateTime = {
  start: number;
  value: number;
  unit: "minutes" | "hours" | "days" | "months";
};

type AlertFilter = {
  field: string;
  type: AlertType;
  operator: AlertOperator;
  value: any | any[];
};

type AlertRule = {
  type: AlertRuleType;
  operator: AlertOperator;
  times: any;
};

type AlertFilterForm = {
  key: number;
  field?: string;
  type?: AlertType;
  operator?: AlertOperator;
  value?: any;
};

type AlertInfo = {
  _id?: string;
  name: string;
  alert_channels: SelectLabelInValue[];
  alert_msg_template: string;
  frequency_type: AlertFrequencyType;
  type: AlertRuleType;
  operator: string;
  times: string;
};

type AlertReq = {
  name: string;
  frequency_type: AlertFrequencyType;
  alert_channel_ids: any[];
  alert_msg_template: string;
  filters: AlertFilter[];
  rules: AlertRule[];
};

type AlertChannel = {
  _id: string;
  name: string;
  bot_token: string;
  channel_id: string;
  created_at: number;
  updated_at: number;
};

type AlertChannelInfo = {
  name: string;
  bot_token: string;
  channel_id: string;
};

type AlertChannelFilterBy = {
  name?: string;
};

export type {
  Alert,
  AlertHistory,
  AlertFilterBy,
  AlertFilterDateTime,
  AlertFilter,
  AlertFilterForm,
  AlertRule,
  AlertInfo,
  AlertReq,
  AlertChannel,
  AlertChannelInfo,
  AlertChannelFilterBy,
};
