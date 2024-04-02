import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import message from "./message";
import {
  BlacklistURL,
  ChannelURL,
  ImportExportConfig,
  ProviderURL,
  ServerURL,
  WeightURL,
  exportField,
} from "../constants";
import { ExportOption, FieldSortOrder } from "../types";

const exportToExcel = (
  data: any,
  headerColumns: string[],
  fileName: string,
  fileExtension = "xlsx"
) => {
  try {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws = XLSX.utils.json_to_sheet(data);
    const excelHeaderCol = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
    ]; //for max 15 columns
    for (let i = 0; i <= headerColumns.length - 1; i++) {
      if (ws[`${excelHeaderCol[i]}1`].v) {
        ws[`${excelHeaderCol[i]}1`].v = headerColumns[i];
      }
    }
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: fileExtension as any,
      type: "array",
    });
    const excelData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(excelData, `${fileName}.${fileExtension}`);
  } catch (error: any) {
    message.error((error as any).message);
  }
};

const getExportOption = (configuration: ImportExportConfig): ExportOption => {
  switch (configuration) {
    case ImportExportConfig.Providers:
      return {
        url: ProviderURL.list,
        fields: exportField.provider,
      };
    case ImportExportConfig.Servers:
      return {
        url: ServerURL.list,
        fields: exportField.server,
      };
    case ImportExportConfig.Channels:
      return {
        url: ChannelURL.list,
        fields: exportField.channel,
      };
    case ImportExportConfig.Weights:
      return {
        url: WeightURL.list,
        fields: exportField.weight,
      };
    case ImportExportConfig.Blacklist:
      return {
        url: BlacklistURL.list,
        fields: exportField.blacklist,
      };
    default:
      return {
        url: ProviderURL.list,
        fields: exportField.provider,
      };
  }
};

const sortByBuilder = (sortColumns: FieldSortOrder[] | FieldSortOrder) => {
  const sortBy: Record<string, any> = {};
  if (typeof sortColumns === "object" && sortColumns.constructor === Object) {
    sortBy[(sortColumns as FieldSortOrder).field] =
      (sortColumns as FieldSortOrder).order === "ascend" ? "asc" : "desc";
  } else {
    for (const sort of sortColumns as FieldSortOrder[]) {
      if (sort.order) {
        sortBy[sort.field] = sort.order === "ascend" ? "asc" : "desc";
      }
    }
  }
  return sortBy;
};

const objectValueValidator = (
  objectData: Record<string, any>,
  fields: string[],
  optionFields: string[]
): boolean => {
  for (const f of fields) {
    const value = objectData[f];
    if (!optionFields.includes(f)) {
      if (value === undefined || value === null) {
        return false;
      }
    }
  }

  return true;
};

export { exportToExcel, getExportOption, sortByBuilder, objectValueValidator };
