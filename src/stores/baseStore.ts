import { observable, action, makeObservable } from "mobx";
import { PageContext, ResponseList } from "../types";
import { HttpCode } from "../constants";
import AuthStore from "./authStore";
import { httpGet } from "../utils";

export default class BaseStore<TData> {
  authStore: AuthStore;
  isFetching = false;
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
      data: observable,
      pageContext: observable,
      setData: action,
      setIsFetching: action,
      setPageContext: action,
      onList: action,
    });
  }

  setIsFetching(val: boolean) {
    this.isFetching = val;
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
      if (!isReturnData) {
        this.setData(data.payload.data);
        return;
      }

      return data.payload.data;
    }

    this.authStore.onCheckAuth(status, data.message);
  }

  onReset(): void {
    this.setData([]);
  }
}
