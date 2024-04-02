import { action, makeObservable, observable } from "mobx";
import { HttpStatusCode } from "axios";
import BaseStore from "./baseStore";
import AuthStore from "./authStore";
import {
  SelectLabelInValue,
  Server,
  ServerFilterBy,
  ServerImportInfo,
  ServerInfo,
  ServerReqInfo,
} from "../types";
import {
  ImportStatus,
  ProviderServerType,
  ProviderType,
  ServerURL,
  exportField,
  numberImportPerRequest,
} from "../constants";
import { httpPost, objectValueValidator } from "../utils";

export default class ServerStore extends BaseStore<Server> {
  serverInfo: ServerInfo = {} as any;
  filterBy: ServerFilterBy = {};
  providerTypes: SelectLabelInValue[] = [];

  constructor(authStore: AuthStore) {
    super(authStore);
    makeObservable(this, {
      serverInfo: observable,
      providerTypes: observable,
      filterBy: observable,
      setServerInfo: action,
      setProviderTypes: action,
      setFilterBy: action,
      onImport: action,
    });
  }

  setServerInfo(val: ServerInfo) {
    this.serverInfo = val;
  }

  setProviderTypes(providerType: ProviderType) {
    this.providerTypes =
      providerType === ProviderType.Discord
        ? [
            {
              value: ProviderServerType.DCServer,
              label: ProviderServerType.DCServer,
            },
          ]
        : [
            {
              value: ProviderServerType.TGChannel,
              label: ProviderServerType.TGChannel,
            },
            {
              value: ProviderServerType.TGGroup,
              label: ProviderServerType.TGGroup,
            },
          ];
  }

  setFilterBy(val: ServerFilterBy) {
    this.filterBy = val;
  }

  async onImport(importData: ServerImportInfo[]) {
    this.setIsImporting(true);
    const serverReqInfo: ServerReqInfo[] = [];
    const ServerImportInfo: ServerImportInfo[] = [];
    let invalidCount = 0;

    for (const data of importData) {
      if (!objectValueValidator(data, exportField.provider)) {
        invalidCount += 1;
        data.status = ImportStatus.Invalid;
      } else {
        data.status = ImportStatus.Invalid;
      }

      ServerImportInfo.push(data);
      serverReqInfo.push({
        _id: data._id,
        provider_id: data.provider_id,
        type: data.type,
        server_id: data.server_id.toString(),
        server_name: data.server_name.toString(),
      });
    }

    this.setImportData(ServerImportInfo);
    if (invalidCount > 0) {
      this.setIsImporting(true);
      return;
    }
    // send chucking request
    const totalRequest = serverReqInfo.length / numberImportPerRequest;
    for (let i = 1; i < totalRequest; i += numberImportPerRequest) {
      const chuckServerReqInfo = serverReqInfo.slice(
        i - 1,
        numberImportPerRequest * i
      );

      const { status, data } = await httpPost(`${ServerURL.base}/import`, {
        servers: chuckServerReqInfo,
      });

      if (
        status === HttpStatusCode.Ok ||
        status === HttpStatusCode.InternalServerError
      ) {
        for (const reqInfo of chuckServerReqInfo) {
          const updatedServerImportData = ServerImportInfo.map((serverInfo) => {
            if (serverInfo._id === reqInfo._id) {
              if (status === HttpStatusCode.Ok) {
                serverInfo.status = ImportStatus.Imported;
              } else {
                serverInfo.status = ImportStatus.Error;
                serverInfo.message = "Internal server error";
              }
            }
            return serverInfo;
          });
          this.setImportData(updatedServerImportData);
        }
      } else {
        for (const reqInfo of chuckServerReqInfo) {
          const errorInfo = data.payload.data.find(
            (resData: any) => resData._id === reqInfo._id
          );
          const updatedServerImportData = ServerImportInfo.map((serverInfo) => {
            if (serverInfo._id === reqInfo._id) {
              serverInfo.status = ImportStatus.Error;
              serverInfo.message = errorInfo.message || null;
            }
            return serverInfo;
          });
          this.setImportData(updatedServerImportData);
        }
      }
    }
    this.setIsImporting(false);
  }
}
