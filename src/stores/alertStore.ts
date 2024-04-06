import { action, makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";
import { Alert, AlertFilterBy } from "../types";
import AuthStore from "./authStore";

export default class AlertStore extends BaseStore<Alert> {
  filterBy: AlertFilterBy = {};

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
