/**
 * Results Display
 * Handles rendering of analysis results
 */

import { FormatUtils } from '../utils/format-utils.js';

export class ResultsDisplay {
    constructor(analyzer) {
        this.analyzer = analyzer;
    }

    /**
     * Adds a resource to the results table
     */
    addResourceToTable(resource, index) {
        const tbody = document.getElementById('resourcesBody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index}</td>
            <td><strong>${resource.name}</strong></td>
            <td><span class="file-type type-${resource.type}">${resource.type.toUpperCase()}</span></td>
            <td>${FormatUtils.formatBytes(resource.size)}</td>
            <td class="url-cell" title="${resource.url}">${resource.url}</td>
        `;
        tbody.appendChild(row);
        
        // Auto-scroll to show new items
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Updates the statistics cards
     */
    updateStats(fileCount, totalSize, mainHtmlSize) {
        document.getElementById('totalFiles').textContent = fileCount;
        document.getElementById('totalSize').textContent = FormatUtils.formatBytes(totalSize);
        if (mainHtmlSize !== undefined) {
            document.getElementById('mainHtmlSize').textContent = FormatUtils.formatBytes(mainHtmlSize);
        }
    }

    /**
     * Clears the results table
     */
    clearTable() {
        const tbody = document.getElementById('resourcesBody');
        tbody.innerHTML = '';
    }

    /**
     * Shows the results section
     */
    show() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
    }

    /**
     * Hides the results section
     */
    hide() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';
    }
}
