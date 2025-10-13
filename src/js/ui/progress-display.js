/**
 * Progress Display
 * Handles rendering of progress bar and status
 */

import { FormatUtils } from '../utils/format-utils.js';

export class ProgressDisplay {
    constructor() {
        this.startTime = null;
        this.itemsProcessed = 0;
        this.totalItems = 0;
    }

    /**
     * Shows or hides the progress section
     */
    show(visible) {
        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = visible ? 'block' : 'none';
        
        if (!visible) {
            // Reset progress bar
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = '0%';
            // Hide proxy status
            const proxyStatus = document.getElementById('proxyStatus');
            proxyStatus.style.display = 'none';
        } else {
            // Reset timer when showing progress
            this.startTime = Date.now();
            this.itemsProcessed = 0;
        }
    }

    /**
     * Updates the proxy status display
     */
    updateProxyStatus(proxyName) {
        const proxyStatus = document.getElementById('proxyStatus');
        const proxyNameElement = document.getElementById('proxyName');
        
        if (proxyName) {
            proxyNameElement.textContent = proxyName;
            proxyStatus.style.display = 'flex';
        }
    }

    /**
     * Updates the progress display
     */
    update(message, current, total) {
        const progressStatus = document.getElementById('progressStatus');
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        const timeEstimate = document.getElementById('timeEstimate');
        
        progressStatus.textContent = message;
        progressText.textContent = `${current} / ${total}`;
        
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressBar.style.width = percentage + '%';
        
        // Update items processed counter
        this.itemsProcessed = current;
        this.totalItems = total;
        
        // Calculate and display estimated time remaining
        if (this.startTime && current > 0 && total > current) {
            const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
            const averageTimePerItem = elapsedTime / current;
            const remainingItems = total - current;
            const estimatedTimeRemaining = averageTimePerItem * remainingItems;
            
            timeEstimate.textContent = FormatUtils.formatTime(estimatedTimeRemaining);
        } else if (current >= total) {
            timeEstimate.textContent = 'Complete!';
        } else {
            timeEstimate.textContent = 'Calculating...';
        }
    }
}
