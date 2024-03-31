type PageContext = {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
};

type Response<T = any> = {
  code: number;
  message: string;
  payload: T;
};

type ResponseList<T> = Response<{
  data: T;
  page_context: PageContext;
}>;

type DateRange = {
  start: number;
  end: number;
};

type SelectLabelInValue = {
  key?: any;
  value: any;
  label: string;
};

type ExportOption = {
  url: string;
  fields: string[];
};

type FieldSortOrder = {
  field: string;
  order: string;
};

export type {
  PageContext,
  Response,
  ResponseList,
  DateRange,
  SelectLabelInValue,
  ExportOption,
  FieldSortOrder,
};
