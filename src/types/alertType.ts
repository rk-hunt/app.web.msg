import {
  AlertFrequencyType,
  AlertOperator,
  AlertRuleType,
  AlertType,
} from "../constants";

type Alert = {
  _id: string;
  name: string;
  frequency_type: AlertFrequencyType;
  filters: AlertFilter[];
  rules: AlertRule[];
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
  frequency_type: AlertFrequencyType;
  type: AlertRuleType;
  operator: string;
  times: string;
};

type AlertReq = {
  name: string;
  frequency_type: AlertFrequencyType;
  filters: AlertFilter[];
  rules: AlertRule[];
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
};
