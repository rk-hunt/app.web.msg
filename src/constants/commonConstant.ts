const menus = [
  {
    name: "Providers",
    icon: "providers",
    url: "/providers",
    key: "providers",
  },
  {
    name: "Servers",
    icon: "servers",
    url: "/servers",
    key: "servers",
  },
  {
    name: "Channels",
    icon: "channels",
    url: "/channels",
    key: "channels",
  },
  {
    name: "Blacklists",
    icon: "blacklists",
    url: "/blacklists",
    key: "blacklists",
  },
  {
    name: "Weights",
    icon: "weights",
    url: "/weights",
    key: "weights",
  },
  {
    name: "Messages",
    icon: "messages",
    url: "/messages",
    key: "messages",
  },
  {
    name: "Users",
    icon: "users",
    url: "/users",
    key: "users",
  },
];

const datetimeFormat = "DD MMM YYYY hh:mm A";

enum HttpCode {
  BadRequest = 400,
  Conflict = 409,
  Created = 201,
  Gone = 410,
  InternalServerError = 500,
  NotFound = 404,
  Ok = 200,
  PaymentRequired = 402,
  TooMany = 429,
  Unauthorized = 401,
  UnsupportedMediaType = 415,
}

export { menus, datetimeFormat, HttpCode };
