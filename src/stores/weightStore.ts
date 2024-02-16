import { action, makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";
import { Weight, WeightFilterBy } from "../types";
import AuthStore from "./authStore";

export default class WeightStore extends BaseStore<Weight> {
  filterBy: WeightFilterBy = {};

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
