/**
 * Logger Utility
 * 
 * Provides development logging that can be disabled in production
 * Set isDevelopment to false for production builds
 */

const isDevelopment = true; // Set to false for production

export const logger = {
    log: (...args) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },
    warn: (...args) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },
    error: (...args) => {
        // Always log errors, even in production
        console.error(...args);
    },
    info: (...args) => {
        if (isDevelopment) {
            console.info(...args);
        }
    }
};
