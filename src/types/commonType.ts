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

export type { PageContext, Response, ResponseList, DateRange };
