import { action, makeObservable } from "mobx";
import { AuthURL, HttpCode } from "../constants";
import message from "../utils/message";
import { httpGet, httpPost } from "../utils";
import { Response } from "../types";

export default class AuthStore {
  constructor() {
    makeObservable(this, {
      onCheckAuth: action,
      onRequestOTP: action,
    });
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

  onCheckAuth(status: HttpCode, msg: any) {
    if (status === HttpCode.Unauthorized) {
      // clear local storage
      // redirect to login
    }
    message.error(msg.stack ? "Sorry, something went wrong" : msg);
  }
}
