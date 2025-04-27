import { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ApiMiddleware from ".";
import apiErrorHandler from "./apiErrorHandler";
import { ApiRequestConfig } from "./types";
import { RootState } from "../../store";
import { ApiActions, errorMocks } from "../../store/middlewareSlice";
import type { ApiError } from "./types";

const useApiRequest = <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  apiName: string,
  data?: unknown,
  configs?: ApiRequestConfig
) => {
  const dispatch = useDispatch();
  const defaultState = {
    responseData: null,
    loading: false,
    error: [],
  };

  // Optional chaining to avoid undefined crash
  const currentState = useSelector(
    (state: RootState) => state.api[apiName]
  ) as {
    responseData: T | null;
    loading: boolean;
    error: ApiError[] ;
  } ;

  const middleware = useMemo(() => new ApiMiddleware(configs?.overriddenConfig), [
    configs?.overriddenConfig,
  ]);

  const load = useCallback(async () => {
    if (!currentState) {
      dispatch(ApiActions.initApiStore({
        apiName,
        responseData: null,
        loading: true,
        error: [],
      }));
    } else {
      dispatch(ApiActions.setApiLoading({ apiName, loading: true }));
    }
   
    try {
      const result = await middleware.request<T>({
        method,
        url,
        data,
        configs: configs?.axiosConfigs,
      });

      if (JSON.stringify(result) !== JSON.stringify(currentState?.responseData)) {
        dispatch(
          ApiActions.initApiStore({
            apiName,
            responseData: result as T,
            loading: false,
            error: [],
          })
        );
      }
    } catch (err) {   
      dispatch(ApiActions.setApiError({ apiName, error: err as ApiError }));
    } finally {
      dispatch(ApiActions.setApiLoading({ apiName, loading: false }));
    }
  }, [method, url, data, configs, currentState, middleware, dispatch, apiName]);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const refreshInterval = middleware.mergedConfigs.refreshInterval;
    let interval: NodeJS.Timeout | undefined;
    if (refreshInterval && refreshInterval > 1000) {
       interval = setInterval(load, refreshInterval);
      return () => clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };

  }, [middleware, load]);

  return {
    data: currentState?.responseData ?? null,
    error: currentState?.error ?? null,
    loading: currentState?.loading ?? false,
    // responseData: currentState?.responseData ?? null,
    load,
  };
};

export default useApiRequest;
