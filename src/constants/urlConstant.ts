const API_URL = `${process.env.REACT_APP_API_URL}`;

const AuthURL = {
  login: `${API_URL}/auth/login`,
  verifyOTP: `${API_URL}/auth/verify`,
  logout: `${API_URL}/auth/logout`,
};

const BlacklistURL = {
  base: `${API_URL}/blacklist`,
  list: `${API_URL}/blacklists`,
};

export { AuthURL, BlacklistURL };
