/**
 * Loading Display
 * Handles loading button state
 */

export class LoadingDisplay {
    /**
     * Shows or hides the loading state
     */
    static show(visible) {
        const btn = document.getElementById('analyzeBtn');
        const btnText = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.loader');

        btn.disabled = visible;
        btnText.style.display = visible ? 'none' : 'inline';
        loader.style.display = visible ? 'inline-block' : 'none';
    }
}
