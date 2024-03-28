import { MessageRefreshInterval } from "../types";

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
    name: "Users",
    icon: "users",
    url: "/users",
    key: "users",
  },
];

const datetimeFormat = "DD/MM/YY HH:mm:ss";

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

const localStorageKey = {
  msgInterval: "msg_interval",
};

export { menus, datetimeFormat, refreshItems, localStorageKey };
