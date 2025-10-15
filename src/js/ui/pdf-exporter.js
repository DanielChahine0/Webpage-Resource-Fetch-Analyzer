/**
 * PDF Report Exporter
 * Generates comprehensive PDF reports with charts, visualizations, and analysis
 */

import { FormatUtils } from '../utils/format-utils.js';
import { LoadTimeEstimator } from '../core/load-time-estimator.js';

export class PDFExporter {
    /**
     * Export analysis results to a professional PDF report
     * @param {Object} results - Analysis results
     * @param {Object} analyzer - Resource analyzer instance
     * @param {Object} performanceData - Performance score data
     * @param {Object} options - Customizable report options
     */
    static async export(results, analyzer, performanceData, options = {}) {
        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            throw new Error('jsPDF library not loaded. Please include jsPDF in your HTML.');
        }

        const { jsPDF } = window.jspdf;
        
        // Default options
        const reportOptions = {
            includeExecutiveSummary: true,
            includePerformanceScore: true,
            includeLoadTimeEstimates: true,
            includeResourceBreakdown: true,
            includeDetailedTable: true,
            includeCharts: true,
            includeRecommendations: true,
            ...options
        };

        // Create PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        let yPos = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (2 * margin);

        // Add header with branding
        this.addHeader(doc, yPos, pageWidth, margin);
        yPos += 35;

        // Add executive summary
        if (reportOptions.includeExecutiveSummary) {
            yPos = this.addExecutiveSummary(doc, yPos, margin, contentWidth, results, performanceData, pageHeight);
        }

        // Add performance score section
        if (reportOptions.includePerformanceScore && performanceData) {
            yPos = this.addPerformanceScore(doc, yPos, margin, contentWidth, performanceData, pageHeight);
        }

        // Add load time estimates
        if (reportOptions.includeLoadTimeEstimates) {
            yPos = this.addLoadTimeEstimates(doc, yPos, margin, contentWidth, analyzer, pageHeight);
        }

        // Add resource breakdown
        if (reportOptions.includeResourceBreakdown) {
            yPos = await this.addResourceBreakdown(doc, yPos, margin, contentWidth, results, pageHeight);
        }

        // Add recommendations
        if (reportOptions.includeRecommendations && performanceData) {
            yPos = this.addRecommendations(doc, yPos, margin, contentWidth, performanceData, results, pageHeight);
        }

        // Add detailed resource table
        if (reportOptions.includeDetailedTable) {
            yPos = this.addResourceTable(doc, yPos, margin, contentWidth, results, pageHeight);
        }

        // Add footer to all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            this.addFooter(doc, pageHeight, pageWidth, i, pageCount);
        }

        // Save the PDF
        const timestamp = new Date().toISOString().split('T')[0];
        const urlHost = new URL(results.url || 'https://example.com').hostname;
        doc.save(`webpage-analysis-${urlHost}-${timestamp}.pdf`);
    }

    /**
     * Add header section
     */
    static addHeader(doc, yPos, pageWidth, margin) {
        // Title
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(26, 26, 46); // #1a1a2e
        doc.text('Webpage Resource Analysis Report', pageWidth / 2, yPos, { align: 'center' });

        // Subtitle
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Comprehensive Performance and Resource Analysis', pageWidth / 2, yPos, { align: 'center' });

        // Date
        yPos += 6;
        const reportDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(`Generated: ${reportDate}`, pageWidth / 2, yPos, { align: 'center' });

        // Separator line
        yPos += 5;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
    }

    /**
     * Add executive summary section
     */
    static addExecutiveSummary(doc, yPos, margin, contentWidth, results, performanceData, pageHeight) {
        yPos = this.checkPageBreak(doc, yPos, 60, pageHeight, margin);

        // Section title
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(26, 26, 46);
        doc.text('Executive Summary', margin, yPos);
        yPos += 10;

        // URL analyzed
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('URL Analyzed:', margin, yPos);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 100, 255);
        const urlText = doc.splitTextToSize(results.url || 'N/A', contentWidth - 30);
        doc.text(urlText, margin + 30, yPos);
        yPos += 8;

        // Key metrics in a box
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(margin, yPos, contentWidth, 45, 2, 2, 'F');

        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text('Key Metrics', margin + 5, yPos);
        yPos += 7;

        // Metrics in columns
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const col1X = margin + 5;
        const col2X = margin + contentWidth / 2;

        // Column 1
        doc.setFont(undefined, 'bold');
        doc.text('Performance Score:', col1X, yPos);
        doc.setFont(undefined, 'normal');
        const scoreColor = this.getScoreColor(performanceData.totalScore);
        doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
        doc.text(`${performanceData.totalScore}/100`, col1X + 40, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;

        doc.setFont(undefined, 'bold');
        doc.text('Total Resources:', col1X, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(`${results.totalFiles} files`, col1X + 40, yPos);
        yPos += 6;

        doc.setFont(undefined, 'bold');
        doc.text('Total Size:', col1X, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(FormatUtils.formatBytes(results.totalSize), col1X + 40, yPos);

        // Column 2
        yPos -= 12;
        doc.setFont(undefined, 'bold');
        doc.text('Page Load Grade:', col2X, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(this.getGradeLetter(performanceData.totalScore), col2X + 40, yPos);
        yPos += 6;

        doc.setFont(undefined, 'bold');
        doc.text('Largest Resource:', col2X, yPos);
        doc.setFont(undefined, 'normal');
        const largestResource = results.resources.reduce((max, r) => r.size > max.size ? r : max, results.resources[0]);
        doc.text(FormatUtils.formatBytes(largestResource.size), col2X + 40, yPos);
        yPos += 6;

        doc.setFont(undefined, 'bold');
        doc.text('Analysis Status:', col2X, yPos);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 150, 0);
        doc.text('Complete', col2X + 40, yPos);
        doc.setTextColor(0, 0, 0);

        yPos += 15;
        return yPos;
    }

    /**
     * Add performance score section with breakdown
     */
    static addPerformanceScore(doc, yPos, margin, contentWidth, performanceData, pageHeight) {
        yPos = this.checkPageBreak(doc, yPos, 80, pageHeight, margin);

        // Section title
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(26, 26, 46);
        doc.text('Performance Score Analysis', margin, yPos);
        yPos += 10;

        // Overall score with visual indicator
        const scoreBoxWidth = contentWidth / 3;
        const scoreBoxHeight = 30;
        const scoreBoxX = margin + (contentWidth - scoreBoxWidth) / 2;
        
        const scoreColor = this.getScoreColor(performanceData.totalScore);
        doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
        doc.roundedRect(scoreBoxX, yPos, scoreBoxWidth, scoreBoxHeight, 3, 3, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont(undefined, 'bold');
        doc.text(`${performanceData.totalScore}`, scoreBoxX + scoreBoxWidth / 2, yPos + 12, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text('Overall Score', scoreBoxX + scoreBoxWidth / 2, yPos + 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Grade: ${this.getGradeLetter(performanceData.totalScore)}`, scoreBoxX + scoreBoxWidth / 2, yPos + 26, { align: 'center' });

        yPos += scoreBoxHeight + 12;

        // Score breakdown
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Score Breakdown', margin, yPos);
        yPos += 8;

        // Draw breakdown bars
        const breakdown = performanceData.breakdown;
        const categories = [
            { name: 'Page Size', score: breakdown.pageSize, weight: '30%' },
            { name: 'Request Count', score: breakdown.requestCount, weight: '25%' },
            { name: 'Resource Distribution', score: breakdown.resourceDistribution, weight: '25%' },
            { name: 'Compression', score: breakdown.compression, weight: '20%' }
        ];

        doc.setFontSize(9);
        categories.forEach(cat => {
            yPos = this.checkPageBreak(doc, yPos, 15, pageHeight, margin);
            
            // Category name and weight
            doc.setFont(undefined, 'bold');
            doc.text(`${cat.name} (${cat.weight})`, margin, yPos);
            
            // Score value
            doc.setFont(undefined, 'normal');
            doc.text(`${cat.score}/100`, margin + contentWidth - 15, yPos, { align: 'right' });
            
            yPos += 4;
            
            // Progress bar background
            const barWidth = contentWidth;
            const barHeight = 5;
            doc.setFillColor(230, 230, 230);
            doc.roundedRect(margin, yPos, barWidth, barHeight, 1, 1, 'F');
            
            // Progress bar fill
            const fillWidth = (cat.score / 100) * barWidth;
            const fillColor = this.getScoreColor(cat.score);
            doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
            doc.roundedRect(margin, yPos, fillWidth, barHeight, 1, 1, 'F');
            
            yPos += 9;
        });

        yPos += 5;
        return yPos;
    }

    /**
     * Add load time estimates section
     */
    static addLoadTimeEstimates(doc, yPos, margin, contentWidth, analyzer, pageHeight) {
        yPos = this.checkPageBreak(doc, yPos, 70, pageHeight, margin);

        // Section title
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(26, 26, 46);
        doc.text('Load Time Estimates', margin, yPos);
        yPos += 10;

        const estimates = LoadTimeEstimator.estimateLoadTimes(analyzer.resources);
        if (!estimates) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text('No load time data available', margin, yPos);
            return yPos + 10;
        }

        // Create table data
        const tableData = Object.values(estimates).map(data => [
            data.profile,
            `${data.averageSpeed} Mbps`,
            `${data.latencyTime} ms`,
            LoadTimeEstimator.formatTime(data.downloadTime),
            LoadTimeEstimator.formatTime(data.parseRenderTime),
            LoadTimeEstimator.formatTime(data.totalWithRender)
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Network', 'Speed', 'Latency', 'Download', 'Parse/Render', 'Total Time']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [26, 26, 46],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 8
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            margin: { left: margin, right: margin },
            tableWidth: contentWidth
        });

        yPos = doc.lastAutoTable.finalY + 10;
        return yPos;
    }

    /**
     * Add resource breakdown section
     */
    static async addResourceBreakdown(doc, yPos, margin, contentWidth, results, pageHeight) {
        yPos = this.checkPageBreak(doc, yPos, 100, pageHeight, margin);

        // Section title
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(26, 26, 46);
        doc.text('Resource Breakdown by Type', margin, yPos);
        yPos += 10;

        // Calculate resource statistics by type
        const typeStats = this.calculateTypeStats(results.resources);
        
        // Create breakdown chart (text-based)
        doc.setFontSize(10);
        Object.entries(typeStats).forEach(([type, stats]) => {
            yPos = this.checkPageBreak(doc, yPos, 20, pageHeight, margin);
            
            // Type name
            doc.setFont(undefined, 'bold');
            const typeDisplay = type.toUpperCase();
            doc.text(typeDisplay, margin, yPos);
            
            // Stats
            doc.setFont(undefined, 'normal');
            doc.text(`${stats.count} files | ${FormatUtils.formatBytes(stats.size)}`, margin + 30, yPos);
            
            // Percentage of total
            const percentage = ((stats.size / results.totalSize) * 100).toFixed(1);
            doc.text(`${percentage}%`, margin + contentWidth - 15, yPos, { align: 'right' });
            
            yPos += 5;
            
            // Visual bar
            const barWidth = contentWidth;
            const barHeight = 6;
            doc.setFillColor(230, 230, 230);
            doc.roundedRect(margin, yPos, barWidth, barHeight, 1, 1, 'F');
            
            const fillWidth = (stats.size / results.totalSize) * barWidth;
            const typeColor = this.getTypeColor(type);
            doc.setFillColor(typeColor[0], typeColor[1], typeColor[2]);
            doc.roundedRect(margin, yPos, fillWidth, barHeight, 1, 1, 'F');
            
            yPos += 10;
        });

        yPos += 5;
        return yPos;
    }

    /**
     * Add recommendations section
     */
    static addRecommendations(doc, yPos, margin, contentWidth, performanceData, results, pageHeight) {
        yPos = this.checkPageBreak(doc, yPos, 80, pageHeight, margin);

        // Section title
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(26, 26, 46);
        doc.text('Optimization Recommendations', margin, yPos);
        yPos += 10;

        const recommendations = this.generateRecommendations(performanceData, results);
        
        doc.setFontSize(10);
        recommendations.forEach((rec, index) => {
            yPos = this.checkPageBreak(doc, yPos, 25, pageHeight, margin);
            
            // Priority indicator
            const priorityColor = rec.priority === 'high' ? [220, 53, 69] : 
                                 rec.priority === 'medium' ? [255, 193, 7] : [40, 167, 69];
            doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
            doc.circle(margin + 2, yPos - 1.5, 2, 'F');
            
            // Recommendation text
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(`${index + 1}. ${rec.title}`, margin + 7, yPos);
            yPos += 5;
            
            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            const descLines = doc.splitTextToSize(rec.description, contentWidth - 10);
            doc.text(descLines, margin + 7, yPos);
            yPos += descLines.length * 4 + 5;
        });

        yPos += 5;
        return yPos;
    }

    /**
     * Add detailed resource table
     */
    static addResourceTable(doc, yPos, margin, contentWidth, results, pageHeight) {
        // Add on new page if needed
        if (yPos > pageHeight - 80) {
            doc.addPage();
            yPos = 20;
        }

        // Section title
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(26, 26, 46);
        doc.text('Detailed Resource List', margin, yPos);
        yPos += 10;

        // Limit to top 50 resources for PDF (to avoid excessive pages)
        const resources = results.resources.slice(0, 50);
        const tableData = resources.map((resource, index) => [
            index + 1,
            resource.name,
            resource.type.toUpperCase(),
            FormatUtils.formatBytes(resource.size)
        ]);

        if (results.resources.length > 50) {
            tableData.push(['...', `${results.resources.length - 50} more resources`, '', '']);
        }

        doc.autoTable({
            startY: yPos,
            head: [['#', 'File Name', 'Type', 'Size']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [26, 26, 46],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 8
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: contentWidth - 45 },
                2: { cellWidth: 15 },
                3: { cellWidth: 20, halign: 'right' }
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            margin: { left: margin, right: margin }
        });

        return doc.lastAutoTable.finalY + 10;
    }

    /**
     * Add footer to page
     */
    static addFooter(doc, pageHeight, pageWidth, pageNum, totalPages) {
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        
        // Page number
        doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        // Created by
        doc.text('Created by Webpage Resource Fetch Analyzer', pageWidth - 20, pageHeight - 10, { align: 'right' });
    }

    /**
     * Check if page break is needed
     */
    static checkPageBreak(doc, yPos, requiredSpace, pageHeight, margin) {
        if (yPos + requiredSpace > pageHeight - 20) {
            doc.addPage();
            return margin;
        }
        return yPos;
    }

    /**
     * Get color based on score
     */
    static getScoreColor(score) {
        if (score >= 90) return [40, 167, 69]; // Green
        if (score >= 75) return [92, 184, 92]; // Light green
        if (score >= 50) return [255, 193, 7]; // Yellow
        if (score >= 25) return [255, 152, 0]; // Orange
        return [220, 53, 69]; // Red
    }

    /**
     * Get grade letter based on score
     */
    static getGradeLetter(score) {
        if (score >= 90) return 'A (Excellent)';
        if (score >= 75) return 'B (Good)';
        if (score >= 50) return 'C (Fair)';
        if (score >= 25) return 'D (Poor)';
        return 'F (Critical)';
    }

    /**
     * Get color for resource type
     */
    static getTypeColor(type) {
        const colors = {
            html: [52, 152, 219],
            css: [155, 89, 182],
            js: [241, 196, 15],
            image: [46, 204, 113],
            font: [230, 126, 34],
            video: [231, 76, 60],
            audio: [26, 188, 156],
            other: [149, 165, 166]
        };
        return colors[type] || colors.other;
    }

    /**
     * Calculate statistics by resource type
     */
    static calculateTypeStats(resources) {
        const stats = {};
        resources.forEach(resource => {
            if (!stats[resource.type]) {
                stats[resource.type] = { count: 0, size: 0 };
            }
            stats[resource.type].count++;
            stats[resource.type].size += resource.size;
        });
        
        // Sort by size descending
        return Object.fromEntries(
            Object.entries(stats).sort(([, a], [, b]) => b.size - a.size)
        );
    }

    /**
     * Generate optimization recommendations
     */
    static generateRecommendations(performanceData, results) {
        const recommendations = [];
        const breakdown = performanceData.breakdown;
        
        // Page size recommendations
        if (breakdown.pageSize < 50) {
            recommendations.push({
                priority: 'high',
                title: 'Reduce Total Page Size',
                description: 'Your page size is very large. Consider implementing lazy loading, compressing images, minifying CSS/JS, and removing unused resources. Target: Under 2MB for optimal performance.'
            });
        } else if (breakdown.pageSize < 75) {
            recommendations.push({
                priority: 'medium',
                title: 'Optimize Page Size',
                description: 'Page size could be improved. Review large resources and implement compression strategies. Consider using modern image formats like WebP.'
            });
        }

        // Request count recommendations
        if (breakdown.requestCount < 50) {
            recommendations.push({
                priority: 'high',
                title: 'Reduce HTTP Requests',
                description: 'Too many HTTP requests detected. Bundle CSS and JavaScript files, use CSS sprites for images, and implement resource concatenation where possible.'
            });
        } else if (breakdown.requestCount < 75) {
            recommendations.push({
                priority: 'medium',
                title: 'Optimize Request Count',
                description: 'Consider reducing the number of external resources. Bundle files and use HTTP/2 server push where applicable.'
            });
        }

        // Resource distribution recommendations
        if (breakdown.resourceDistribution < 50) {
            recommendations.push({
                priority: 'high',
                title: 'Balance Resource Distribution',
                description: 'Resource distribution is unbalanced. Review oversized images and JavaScript files. Implement code splitting and optimize asset delivery.'
            });
        } else if (breakdown.resourceDistribution < 75) {
            recommendations.push({
                priority: 'medium',
                title: 'Improve Resource Balance',
                description: 'Some resource types are disproportionately large. Consider optimizing the largest resource categories.'
            });
        }

        // Compression recommendations
        if (breakdown.compression < 50) {
            recommendations.push({
                priority: 'high',
                title: 'Enable Compression',
                description: 'Resources appear uncompressed. Enable Gzip or Brotli compression on your server. Minify CSS and JavaScript files.'
            });
        } else if (breakdown.compression < 75) {
            recommendations.push({
                priority: 'medium',
                title: 'Enhance Compression',
                description: 'Improve compression by using modern formats and minification techniques. Review large files for optimization opportunities.'
            });
        }

        // General recommendations
        if (performanceData.totalScore < 75) {
            recommendations.push({
                priority: 'low',
                title: 'Implement Caching Strategy',
                description: 'Configure browser caching for static resources. Use CDN for faster content delivery. Set appropriate cache headers.'
            });
            
            recommendations.push({
                priority: 'low',
                title: 'Consider Performance Monitoring',
                description: 'Set up continuous performance monitoring. Track Core Web Vitals and user experience metrics over time.'
            });
        }

        return recommendations.slice(0, 6); // Limit to top 6 recommendations
    }
}
