import BaseStore from "./baseStore";
import { Response, Server, UserFilterBy } from "../types";
import { action, makeObservable, observable } from "mobx";
import AuthStore from "./authStore";
import { HttpCode, UserStatus, UserURL } from "../constants";
import { httpPut } from "../utils";
import message from "../utils/message";

export default class UserStore extends BaseStore<Server> {
  filterBy: UserFilterBy = {};

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      filterBy: observable,
      setFilterBy: action,
      onUpdateUserStatus: action,
    });
  }

  setFilterBy(val: any) {
    this.filterBy = val;
  }

  async onUpdateUserStatus(
    id: string,
    userStatus: UserStatus
  ): Promise<boolean> {
    const { status, data } = await httpPut<Response>(
      `${UserURL.base}/${id}/${userStatus}`
    );

    if (status === HttpCode.Ok) {
      message.success(data.message);
      return true;
    }
    this.authStore.onCheckAuth(status, data.message);
    return false;
  }
}
