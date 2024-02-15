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

enum WeightType {
  User = "User",
  Keyword = "Keyword",
  Server = "Server",
}

enum BlacklistType {
  User = "User",
  Keyword = "Keyword",
}

export { HttpCode, WeightType, BlacklistType };
