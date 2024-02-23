import { action, makeObservable, observable } from "mobx";
import { orderBy } from "lodash";
import BaseStore from "./baseStore";
import { Message, MessageFilterBy } from "../types";
import AuthStore from "./authStore";

export default class MessageStore extends BaseStore<Message> {
  filterBy: MessageFilterBy = {};
  highlightWeight: number = 0;

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      filterBy: observable,
      highlightWeight: observable,
      setFilterBy: action,
      setHighlightWeight: action,
      onListMessages: action,
    });
  }

  setFilterBy(val: any) {
    this.filterBy = val;
  }

  setHighlightWeight(val: any) {
    this.highlightWeight = val;
  }

  async onListMessages(url: string, filterBy?: any, page = 1) {
    const messages = await super.onList(url, filterBy, page, true);

    if (messages !== undefined && messages.length > 0) {
      const sortMessages = orderBy(messages, "weight", "desc");
      // find top 30% weight messages
      const averageWeight =
        sortMessages[0].weight +
        sortMessages[sortMessages.length - 1].weight / 2;
      const weight30Percent = averageWeight - averageWeight * 0.2;
      this.setHighlightWeight(weight30Percent);
      this.setData(sortMessages);
    }
  }
}
