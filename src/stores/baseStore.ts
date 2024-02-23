import { observable, action, makeObservable } from "mobx";
import { PageContext, Response, ResponseList } from "../types";
import { HttpCode } from "../constants";
import AuthStore from "./authStore";
import { httpDelete, httpGet, httpPost, httpPut } from "../utils";
import message from "../utils/message";

export default class BaseStore<TData> {
  authStore: AuthStore;
  isFetching = false;
  isSaving = false;
  data: TData[] = [];
  pageContext: PageContext = {
    current_page: 1,
    per_page: 15,
    last_page: 0,
    total: 0,
  };

  constructor(authStore: AuthStore) {
    this.authStore = authStore;
    makeObservable(this, {
      isFetching: observable,
      isSaving: observable,
      data: observable,
      pageContext: observable,
      setData: action,
      setIsFetching: action,
      setIsSaving: action,
      setPageContext: action,
      onList: action,
    });
  }

  setIsFetching(val: boolean) {
    this.isFetching = val;
  }
  setIsSaving(val: boolean) {
    this.isSaving = val;
  }
  setData(val: TData[]) {
    this.data = val;
  }
  setPageContext(val: PageContext) {
    this.pageContext = {
      current_page: val.current_page,
      per_page: val.per_page,
      last_page: val.last_page,
      total: val.total,
    };
  }

  async onList(url: string, filterBy?: any, page = 1, isReturnData = false) {
    if (this.isFetching) {
      return;
    }
    this.setIsFetching(true);

    const { status, data } = await httpGet<ResponseList<TData[]>>(url, {
      params: {
        page,
        filter_by: filterBy ? JSON.stringify(filterBy) : undefined,
      },
    });

    if (status === HttpCode.Ok) {
      this.setPageContext(data.payload.page_context);
      this.setIsFetching(false);
      if (isReturnData) {
        return data.payload.data;
      }
      this.setData(data.payload.data);
      return;
    }

    this.setIsFetching(false);
    this.authStore.onCheckAuth(status, data.message);
  }

  async onSave(url: string, reqData: any, callback: () => void) {
    if (this.isSaving) {
      return;
    }
    this.setIsSaving(true);

    const { status, data } = await httpPost<Response>(url, reqData);
    if (status === HttpCode.Ok) {
      this.setIsSaving(false);
      message.success(data.message);
      callback();
      return;
    }

    this.setIsSaving(false);
    this.authStore.onCheckAuth(status, data.message);
  }

  async onUpdate(url: string, reqData: any, callback: () => void) {
    if (this.isSaving) {
      return;
    }
    this.setIsSaving(true);

    const { status, data } = await httpPut<Response>(url, reqData);
    if (status === HttpCode.Ok) {
      this.setIsSaving(false);
      message.success(data.message);
      callback();
      return;
    }

    this.setIsSaving(false);
    this.authStore.onCheckAuth(status, data.message);
  }

  async onDelete(url: string, id: string, field = "_id"): Promise<boolean> {
    const { status, data } = await httpDelete<Response>(`${url}/${id}`);
    if (status === HttpCode.Ok) {
      this.setData(this.data.filter((d) => d[field as keyof TData] !== id));
      message.success(data.message);
      return true;
    }
    this.authStore.onCheckAuth(status, data.message);
    return false;
  }

  onReset(): void {
    this.setIsFetching(false);
    this.setIsSaving(false);
    this.setData([]);
  }
}
