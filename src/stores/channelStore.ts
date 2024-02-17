import BaseStore from "./baseStore";
import { ChannelFilterBy, Server } from "../types";
import { action, makeObservable, observable } from "mobx";
import AuthStore from "./authStore";

export default class ChannelStore extends BaseStore<Server> {
  filterBy: ChannelFilterBy = {};

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
