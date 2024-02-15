import React from "react";
import AuthStore from "./authStore";
import ProviderStore from "./providerStore";

const authStore = new AuthStore();
const providerStore = new ProviderStore(authStore);

const storesContext = React.createContext({
  authStore,
  providerStore,
});

const useStores = () => React.useContext(storesContext);
export default useStores;
