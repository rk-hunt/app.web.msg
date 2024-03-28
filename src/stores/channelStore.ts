import BaseStore from "./baseStore";
import {
  ChannelFilterBy,
  ChannelInfo,
  SelectLabelInValue,
  Server,
} from "../types";
import { action, makeObservable, observable } from "mobx";
import AuthStore from "./authStore";
import { ProviderServerType, ServerChannelType } from "../constants";

export default class ChannelStore extends BaseStore<Server> {
  channelInfo: ChannelInfo = {} as any;
  filterBy: ChannelFilterBy = {};
  serverTypes: SelectLabelInValue[] = [];

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      channelInfo: observable,
      filterBy: observable,
      serverTypes: observable,
      setFilterBy: action,
      setServerTypes: action,
      setChannelInfo: action,
    });
  }

  setFilterBy(val: any) {
    this.filterBy = val;
  }

  setServerTypes(serverType: ProviderServerType) {
    this.serverTypes =
      serverType === ProviderServerType.DCServer
        ? [
            {
              value: ServerChannelType.DCChannel,
              label: ServerChannelType.DCChannel,
            },
          ]
        : [
            {
              value: ServerChannelType.TGTopic,
              label: ServerChannelType.TGTopic,
            },
          ];
  }

  setChannelInfo(val: ChannelInfo) {
    this.channelInfo = val;
  }
}
