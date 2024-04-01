import { action, makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";
import { Provider, ProviderInfo } from "../types";
import AuthStore from "./authStore";

export default class ProviderStore extends BaseStore<Provider> {
  provider: Provider = {} as any;
  providerInfo: ProviderInfo = {} as any;

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      provider: observable,
      providerInfo: observable,
      setProvider: action,
      setProviderInfo: action,
    });
  }

  setProvider(val: Provider) {
    this.provider = val;
  }

  setProviderInfo(val: ProviderInfo) {
    this.providerInfo = val;
  }
}
