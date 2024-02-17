import BaseStore from "./baseStore";
import { Server, ServerFilterBy } from "../types";
import { action, makeObservable, observable } from "mobx";
import AuthStore from "./authStore";

export default class ServerStore extends BaseStore<Server> {
  filterBy: ServerFilterBy = {};

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
