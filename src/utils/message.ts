import { message } from "antd";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  success: function (text: string, duration = 5) {
    message.success(text, duration);
  },
  warning: function (text: string, duration = 5) {
    message.warning(text, duration);
  },
  error: function (text: string, duration = 5) {
    message.error(text, duration);
  },
  info: function (text: string, duration = 5) {
    message.info(text, duration);
  },
};
