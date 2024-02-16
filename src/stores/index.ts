import React from "react";
import AuthStore from "./authStore";
import ProviderStore from "./providerStore";
import BlacklistStore from "./blacklistStore";
import WeightStore from "./weightStore";

const authStore = new AuthStore();
const providerStore = new ProviderStore(authStore);
const blacklistStore = new BlacklistStore(authStore);
const weightStore = new WeightStore(authStore);

const storesContext = React.createContext({
  authStore,
  providerStore,
  blacklistStore,
  weightStore,
});

const useStores = () => React.useContext(storesContext);
export default useStores;
