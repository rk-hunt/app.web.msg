import { action, makeObservable, observable } from "mobx";
import { AuthURL, HttpCode } from "../constants";
import message from "../utils/message";
import { httpGet, httpPost } from "../utils";
import { Response, User } from "../types";

export default class AuthStore {
  user: User = {} as any;

  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action,
      onCheckAuth: action,
      onRequestOTP: action,
      onGetMe: action,
    });
  }

  setUser(val: User) {
    this.user = val;
  }

  async onRequestOTP(email: string) {
    const { status, data } = await httpPost<Response>(AuthURL.login, { email });
    if (status === HttpCode.Ok) {
      message.success(data.message);
      return true;
    }

    message.error(data.message);
    return false;
  }

  async onVerifyOTP(opt: string, callback: () => void) {
    const { status, data } = await httpGet<Response>(
      `${AuthURL.verifyOTP}/${opt}`
    );
    if (status === HttpCode.Ok) {
      localStorage.setItem(
        "access_token",
        `${data.payload.type} ${data.payload.access_token}`
      );
      callback();
      return;
    }

    message.error(data.message);
  }

  async onGetMe() {
    if (this.user.email) {
      return;
    }

    const { status, data } = await httpGet<Response>(AuthURL.me);
    if (status === HttpCode.Ok) {
      this.setUser(data.payload);
      return;
    }

    this.onCheckAuth(status, data.message);
  }

  onCheckAuth(status: HttpCode, msg: any) {
    if (status === HttpCode.Unauthorized) {
      localStorage.clear();
      window.location.href = "/login";
    }
    message.error(msg.stack ? "Sorry, something went wrong" : msg);
  }
}
