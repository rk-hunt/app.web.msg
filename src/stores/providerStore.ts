import { makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";
import { Provider } from "../types";
import AuthStore from "./authStore";

export default class ProviderStore extends BaseStore<Provider> {
  provider: Provider = {} as any;

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      provider: observable,
    });
  }

  setProvider(val: Provider) {
    this.provider = val;
  }
}
