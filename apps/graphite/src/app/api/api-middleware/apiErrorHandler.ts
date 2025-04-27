import { AxiosError } from "axios";
import { ApiError } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { sendApiEvent, sendApiEventError } from "../splunk";
import { store } from "../../store";

/**
 * Handles API errors and returns structured error messages.
 * @param error AxiosError | unknown
 * @returns ApiError (type, status, message, details)
 */
const errorMessages: Record<number | "UNKNOWN", { type: string, message: string }> = {
    400: { type: "VALIDATION_ERROR", message: "Invalid request. Please check your input." },
    401: { type: "AUTH_ERROR", message: "Unauthorized. Please log in again." },
    403: { type: "PERMISSION_ERROR", message: "Access Denied. You don't have permission." },
    404: { type: "NOT_FOUND", message: "Resource not found." },
    429: { type: "RATE_LIMIT", message: "Too many requests. Please slow down." },
    500: { type: "SERVER_ERROR", message: "Server Error. Try again later." },
    UNKNOWN: { type: "UNKNOWN_ERROR", message: "An unexpected error occurred." }
};

const apiErrorHandler = (error: unknown): ApiError => {
    const timestamp = new Date().toISOString(); // Record error timestamp
    const uniqId: string = uuidv4(); // Generate a unique error ID for tracking

    const createError = (type: string, status: number | "UNKNOWN", message: string, details: string | null = null, url: string | undefined = undefined, uniqId: string): ApiError => ({
        type, status, message, details, timestamp, url, uniqId
    });

    let apiError: ApiError;

    if (error instanceof AxiosError) {
        const status = error.response?.status || "UNKNOWN";
        const data = error.response?.data || null;
        const url = error.config?.url || undefined;
        const errorInfo = errorMessages[status] || errorMessages.UNKNOWN;

        apiError = createError(errorInfo.type, status, errorInfo.message, data, url, uniqId);
    } else if (error instanceof Error) {
        if (error.message.includes("Network Error")) {
            apiError = createError("NETWORK_ERROR", "UNKNOWN", "No internet connection. Please check your network.", null, undefined, uniqId);
        } else if (error.message.includes("timeout")) {
            apiError = createError("NETWORK_ERROR", "UNKNOWN", "Request Timeout. Try again later.", null, undefined, uniqId);
        } else {
            apiError = createError("UNKNOWN_ERROR", "UNKNOWN", error.message, null, undefined, uniqId);
        }
    } else {
        apiError = createError("UNKNOWN_ERROR", "UNKNOWN", "An unknown error occurred.", null, undefined, uniqId);
    }

    
    return apiError;

}







export default apiErrorHandler;