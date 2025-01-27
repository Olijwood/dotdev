const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Logs the given error message and error to the console in development mode.
 * @param message - error message
 * @param error - error object
 */
export const logError = (message: string, error: unknown) => {
    if (isDevelopment) {
        console.error(message, error);
    }
    // Optionally, you could send the error to an external error tracking service like Sentry
};
