import ENV from "./envConstant";

const API_URL = ENV.APP_API_URL;

const AuthURL = {
  login: `${API_URL}/auth/login`,
  verifyOTP: `${API_URL}/auth/verify`,
  logout: `${API_URL}/auth/logout`,
  me: `${API_URL}/me`,
};

const ProviderURL = {
  base: `${API_URL}/provider`,
  list: `${API_URL}/providers`,
};

const ServerURL = {
  base: `${API_URL}/server`,
  list: `${API_URL}/servers`,
};

const ChannelURL = {
  base: `${API_URL}/channel`,
  list: `${API_URL}/channels`,
};

const BlacklistURL = {
  base: `${API_URL}/blacklist`,
  list: `${API_URL}/blacklists`,
};

const WeightURL = {
  base: `${API_URL}/weight`,
  list: `${API_URL}/weights`,
};

const UserURL = {
  base: `${API_URL}/user`,
  list: `${API_URL}/users`,
};

const MessageURL = {
  list: `${API_URL}/messages`,
};

const AlertURL = {
  base: `${API_URL}/alert`,
  list: `${API_URL}/alerts`,
  history: `${API_URL}/alerts/histories`,
};

export {
  AuthURL,
  ProviderURL,
  ServerURL,
  ChannelURL,
  BlacklistURL,
  WeightURL,
  UserURL,
  MessageURL,
  AlertURL,
};
