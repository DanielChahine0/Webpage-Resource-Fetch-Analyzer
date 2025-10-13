/**
 * Format Utility Functions
 * Handles data formatting and display
 */

export class FormatUtils {
    /**
     * Formats bytes to human-readable format
     */
    static formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Formats time in seconds to human-readable format
     */
    static formatTime(seconds) {
        if (seconds < 1) {
            return 'Less than a second';
        } else if (seconds < 60) {
            return `${Math.round(seconds)} second${seconds !== 1 ? 's' : ''}`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.round(seconds % 60);
            if (remainingSeconds === 0) {
                return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
            return `${minutes} min ${remainingSeconds} sec`;
        }
    }
}
