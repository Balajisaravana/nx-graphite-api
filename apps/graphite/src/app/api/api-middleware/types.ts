import { AxiosRequestConfig, CreateAxiosDefaults, AxiosResponse } from "axios";


export interface ApiError {
    type: "VALIDATION_ERROR" | "AUTH_ERROR" | "PERMISSION_ERROR" | "NOT_FOUND" | "RATE_LIMIT" | "SERVER_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR" | string;
    status: number | "UNKNOWN"; // HTTP status code or "UNKNOWN" for non-HTTP errors
    message: string;
    details?: string | null; // Additional error details from API response
    timestamp: string; // To track when error occurred
    url?: string; // The API endpoint where the error happened
    uniqId?: string; // Unique identifier for the error instance
}
// ✅ Define Default API Configs Interface
export interface DefaultsApiConfigs extends CreateAxiosDefaults {
    baseURL: string;
    timeout: number;
    refreshInterval?: number;
}

export interface ApiState<T> {
    data: T | null;
    error: ApiError | null;
    loading: boolean;
    load: () => void;
}

export interface ApiRequestConfig {
    overriddenConfig?: Partial<DefaultsApiConfigs>;
    axiosConfigs?: AxiosRequestConfig;
}

export interface SplunkApiEvent<T> {
    request: T;
    response: AxiosResponse | null; 
    timestamp: string;
    userId: string;
    url: string;
    responseTime: string;
    status: "FAILED" | "SUCCESS";
    uniqId?: string; 
}
