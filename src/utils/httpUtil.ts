import axios, { AxiosRequestConfig } from "axios";

interface Data {
  code?: number;
  message?: string;
  payload?: any;
}

interface HttpResponse<T> {
  status: number;
  data: T;
}

export async function httpGet<T = Data>(
  url: any,
  config?: AxiosRequestConfig
): Promise<HttpResponse<T>> {
  try {
    const response = await axios.get(url, config);
    return {
      status: response.status,
      data: response.data as T,
    };
  } catch (err: any) {
    if (err.response === undefined) {
      return {
        status: 500,
        data: { code: 500, message: "Something went wrong" } as unknown as T,
      };
    }
    return {
      status: err.response.status,
      data: err.response.data as T,
    };
  }
}

export async function httpPost<T = Data, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<HttpResponse<T>> {
  try {
    const response = await axios.post(url, data, config);
    return {
      status: response.status,
      data: response.data as T,
    };
  } catch (err: any) {
    if (err.response === undefined) {
      return {
        status: 500,
        data: { code: 500, message: "Something went wrong" } as unknown as T,
      };
    }
    return {
      status: err.response.status,
      data: err.response.data as T,
    };
  }
}

export async function httpDelete<T = Data>(
  url: string,
  config?: AxiosRequestConfig
): Promise<HttpResponse<T>> {
  try {
    const response = await axios.delete(url, config);
    return {
      status: response.status,
      data: response.data as T,
    };
  } catch (err: any) {
    if (err.response === undefined) {
      return {
        status: 500,
        data: { code: 500, message: "Something went wrong" } as unknown as T,
      };
    }
    return {
      status: err.response.status,
      data: err.response.data as T,
    };
  }
}

export async function httpPut<T = Data, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<HttpResponse<T>> {
  try {
    const response = await axios.put(url, data, config);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (err: any) {
    if (err.response === undefined) {
      return {
        status: 500,
        data: { code: 500, message: "Something went wrong" } as unknown as T,
      };
    }
    return {
      status: err.response.status,
      data: err.response.data as T,
    };
  }
}
