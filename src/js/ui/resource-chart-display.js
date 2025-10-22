/**
 * Resource Chart Display
 * Displays interactive pie chart showing resource type breakdown
 */

import { FormatUtils } from '../utils/format-utils.js';

export class ResourceChartDisplay {
    static chartInstance = null;

    /**
     * Calculates resource type statistics
     */
    static calculateTypeStats(resources) {
        const typeStats = {};
        let totalSize = 0;

        resources.forEach(resource => {
            const type = resource.type;
            if (!typeStats[type]) {
                typeStats[type] = {
                    count: 0,
                    size: 0,
                    type: type
                };
            }
            typeStats[type].count++;
            typeStats[type].size += resource.size;
            totalSize += resource.size;
        });

        // Calculate percentages and format data
        const statsArray = Object.values(typeStats).map(stat => ({
            ...stat,
            percentage: (stat.size / totalSize * 100).toFixed(1),
            formattedSize: FormatUtils.formatBytes(stat.size)
        }));

        // Sort by size (largest first)
        statsArray.sort((a, b) => b.size - a.size);

        return { stats: statsArray, totalSize };
    }

    /**
     * Gets color for resource type
     */
    static getTypeColor(type) {
        const colors = {
            'html': '#e74c3c',
            'css': '#3498db',
            'js': '#f39c12',
            'image': '#2ecc71',
            'font': '#9b59b6',
            'video': '#e67e22',
            'audio': '#1abc9c',
            'other': '#95a5a6'
        };
        return colors[type] || colors['other'];
    }

    /**
     * Gets label for resource type
     */
    static getTypeLabel(type) {
        const labels = {
            'html': 'HTML',
            'css': 'CSS',
            'js': 'JavaScript',
            'image': 'Images',
            'font': 'Fonts',
            'video': 'Videos',
            'audio': 'Audio',
            'other': 'Other'
        };
        return labels[type] || 'Other';
    }

    /**
     * Displays the resource type chart
     */
    static display(resources) {
        const container = document.getElementById('resourceChartContainer');
        if (!container) return;

        const chartSection = document.getElementById('resourceChartSection');
        if (chartSection) {
            chartSection.style.display = 'block';
        }

        // Calculate statistics
        const { stats, totalSize } = this.calculateTypeStats(resources);

        // Clear existing chart
        container.innerHTML = '';

        // Create canvas for chart
        const canvas = document.createElement('canvas');
        canvas.id = 'resourceTypeChart';
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Resource type distribution pie chart');
        container.appendChild(canvas);

        // Prepare chart data
        const labels = stats.map(stat => this.getTypeLabel(stat.type));
        const data = stats.map(stat => stat.size);
        const colors = stats.map(stat => this.getTypeColor(stat.type));

        // Create chart using Chart.js
        const ctx = canvas.getContext('2d');
        
        // Destroy previous chart instance if exists
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 46, 0.95)',
                        titleColor: '#e0e0e0',
                        bodyColor: '#e0e0e0',
                        borderColor: '#4a90e2',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: (context) => {
                                const stat = stats[context.dataIndex];
                                return [
                                    `${context.label}`,
                                    `Size: ${stat.formattedSize}`,
                                    `Count: ${stat.count} files`,
                                    `Percentage: ${stat.percentage}%`
                                ];
                            }
                        }
                    }
                }
            }
        });

        // Create statistics table below chart
        this.createStatsTable(stats, totalSize);
    }

    /**
     * Creates a statistics table showing detailed breakdown
     */
    static createStatsTable(stats, totalSize) {
        const tableContainer = document.getElementById('resourceChartStats');
        if (!tableContainer) return;

        tableContainer.innerHTML = `
            <h4>Resource Type Breakdown</h4>
            <table class="resource-chart-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Count</th>
                        <th>Size</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.map(stat => `
                        <tr>
                            <td>
                                <span class="type-indicator" style="background-color: ${this.getTypeColor(stat.type)}"></span>
                                ${this.getTypeLabel(stat.type)}
                            </td>
                            <td>${stat.count}</td>
                            <td>${stat.formattedSize}</td>
                            <td>
                                <div class="percentage-bar-container">
                                    <div class="percentage-bar" style="width: ${stat.percentage}%; background-color: ${this.getTypeColor(stat.type)}"></div>
                                    <span class="percentage-text">${stat.percentage}%</span>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td><strong>Total</strong></td>
                        <td><strong>${stats.reduce((sum, stat) => sum + stat.count, 0)}</strong></td>
                        <td><strong>${FormatUtils.formatBytes(totalSize)}</strong></td>
                        <td><strong>100%</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    /**
     * Hides the resource chart section
     */
    static hide() {
        const chartSection = document.getElementById('resourceChartSection');
        if (chartSection) {
            chartSection.style.display = 'none';
        }
        
        // Destroy chart instance
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
}
