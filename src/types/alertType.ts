import { AlertFrequencyType } from "../constants";

type Alert = {
  _id: string;
  name: string;
  frequency_type: AlertFrequencyType;
  filters: any[];
  rules: any[];
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

export type { Alert, AlertHistory, AlertFilterBy };
