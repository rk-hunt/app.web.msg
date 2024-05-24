import { TableColumnsType } from "antd";
import { MessageHighlightContent, MessageRefreshInterval } from "../types";

const menus = [
  {
    name: "Providers",
    icon: "providers",
    url: "/providers",
    key: "providers",
  },
  {
    name: "Servers",
    icon: "servers",
    url: "/servers",
    key: "servers",
  },
  {
    name: "Channels",
    icon: "channels",
    url: "/channels",
    key: "channels",
  },
  {
    name: "Blacklists",
    icon: "blacklists",
    url: "/blacklists",
    key: "blacklists",
  },
  {
    name: "Weights",
    icon: "weights",
    url: "/weights",
    key: "weights",
  },
  {
    name: "Messages",
    icon: "messages",
    url: "/messages",
    key: "messages",
  },
  {
    name: "Alert Channels",
    icon: "alert-channels",
    url: "/alert-channels",
    key: "alert-channels",
  },
  {
    name: "Alerts",
    icon: "alerts",
    url: "/alerts",
    key: "alerts",
  },
  {
    name: "Alert Histories",
    icon: "alert-histories",
    url: "/alert-histories",
    key: "alert-histories",
  },
  {
    name: "Users",
    icon: "users",
    url: "/users",
    key: "users",
  },
  {
    name: "Imports",
    icon: "imports",
    url: "/imports",
    key: "imports",
  },
  {
    name: "Exports",
    icon: "exports",
    url: "/exports",
    key: "exports",
  },
];

const datetimeFormat = "DD/MM/YY HH:mm:ss";
const dateFormat = "DD/MM/YY";

const refreshItems: MessageRefreshInterval[] = [
  { key: 0, label: "Off" },
  // { key: 5000, label: "5s" },
  // { key: 10000, label: "10s" },
  { key: 30000, label: "30s" },
  { key: 60000, label: "1m" },
  { key: 300000, label: "5m" },
  { key: 900000, label: "15m" },
  { key: 1800000, label: "30m" },
];

const highlightContentItems: MessageHighlightContent[] = [
  { key: 0, label: "Off" },
  { key: 1, label: "On" },
];

const localStorageKey = {
  msgInterval: "msg_interval",
  msgHighlightContent: "msg_highlight_content",
};

const exportField = {
  provider: ["_id", "name", "type", "token", "api_id", "api_hash"],
  server: [
    "_id",
    "server_name",
    "server_id",
    "type",
    "provider_id",
    "provider_name",
  ],
  channel: [
    "_id",
    "channel_name",
    "channel_id",
    "type",
    "server_id",
    "server_name",
    "provider_id",
    "provider_name",
  ],
  weight: ["_id", "value", "type", "weight"],
  blacklist: ["_id", "value", "type"],
};
const importFileType = {
  csv: "text/csv",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
const importProviderColumns: TableColumnsType<any> = [
  { title: "Name", dataIndex: "name" },
  { title: "Type", dataIndex: "type" },
  { title: "Token", dataIndex: "token", ellipsis: true },
  { title: "API Id", dataIndex: "api_id" },
  { title: "API Hash", dataIndex: "api_hash", ellipsis: true },
];
const importServerColumns: TableColumnsType<any> = [
  { title: "Name", dataIndex: "server_name" },
  { title: "Server Id", dataIndex: "server_id" },
  { title: "Type", dataIndex: "type" },
  { title: "Provider Id", dataIndex: "provider_id" },
  { title: "Provider", dataIndex: "provider_name" },
];
const importChannelColumns: TableColumnsType<any> = [
  { title: "Name", dataIndex: "channel_name" },
  { title: "Channel Id", dataIndex: "channel_id" },
  { title: "Type", dataIndex: "type" },
  { title: "Server Id", dataIndex: "server_id" },
  { title: "Server", dataIndex: "server_name" },
  { title: "Provider Id", dataIndex: "provider_id" },
  { title: "Provider", dataIndex: "provider_name" },
];
const importWeightColumns: TableColumnsType<any> = [
  { title: "Value", dataIndex: "value" },
  { title: "Type", dataIndex: "type" },
  { title: "Weight", dataIndex: "weight" },
];
const importBlacklistColumns: TableColumnsType<any> = [
  { title: "Value", dataIndex: "value" },
  { title: "Type", dataIndex: "type" },
];
const numberImportPerRequest = 25;

const numberFields = ["weight", "api_id"];
const importOptionalFields = ["api_id", "api_hash"];

const providerLink = {
  Discord: "https://discord.com/channels",
  Telegram: "https://web.telegram.org/a/#",
};

const fieldTypes = [
  {
    name: "provider_id",
    field: "providers",
    type: "objectId",
  },
  {
    name: "server_id",
    field: "servers",
    type: "string",
  },
  {
    name: "channel_id",
    field: "channels",
    type: "string",
  },
  {
    name: "author_username",
    field: "authors",
    type: "string",
  },
  {
    name: "received_at",
    field: "received_at",
    type: "datetime",
  },
  {
    name: "content",
    field: "content",
    type: "search",
  },
];

const alertFieldValues = [
  {
    value: "providers",
    label: "Provider",
  },
  {
    value: "servers",
    label: "Server",
  },
  {
    value: "channels",
    label: "Channels",
  },
  {
    value: "authors",
    label: "Authors",
  },
  {
    value: "received_at",
    label: "Received At",
  },
  {
    value: "content",
    label: "Content",
  },
];

export {
  menus,
  datetimeFormat,
  dateFormat,
  refreshItems,
  highlightContentItems,
  localStorageKey,
  exportField,
  importFileType,
  importProviderColumns,
  importServerColumns,
  importChannelColumns,
  importWeightColumns,
  importBlacklistColumns,
  numberImportPerRequest,
  numberFields,
  importOptionalFields,
  providerLink,
  fieldTypes,
  alertFieldValues,
};
