import { action, makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";
import {
  Alert,
  AlertFilter,
  AlertFilterBy,
  AlertFilterForm,
  AlertInfo,
  AlertReq,
  AlertRule,
} from "../types";
import AuthStore from "./authStore";
import { AlertFilterDateTimeUnit, AlertOperator, AlertURL } from "../constants";
import { alertFieldType } from "../utils";

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

  async onSaveAlert(
    info: AlertInfo,
    filters: AlertFilterForm[],
    callback: () => void
  ) {
    const rules: AlertRule[] = [];
    if (info.type && info.operator && info.times) {
      rules.push({
        type: info.type,
        operator: info.operator as AlertOperator,
        times: info.times,
      });
    }
    const filterReq: AlertReq = {
      name: info.name,
      frequency_type: info.frequency_type,
      rules,
      filters: [],
    };

    // filter
    const reqFilters: AlertFilter[] = [];
    for (const filter of filters) {
      const fieldType = alertFieldType(filter.field as string);
      let reqFilter: AlertFilter = {
        field: fieldType?.name as string,
        operator: filter.operator as AlertOperator,
        type: filter.type as any,
        value: undefined,
      };
      if (
        ["providers", "servers", "channels"].includes(filter.field as string)
      ) {
        if (filter.operator === AlertOperator.Equal) {
          reqFilter.value = filter.value.value;
        } else {
          reqFilter.value = filter.value.map((val: any) => val.value);
        }
        reqFilters.push(reqFilter);
      } else if (filter.field === "received_at") {
        reqFilter.value = {
          start: Date.now(),
          value: filter?.value?.value || 1,
          unit: filter?.value?.unit || AlertFilterDateTimeUnit.minutes,
        };
      } else {
        reqFilter.value = filter.value;
      }
    }

    filterReq.filters = reqFilters;
    super.onSave(AlertURL.base, filterReq, callback);
  }
}
