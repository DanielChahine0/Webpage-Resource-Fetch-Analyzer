/**
 * Load Time Display
 * Handles rendering of load time estimates
 */

import { LoadTimeEstimator } from '../core/load-time-estimator.js';

export class LoadTimeDisplay {
    /**
     * Display load time estimates
     * @param {Array} resources - Array of resource objects
     */
    static display(resources) {
        const container = document.getElementById('loadTimeEstimates');
        if (!container) {
            console.warn('Load time estimates container not found');
            return;
        }

        const estimates = LoadTimeEstimator.estimateLoadTimes(resources);
        
        if (!estimates) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        container.innerHTML = this.generateHTML(estimates);
    }

    /**
     * Generate HTML for load time estimates
     * @param {Object} estimates - Load time estimates for all network types
     * @returns {String} HTML string
     */
    static generateHTML(estimates) {
        const networkCards = Object.entries(estimates)
            .map(([key, data]) => this.createNetworkCard(key, data))
            .join('');

        return `
            <div class="load-time-header">
                <h3>Estimated Load Times</h3>
                <p class="load-time-description">
                    Estimated page load times across different network connections based on resource sizes and parallel downloading
                </p>
            </div>
            <div class="load-time-grid">
                ${networkCards}
            </div>
            <div class="load-time-footer">
                <p class="load-time-note">
                    <strong>Note:</strong> These are estimates based on ideal conditions. 
                    Actual load times may vary due to server response times, browser rendering, 
                    JavaScript execution, and network conditions.
                </p>
                <div class="load-time-legend">
                    <span class="legend-title">Load Time Components:</span>
                    <span class="legend-item"><span class="legend-dot" style="background: #3b82f6;"></span>Network Latency</span>
                    <span class="legend-item"><span class="legend-dot" style="background: #8b5cf6;"></span>Download Time</span>
                    <span class="legend-item"><span class="legend-dot" style="background: #10b981;"></span>Parse & Render</span>
                </div>
            </div>
        `;
    }

    /**
     * Create a network card
     * @param {String} key - Network type key
     * @param {Object} data - Network load time data
     * @returns {String} HTML string for network card
     */
    static createNetworkCard(key, data) {
        const speedCategory = LoadTimeEstimator.getSpeedCategory(data.totalWithRender);
        const totalTime = LoadTimeEstimator.formatTime(data.totalWithRender);
        const downloadTime = LoadTimeEstimator.formatTime(data.downloadTime);
        const latencyTime = LoadTimeEstimator.formatTime(data.latencyTime);
        const parseTime = LoadTimeEstimator.formatTime(data.parseRenderTime);

        // Calculate percentages for visual breakdown
        const total = data.totalWithRender;
        const latencyPercent = Math.round((data.latencyTime / total) * 100);
        const downloadPercent = Math.round((data.downloadTime / total) * 100);
        const parsePercent = Math.round((data.parseRenderTime / total) * 100);

        return `
            <div class="network-card" data-network="${key}">
                <div class="network-header">
                    <div class="network-info">
                        <h4 class="network-name">${data.profile}</h4>
                        <span class="network-speed">${data.averageSpeed} Mbps</span>
                    </div>
                </div>
                
                <div class="load-time-main">
                    <div class="load-time-value" style="color: ${speedCategory.color};">
                        ${totalTime}
                    </div>
                    <div class="load-time-badge" style="background: ${speedCategory.color};">
                        ${speedCategory.label}
                    </div>
                </div>

                <div class="load-time-breakdown">
                    <div class="breakdown-bar">
                        <div class="breakdown-segment breakdown-latency" 
                             style="width: ${latencyPercent}%;" 
                             title="Latency: ${latencyTime}"></div>
                        <div class="breakdown-segment breakdown-download" 
                             style="width: ${downloadPercent}%;" 
                             title="Download: ${downloadTime}"></div>
                        <div class="breakdown-segment breakdown-parse" 
                             style="width: ${parsePercent}%;" 
                             title="Parse & Render: ${parseTime}"></div>
                    </div>
                    
                    <div class="breakdown-details">
                        <div class="breakdown-item">
                            <span class="breakdown-label">Latency:</span>
                            <span class="breakdown-value">${latencyTime}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Download:</span>
                            <span class="breakdown-value">${downloadTime}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Parse & Render:</span>
                            <span class="breakdown-value">${parseTime}</span>
                        </div>
                    </div>
                </div>

                <div class="network-details">
                    <div class="detail-item">
                        <span class="detail-text">${data.resourceCount} resources</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-text">${data.maxConnections} parallel connections</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Hide load time estimates
     */
    static hide() {
        const container = document.getElementById('loadTimeEstimates');
        if (container) {
            container.style.display = 'none';
        }
    }

    /**
     * Clear load time estimates
     */
    static clear() {
        const container = document.getElementById('loadTimeEstimates');
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    }
}
