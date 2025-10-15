/**
 * Load Time Estimator
 * Estimates page load time based on resource sizes, network speeds, and parallel connections
 */

export class LoadTimeEstimator {
    // Network connection profiles (in Mbps)
    static NETWORK_PROFILES = {
        '3G': {
            name: '3G',
            downloadSpeed: 0.75, // 750 Kbps = 0.75 Mbps
            latency: 100, // ms
            maxConnections: 6,
        },
        '4G': {
            name: '4G/LTE',
            downloadSpeed: 10, // 10 Mbps
            latency: 50, // ms
            maxConnections: 6
        },
        '5G': {
            name: '5G',
            downloadSpeed: 100, // 100 Mbps
            latency: 10, // ms
            maxConnections: 10
        },
        'WiFi': {
            name: 'WiFi',
            downloadSpeed: 50, // 50 Mbps
            latency: 20, // ms
            maxConnections: 8
        },
        'Cable': {
            name: 'Cable/Fiber',
            downloadSpeed: 200, // 200 Mbps
            latency: 10, // ms
            maxConnections: 10
        }
    };

    /**
     * Calculate estimated load time for all network profiles
     * @param {Array} resources - Array of resource objects with size property
     * @returns {Object} Load time estimates for each network type
     */
    static estimateLoadTimes(resources) {
        if (!resources || resources.length === 0) {
            return null;
        }

        const estimates = {};

        for (const [key, profile] of Object.entries(this.NETWORK_PROFILES)) {
            estimates[key] = this.calculateLoadTime(resources, profile);
        }

        return estimates;
    }

    /**
     * Calculate load time for a specific network profile
     * @param {Array} resources - Array of resource objects
     * @param {Object} profile - Network profile configuration
     * @returns {Object} Detailed load time breakdown
     */
    static calculateLoadTime(resources, profile) {
        const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
        const resourceCount = resources.length;

        // Convert download speed from Mbps to bytes per millisecond
        const bytesPerMs = (profile.downloadSpeed * 1024 * 1024) / (8 * 1000);

        // Calculate download time with parallel connections
        const downloadTime = this.calculateParallelDownloadTime(
            resources,
            bytesPerMs,
            profile.maxConnections
        );

        // Calculate total latency (initial connection + DNS + TLS)
        const initialLatency = profile.latency * 3; // DNS + TCP + TLS handshake

        // Calculate additional latency for parallel connections
        // We don't need to wait for latency for every resource if downloaded in parallel
        const batchCount = Math.ceil(resourceCount / profile.maxConnections);
        const additionalLatency = profile.latency * (batchCount - 1);

        // Total time = initial latency + download time + additional latencies
        const totalTime = initialLatency + downloadTime + additionalLatency;

        // Parse and render time (estimated based on resource count and size)
        const parseRenderTime = this.estimateParseRenderTime(resources);

        // Grand total including parse/render
        const totalWithRender = totalTime + parseRenderTime;

        return {
            profile: profile.name,
            downloadTime: Math.round(downloadTime),
            latencyTime: Math.round(initialLatency + additionalLatency),
            parseRenderTime: Math.round(parseRenderTime),
            totalTime: Math.round(totalTime),
            totalWithRender: Math.round(totalWithRender),
            totalSize: totalSize,
            resourceCount: resourceCount,
            averageSpeed: profile.downloadSpeed,
            maxConnections: profile.maxConnections
        };
    }

    /**
     * Calculate download time considering parallel connections
     * @param {Array} resources - Array of resource objects
     * @param {Number} bytesPerMs - Download speed in bytes per millisecond
     * @param {Number} maxConnections - Maximum parallel connections
     * @returns {Number} Total download time in milliseconds
     */
    static calculateParallelDownloadTime(resources, bytesPerMs, maxConnections) {
        // Sort resources by size (descending) for better parallelization
        const sortedResources = [...resources].sort((a, b) => b.size - a.size);

        // Simulate parallel downloading
        const connectionQueues = Array(maxConnections).fill(0);
        
        sortedResources.forEach(resource => {
            // Find the connection that will be free first
            const minQueueIndex = connectionQueues.indexOf(Math.min(...connectionQueues));
            
            // Add download time for this resource to that connection
            const downloadTime = resource.size / bytesPerMs;
            connectionQueues[minQueueIndex] += downloadTime;
        });

        // The total time is when the last connection finishes
        return Math.max(...connectionQueues);
    }

    /**
     * Estimate parse and render time based on resources
     * @param {Array} resources - Array of resource objects
     * @returns {Number} Estimated parse/render time in milliseconds
     */
    static estimateParseRenderTime(resources) {
        let parseTime = 0;

        resources.forEach(resource => {
            switch (resource.type) {
                case 'html':
                    // HTML parsing: ~0.5ms per KB
                    parseTime += (resource.size / 1024) * 0.5;
                    break;
                case 'css':
                    // CSS parsing: ~0.3ms per KB + render tree
                    parseTime += (resource.size / 1024) * 0.3 + 50;
                    break;
                case 'js':
                case 'script':
                    // JS parsing + execution: ~1ms per KB
                    parseTime += (resource.size / 1024) * 1;
                    break;
                case 'image':
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'webp':
                case 'svg':
                    // Image decoding: ~0.1ms per KB
                    parseTime += (resource.size / 1024) * 0.1;
                    break;
                default:
                    // Other resources: minimal parsing
                    parseTime += (resource.size / 1024) * 0.05;
            }
        });

        // Add base render time (layout, paint, composite)
        const baseRenderTime = 100;

        return parseTime + baseRenderTime;
    }

    /**
     * Format time in human-readable format
     * @param {Number} ms - Time in milliseconds
     * @returns {String} Formatted time string
     */
    static formatTime(ms) {
        if (ms < 1000) {
            return `${Math.round(ms)}ms`;
        } else if (ms < 60000) {
            const seconds = (ms / 1000).toFixed(1);
            return `${seconds}s`;
        } else {
            const minutes = Math.floor(ms / 60000);
            const seconds = Math.round((ms % 60000) / 1000);
            return `${minutes}m ${seconds}s`;
        }
    }

    /**
     * Get speed category based on total load time
     * @param {Number} ms - Total load time in milliseconds
     * @returns {Object} Speed category with label and color
     */
    static getSpeedCategory(ms) {
        if (ms < 1000) {
            return { label: 'Excellent', color: '#10b981' };
        } else if (ms < 2500) {
            return { label: 'Good', color: '#3b82f6' };
        } else if (ms < 5000) {
            return { label: 'Fair', color: '#f59e0b' };
        } else if (ms < 10000) {
            return { label: 'Slow', color: '#ef4444' };
        } else {
            return { label: 'Very Slow', color: '#991b1b' };
        }
    }
}
