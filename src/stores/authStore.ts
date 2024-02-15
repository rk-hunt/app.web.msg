import { action, makeObservable } from "mobx";
import { HttpCode } from "../constants";

export default class AuthStore {
  constructor() {
    makeObservable(this, {
      onCheckAuth: action,
    });
  }

  onCheckAuth(status: HttpCode, msg: any) {
    if (status === HttpCode.Unauthorized) {
      // clear local storage
      // redirect to login
    }
    // message.error(msg.stack ? 'Sorry, something went wrong' : msg);
  }
}
