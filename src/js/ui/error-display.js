/**
 * Error Display
 * Handles error message display
 */

export class ErrorDisplay {
    /**
     * Shows an error message
     */
    static show(message) {
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');
        const resultsSection = document.getElementById('resultsSection');

        // Preserve line breaks in error messages
        errorMessage.textContent = message;
        errorMessage.style.whiteSpace = 'pre-wrap';
        errorSection.style.display = 'block';
        resultsSection.style.display = 'none';
    }

    /**
     * Hides the error message
     */
    static hide() {
        const errorSection = document.getElementById('errorSection');
        errorSection.style.display = 'none';
    }
}
