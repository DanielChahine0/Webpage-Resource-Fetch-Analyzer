/**
 * CSV Exporter
 * Handles exporting analysis results to CSV format
 */

import { FormatUtils } from '../utils/format-utils.js';
import { LoadTimeEstimator } from '../core/load-time-estimator.js';

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

        // Add load time estimates
        const estimates = LoadTimeEstimator.estimateLoadTimes(analyzer.resources);
        if (estimates) {
            csv += '\n\nLoad Time Estimates\n';
            csv += 'Network Type,Download Speed (Mbps),Latency (ms),Download Time,Parse/Render Time,Total Time\n';
            
            Object.values(estimates).forEach(data => {
                csv += `"${data.profile}",${data.averageSpeed},${data.latencyTime},`;
                csv += `"${LoadTimeEstimator.formatTime(data.downloadTime)}",`;
                csv += `"${LoadTimeEstimator.formatTime(data.parseRenderTime)}",`;
                csv += `"${LoadTimeEstimator.formatTime(data.totalWithRender)}"\n`;
            });
        }

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
