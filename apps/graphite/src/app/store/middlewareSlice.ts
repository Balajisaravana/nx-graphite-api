import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiError } from '../api/api-middleware/types';
import { error } from 'console';
import { sendApiEventError } from '../api/splunk';


export type ApiDatatype<T = unknown> = {
  responseData: T | null;
  loading: boolean;
  error: ApiError[] 
};
export const errorMocks: ApiError[] = [
  {
    details: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/reference-table</pre>\n</body>\n</html>\n`,
    message: "Resource not found.",
    status: 404,
    timestamp: "2025-04-22T13:46:30.934Z",
    type: "NOT_FOUND",
    uniqId: "8b3b4c56-4f52-45c2-ad45-08a63a7b58dd",
    url: "http://localhost:3000/api/reference-table",
  },
  {
    details: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/user-profile</pre>\n</body>\n</html>\n`,
    message: "User profile not found.",
    status: 404,
    timestamp: "2025-04-22T13:47:10.124Z",
    type: "NOT_FOUND",
    uniqId: "12a1c6d2-f678-43b2-a6b2-5eab7c0a47a1",
    url: "http://localhost:3000/api/user-profile",
  },
  {
    details: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/dashboard-data</pre>\n</body>\n</html>\n`,
    message: "Dashboard data not found.",
    status: 404,
    timestamp: "2025-04-22T13:48:05.001Z",
    type: "NOT_FOUND",
    uniqId: "9f1c11ad-3312-4d88-bc6a-34e1c5b65a3d",
    url: "http://localhost:3000/api/dashboard-data",
  },
  {
    details: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/metrics</pre>\n</body>\n</html>\n`,
    message: "Metrics endpoint missing.",
    status: 404,
    timestamp: "2025-04-22T13:49:22.431Z",
    type: "NOT_FOUND",
    uniqId: "e5d7095a-33a1-41c9-bca5-0b8a3b76e3c1",
    url: "http://localhost:3000/api/metrics",
  },
  {
    details: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/project-info</pre>\n</body>\n</html>\n`,
    message: "Project info could not be retrieved.",
    status: 404,
    timestamp: "2025-04-22T13:50:10.789Z",
    type: "NOT_FOUND",
    uniqId: "3c38f6f3-b13f-49c4-b0e1-0f64aab9e957",
    url: "http://localhost:3000/api/project-info",
  },
];


export type InitStateType = Record<string, ApiDatatype>;

export interface ApiPayloadType<T> extends ApiDatatype<T> {
  apiName: string;
}

const initialState: InitStateType = {};

const middlewareSlice = createSlice({
  name: 'middlewareSlice',
  initialState,
  reducers: {
    initApiStore: <T>(
      state: InitStateType,
      action: PayloadAction<ApiPayloadType<T>>
    ) => {
      const { apiName, responseData, loading, error } = action.payload;
      state[apiName] = {
        responseData,
        loading,
        error:[],
      };
    },
    setApiLoading: (
      state: InitStateType,
      action: PayloadAction<{ loading: boolean; apiName: string }>
    ) => {
      const existing = state[action.payload.apiName];
      if (!existing) return;
      state[action.payload.apiName] = {
        ...existing,
        loading: action.payload.loading,
      };
    },
    setApiError: (
      state: InitStateType,
      action: PayloadAction<{ error: ApiError; apiName: string }>
    ) => {
      const existing = state[action.payload.apiName];
      if (!existing) {
        state[action.payload.apiName] = {
          responseData: null,
          loading: false,
          error: [action.payload.error],
        };
        return;
      }
      let mergedErrors = [...(existing.error || []), action.payload.error];

      if (mergedErrors.length > 5) {
        const toSendToSplunk = mergedErrors.slice(0, 3);
        sendApiEventError(toSendToSplunk); 
        mergedErrors = mergedErrors.slice(3);
      }

      state[action.payload.apiName] = {
        ...existing,
        error: mergedErrors,
      };
      
      
    },
    // clearApiError: (
    //   state: InitStateType,
    //   action: PayloadAction<{ error: ApiError; apiName: string }>
    // ) => {
    //   const existing = state[action.payload.apiName];
    //   const FirstEnteries = existing?.error?.slice(0, 3);
     
    //   const mergedErrors = [...(existing.error.slice(3) || []), action.payload.error];
    //   state[action.payload.apiName] = {
    //     ...existing,
    //     error: mergedErrors
    //   };
    //   sendApiEventError(FirstEnteries); 
    // },
  },
});

export const ApiActions = middlewareSlice.actions;
export default middlewareSlice.reducer;
