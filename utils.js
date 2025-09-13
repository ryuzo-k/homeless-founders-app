// Production-safe logging utility
function log(...args) {
    if (typeof CONFIG !== 'undefined' && CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log(...args);
    }
}

function logError(...args) {
    // Always log errors, even in production
    console.error(...args);
}

function logWarn(...args) {
    if (typeof CONFIG !== 'undefined' && CONFIG.ENABLE_CONSOLE_LOGS) {
        console.warn(...args);
    }
}

// Export for use in other files
window.log = log;
window.logError = logError;
window.logWarn = logWarn;
