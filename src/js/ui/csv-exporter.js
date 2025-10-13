/**
 * CSV Exporter
 * Handles exporting analysis results to CSV format
 */

import { FormatUtils } from '../utils/format-utils.js';

export class CSVExporter {
    /**
     * Exports results to CSV file
     */
    static export(results, analyzer) {
        if (!results) return;

        let csv = 'File Name,Type,Size (Bytes),Size (Formatted),URL\n';

        results.resources.forEach(resource => {
            csv += `"${resource.name}","${resource.type}",${resource.size},"${FormatUtils.formatBytes(resource.size)}","${resource.url}"\n`;
        });

        csv += `\nTotal Files,${results.totalFiles}\n`;
        csv += `Total Size,${results.totalSize},"${FormatUtils.formatBytes(results.totalSize)}"\n`;

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resource-analysis.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}
