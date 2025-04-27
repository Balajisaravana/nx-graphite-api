import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiError, DefaultsApiConfigs } from "./types";
import { sendApiEvent } from "../splunk";
import apiErrorHandler from "./apiErrorHandler";
import { ApiActions } from "../../store/middlewareSlice";
import { store } from "../../store";
import { getCookie } from "../../utils";

class ApiMiddleware {
  private static defaultConfig: DefaultsApiConfigs = {
    baseURL: "",
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    refreshInterval: undefined,
  };

  private axiosInstance: AxiosInstance;
  mergedConfigs:DefaultsApiConfigs
  constructor(config?: Partial<DefaultsApiConfigs>) {
    // Merge provided config with default config
    const mergedConfig = { 
      ...ApiMiddleware.defaultConfig, 
      ...(config || {}) 
    };

    // Create axios instance
    this.axiosInstance = axios.create(mergedConfig);
    this.mergedConfigs = mergedConfig
    this.addInterceptors()
  }

  private addInterceptors() {
    // 🔹 Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
       
        // Example: Add auth token dynamically
        const token = getCookie('token');
        // const token = localStorage.getItem("authToken"); /* Storing in local storage is not safe || or not defined Properly */
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 🔹 Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) { 
          window.location.href = "/login"; 
        }
        return Promise.reject(error);
      }
    );
  }
  // ✅ Set Default Configurations
  static setDefaultConfig(config: Partial<DefaultsApiConfigs>) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  // ✅ Request Method With Strong Typing
  async request<T = AxiosResponse>({
    method,
    url,
    data,
    configs,
  }: {
    method: "get" | "post" | "put" | "delete";
    url: string;
    data?: unknown;
    configs?: AxiosRequestConfig;
  }): Promise<T> {
    const startTime = new Date().getTime();
    const timestamp = new Date().toISOString();
    const userId = localStorage.getItem("userId") || "unknown";
 
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url,
        data,
        ...configs,
      });
 
      const endTime = new Date().getTime();
      const responseTime = `${endTime - startTime}ms`;
 
      // Send success event to splunkApi
      sendApiEvent({
        request: data || {},
        response: response,
        timestamp,
        userId,
        url,
        responseTime,
        status: "SUCCESS",
      });
 
      return response.data;
    } catch (error) {
      const apiError = apiErrorHandler(error);
      throw apiError
    }
  }

}

export default ApiMiddleware;
