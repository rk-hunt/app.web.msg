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

enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
}

enum ProviderType {
  Discord = "Discord",
  Telegram = "Telegram",
}

enum ProviderServerType {
  DCServer = "DC Server",
  TGChannel = "TG Channel",
  TGGroup = "TG Group",
}

enum ServerChannelType {
  DCChannel = "DC Channel",
  TGTopic = "TG Topic",
}

enum ActionType {
  Create = 1,
  Update = 2,
  Set = 3,
}

enum ImportExportConfig {
  Providers = "Providers",
  Servers = "Servers",
  Channels = "Channels",
  Blacklist = "Blacklists",
  Weights = "Weights",
}

enum ImportExportExtension {
  csv = "csv",
  xlsx = "xlsx",
}

enum ImportStatus {
  Invalid = "Invalid",
  Valid = "Valid",
  Importing = "Importing",
  Imported = "Imported",
  Error = "Error",
}

export {
  HttpCode,
  WeightType,
  BlacklistType,
  UserStatus,
  ProviderType,
  ProviderServerType,
  ServerChannelType,
  ActionType,
  ImportExportConfig,
  ImportExportExtension,
  ImportStatus,
};
