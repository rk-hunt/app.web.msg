import React from "react";
import AuthStore from "./authStore";
import ProviderStore from "./providerStore";
import BlacklistStore from "./blacklistStore";

const authStore = new AuthStore();
const providerStore = new ProviderStore(authStore);
const blacklistStore = new BlacklistStore(authStore);

const storesContext = React.createContext({
  authStore,
  providerStore,
  blacklistStore,
});

const useStores = () => React.useContext(storesContext);
export default useStores;
