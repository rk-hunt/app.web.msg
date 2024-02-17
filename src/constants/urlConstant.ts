const API_URL = `${process.env.REACT_APP_API_URL}`;

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

export { AuthURL, ProviderURL, ServerURL, ChannelURL, BlacklistURL, WeightURL };
