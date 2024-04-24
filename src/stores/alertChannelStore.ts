import { action, makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";
import AuthStore from "./authStore";
import { AlertChannel, AlertChannelFilterBy } from "../types";

export default class AlertChannelStore extends BaseStore<AlertChannel> {
  filterBy: AlertChannelFilterBy = {};

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      filterBy: observable,
      setFilterBy: action,
    });
  }

  setFilterBy(val: AlertChannelFilterBy) {
    this.filterBy = val;
  }
  onReset(): void {
    super.onReset();
    this.setFilterBy({});
  }
}
