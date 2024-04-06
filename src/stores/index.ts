import React from "react";
import BaseStore from "./baseStore";
import AuthStore from "./authStore";
import ProviderStore from "./providerStore";
import BlacklistStore from "./blacklistStore";
import WeightStore from "./weightStore";
import ServerStore from "./serverStore";
import ChannelStore from "./channelStore";
import UserStore from "./userStore";
import MessageStore from "./messageStore";
import AlertStore from "./alertStore";
import AlertHistoryStore from "./alertHistoryStore";

const authStore = new AuthStore();
const baseStore = new BaseStore(authStore);
const providerStore = new ProviderStore(authStore);
const serverStore = new ServerStore(authStore);
const channelStore = new ChannelStore(authStore);
const blacklistStore = new BlacklistStore(authStore);
const weightStore = new WeightStore(authStore);
const userStore = new UserStore(authStore);
const messageStore = new MessageStore(authStore);
const alertStore = new AlertStore(authStore);
const alertHistoryStore = new AlertHistoryStore(authStore);

const storesContext = React.createContext({
  authStore,
  baseStore,
  providerStore,
  blacklistStore,
  weightStore,
  serverStore,
  channelStore,
  userStore,
  messageStore,
  alertStore,
  alertHistoryStore,
});

const useStores = () => React.useContext(storesContext);
export default useStores;
