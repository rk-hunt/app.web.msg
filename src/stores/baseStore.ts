import { observable, action, makeObservable, toJS, computed } from "mobx";
import { PageContext, Response, ResponseList } from "../types";
import {
  HttpCode,
  ImportExportConfig,
  ImportExportExtension,
  ImportStatus,
  importOptionalFields,
  numberFields,
  numberImportPerRequest,
} from "../constants";
import AuthStore from "./authStore";
import {
  exportToExcel,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  objectValueValidator,
} from "../utils";
import message from "../utils/message";
import { HttpStatusCode } from "axios";

export default class BaseStore<TData> {
  authStore: AuthStore;
  isFetching = false;
  isSaving = false;
  isExporting = false;
  isImporting = false;
  importData: any[] = [];
  data: TData[] = [];
  pageContext: PageContext = {
    current_page: 1,
    per_page: 15,
    last_page: 0,
    total: 0,
  };

  constructor(authStore: AuthStore) {
    this.authStore = authStore;
    makeObservable(this, {
      isFetching: observable,
      isSaving: observable,
      setIsFetching: observable,
      isExporting: observable,
      isImporting: observable,
      importData: observable,
      data: observable,
      pageContext: observable,
      setData: action,
      setIsSaving: action,
      setIsExporting: action,
      setIsImporting: action,
      setImportData: action,
      setPageContext: action,
      onList: action,
      onExport: action,
      getImportData: computed,
    });
  }

  setIsFetching(val: boolean) {
    this.isFetching = val;
  }
  setIsSaving(val: boolean) {
    this.isSaving = val;
  }
  setIsExporting(val: boolean) {
    this.isExporting = val;
  }
  setIsImporting(val: boolean) {
    this.isImporting = val;
  }
  setImportData(val: any[]) {
    this.importData = val;
  }
  setData(val: TData[]) {
    this.data = val;
  }
  setPageContext(val: PageContext) {
    this.pageContext = {
      current_page: val.current_page,
      per_page: val.per_page,
      last_page: val.last_page,
      total: val.total,
    };
  }

  async onList(
    url: string,
    filterBy?: any,
    page = 1,
    sortBy?: any,
    isReturnData = false
  ) {
    if (this.isFetching) {
      return;
    }
    this.setIsFetching(true);

    const { status, data } = await httpGet<ResponseList<TData[]>>(url, {
      params: {
        page,
        filter_by: filterBy ? JSON.stringify(filterBy) : undefined,
        sort_by: sortBy ? JSON.stringify(sortBy) : undefined,
      },
    });

    if (status === HttpCode.Ok) {
      this.setPageContext(data.payload.page_context);
      this.setIsFetching(false);
      if (isReturnData) {
        return data.payload.data;
      }
      this.setData(data.payload.data);
      return;
    }

    this.setIsFetching(false);
    this.authStore.onCheckAuth(status, data.message);
  }

  async onSave(url: string, reqData: any, callback: () => void) {
    if (this.isSaving) {
      return;
    }
    this.setIsSaving(true);

    const { status, data } = await httpPost<Response>(url, reqData);
    if (status === HttpCode.Ok) {
      this.setIsSaving(false);
      message.success(data.message);
      callback();
      return;
    }

    this.setIsSaving(false);
    this.authStore.onCheckAuth(status, data.message);
  }

  async onUpdate(url: string, reqData: any, callback: () => void) {
    if (this.isSaving) {
      return;
    }
    this.setIsSaving(true);

    const { status, data } = await httpPut<Response>(url, reqData);
    if (status === HttpCode.Ok) {
      this.setIsSaving(false);
      message.success(data.message);
      callback();
      return;
    }

    this.setIsSaving(false);
    this.authStore.onCheckAuth(status, data.message);
  }

  async onDelete(url: string, id: string, field = "_id"): Promise<boolean> {
    const { status, data } = await httpDelete<Response>(`${url}/${id}`);
    if (status === HttpCode.Ok) {
      this.setData(this.data.filter((d) => d[field as keyof TData] !== id));
      message.success(data.message);
      return true;
    }
    this.authStore.onCheckAuth(status, data.message);
    return false;
  }

  async onExport(
    url: string,
    exportFields: string[],
    extension: ImportExportExtension,
    filename: string
  ): Promise<void> {
    this.setIsExporting(true);
    const { status, data } = await httpGet<ResponseList<TData[]>>(url, {
      params: { page: 1, limit: 50 },
    });

    if (status === HttpCode.Ok) {
      if (data.payload.data.length > 0) {
        const pageContext = data.payload.page_context;
        const exportData: any[] = data.payload.data;
        if (pageContext.total > 1) {
          for (let i = 2; i <= pageContext.last_page; i++) {
            const { status: st, data: d } = await httpGet<
              ResponseList<TData[]>
            >(url, { params: { page: i, limit: 50 } });
            if (st === HttpCode.Ok) {
              exportData.push(d.payload.data);
            }
          }
        }

        // loop only wanted data to export
        const exportDocs: any[] = [];
        for (const expData of exportData) {
          const exportDoc: Record<string, any> = {};
          for (const exportField of exportFields) {
            if (
              filename === ImportExportConfig.Providers &&
              ["api_id", "api_hash"].includes(exportField)
            ) {
              exportDoc[exportField] = expData.config
                ? expData.config[exportField]
                : null;
            } else {
              exportDoc[exportField] = expData[exportField];
            }
          }
          exportDocs.push(exportDoc);
        }

        this.setIsExporting(false);
        exportToExcel(exportDocs, exportFields, filename, extension);
        return;
      }
      this.setIsExporting(false);
      message.info(`There no ${filename} to exports`);
      return;
    }
    this.authStore.onCheckAuth(status, data.message);
  }

  async onImport(url: string, configuration: string, fields: string[]) {
    this.setIsImporting(true);
    const reqInfo: any[] = [];
    const importInfo: any[] = [];
    let invalidCount = 0;

    for (const data of this.getImportData) {
      const validated = objectValueValidator(
        data,
        fields,
        importOptionalFields
      );
      console.log("validated: ", validated);
      if (validated === false) {
        invalidCount += 1;
        data.status = ImportStatus.Invalid;
      } else {
        data.status = ImportStatus.Valid;
      }

      importInfo.push(data);
      const info: Record<string, any> = {};
      for (const field of fields) {
        if (numberFields.includes(field)) {
          info[field] = parseFloat(data[field]);
        } else {
          info[field] = data[field]?.toString();
        }
      }
      reqInfo.push(info);
    }

    this.setImportData(importInfo);
    if (invalidCount > 0) {
      this.setIsImporting(false);
      return;
    }

    const totalRequest = Math.ceil(reqInfo.length / numberImportPerRequest);
    for (let i = 1; i <= totalRequest; i++) {
      const start = i - 1;
      const end = numberImportPerRequest * i;
      const chuckReqInfo = reqInfo.slice(start * numberImportPerRequest, end);

      const { status, data } = await httpPost(url, {
        [configuration.toLowerCase()]: chuckReqInfo,
      });

      if (
        status === HttpStatusCode.Ok ||
        status === HttpStatusCode.InternalServerError
      ) {
        for (const reqInfo of chuckReqInfo) {
          const updatedImportData = this.getImportData.map((impData) => {
            if (impData._id === reqInfo._id) {
              if (status === HttpStatusCode.Ok) {
                impData.status = ImportStatus.Imported;
                impData.message = null;
              } else {
                impData.status = ImportStatus.Error;
                impData.message = "Internal server error";
              }
            }
            return impData;
          });
          this.setImportData(updatedImportData);
        }
      } else {
        if (status === HttpStatusCode.BadRequest) {
          for (const reqInfo of chuckReqInfo) {
            const errorInfo = data.payload.find(
              (resData: any) => resData._id === reqInfo._id
            );
            const updatedImportData = this.getImportData.map((impData) => {
              if (impData._id === reqInfo._id && errorInfo) {
                impData.status = ImportStatus.Error;
                impData.message = errorInfo.message;
              }
              return impData;
            });
            this.setImportData(updatedImportData);
          }
        }
      }
    }
    this.setIsImporting(false);
  }

  onReset(): void {
    this.setIsFetching(false);
    this.setIsSaving(false);
    this.setIsExporting(false);
    this.setIsImporting(false);
    this.setData([]);
    this.setImportData([]);
  }

  get getImportData() {
    return toJS(this.importData);
  }
}
