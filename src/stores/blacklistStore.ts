import { action, makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";
import { Blacklist, BlacklistFilterBy } from "../types";
import AuthStore from "./authStore";

export default class BlacklistStore extends BaseStore<Blacklist> {
  filterBy: BlacklistFilterBy = {};

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      filterBy: observable,
      setFilterBy: action,
    });
  }

  setFilterBy(val: any) {
    this.filterBy = val;
  }
}
