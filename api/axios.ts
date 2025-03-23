import axios, { AxiosRequestConfig } from "axios";
import { Router } from "next/router";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: [() => void, (error: any) => void][] = [];

const subscribeTokenRefresh = (
  cb: () => void,
  reject: (error: any) => void
) => {
  refreshSubscribers.push([cb, reject]);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach(([cb]) => cb());
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          }, reject);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      /* TODO: at the time is not working entirely correct
       * the problem is in the second request to /access-token
       * when refresh-token is also invalid the code stops
       * inside isRefreshing if-statement
       * (server should send an Unauthorized exception for this behavior,
       * now receiving 500 internal server error)
       */
      try {
        const res = await api.get("/auth/refresh/access-token");
        onTokenRefreshed();
        isRefreshing = false;
        return api(originalRequest);
      } catch (e) {
        refreshSubscribers.forEach(([, reject]) => reject(e));
        refreshSubscribers = [];
        window.location.href = "/";

        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
