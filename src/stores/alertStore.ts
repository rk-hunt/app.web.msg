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
  Response,
} from "../types";
import AuthStore from "./authStore";
import {
  ActionType,
  AlertFilterDateTimeUnit,
  AlertOperator,
  AlertURL,
  fieldTypes,
} from "../constants";
import { alertFieldType, httpGet, randomNumber } from "../utils";
import { HttpStatusCode } from "axios";

export default class AlertStore extends BaseStore<Alert> {
  filterBy: AlertFilterBy = {};
  alertInfo: AlertInfo = {} as any;
  filters: AlertFilterForm[] = [];

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      filterBy: observable,
      alertInfo: observable,
      filters: observable,
      setFilterBy: action,
      setAlertInfo: action,
      setFilters: action,
      onSaveAlert: action,
      onEdit: action,
    });
  }

  setFilterBy(val: AlertFilterBy) {
    this.filterBy = val;
  }

  setAlertInfo(val: AlertInfo) {
    this.alertInfo = val;
  }

  setFilters(val: AlertFilterForm[]) {
    this.filters = val;
  }

  async onSaveAlert(
    info: AlertInfo,
    filters: AlertFilterForm[],
    actionType: ActionType,
    callback: () => void
  ) {
    const rules: AlertRule[] = [];
    if (info.type && info.operator && info.times) {
      rules.push({
        type: info.type,
        operator: info.operator as AlertOperator,
        times: parseFloat(info.times),
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
      if (!filter.value || !filter.operator) {
        continue;
      }

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
      } else if (filter.field === "received_at") {
        reqFilter.value = {
          start: Date.now(),
          value: filter?.value?.value ? parseInt(filter.value?.value) : 1,
          unit: filter?.value?.unit || AlertFilterDateTimeUnit.minutes,
        };
      } else {
        reqFilter.value = filter.value;
      }
      reqFilters.push(reqFilter);
    }
    filterReq.filters = reqFilters;

    if (actionType === ActionType.Create) {
      super.onSave(AlertURL.base, filterReq, callback);
    } else {
      super.onUpdate(
        `${AlertURL.base}/${this.alertInfo._id}`,
        filterReq,
        callback
      );
    }
  }

  async onEdit(id: string, callback: () => void) {
    const { status, data } = await httpGet<Response<Alert>>(
      `${AlertURL.base}/${id}`
    );

    if (status === HttpStatusCode.Ok) {
      const rule =
        data.payload.rules.length > 0
          ? data.payload.rules[0]
          : ({} as AlertRule);

      const alertInfo: AlertInfo = {
        _id: data.payload._id,
        name: data.payload.name,
        frequency_type: data.payload.frequency_type,
        type: rule.type,
        operator: rule.operator,
        times: rule.times,
      };

      const filters: AlertFilterForm[] = [];
      for (const filter of data.payload.filters) {
        const fieldType = fieldTypes.find(
          (field) => field.name === filter.field
        );

        if (filter.field === "provider_id") {
          filter.value =
            filter.operator === AlertOperator.Equal
              ? {
                  value: filter.value._id,
                  label: filter.value.name,
                }
              : (filter.value as any[]).map((val) => {
                  return {
                    value: val._id,
                    label: val.name,
                  };
                });
        } else if (filter.field === "server_id") {
          filter.value =
            filter.operator === AlertOperator.Equal
              ? {
                  value: filter.value.server_id,
                  label: filter.value.server_name,
                }
              : (filter.value as any[]).map((val) => {
                  return {
                    value: val.server_id,
                    label: val.server_name,
                  };
                });
        } else if (filter.field === "channel_id") {
          filter.value =
            filter.operator === AlertOperator.Equal
              ? {
                  value: filter.value.channel_id,
                  label: filter.value.channel_name,
                }
              : (filter.value as any[]).map((val) => {
                  return {
                    value: val.channel_id,
                    label: val.channel_name,
                  };
                });
        }

        filters.push({
          ...filter,
          key: randomNumber(),
          field: fieldType?.field,
        });
      }

      this.setAlertInfo(alertInfo);
      this.setFilters(filters);
      callback();
      return;
    }

    this.authStore.onCheckAuth(status, data.message);
  }

  onReset(): void {
    super.onReset();
    this.setFilterBy({});
    this.setAlertInfo({} as any);
    this.setFilters([]);
  }
}
