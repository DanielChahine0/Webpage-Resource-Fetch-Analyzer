/**
 * Duplicate Resource Detector
 * Identifies resources loaded multiple times and calculates wasted bandwidth
 */

import { FormatUtils } from '../utils/format-utils.js';

export class DuplicateDetector {
    /**
     * Analyzes resources to find duplicates
     * @param {Array} resources - Array of resource objects
     * @returns {Object} - Duplicate analysis results
     */
    static analyzeDuplicates(resources) {
        if (!resources || resources.length === 0) {
            return {
                hasDuplicates: false,
                duplicateGroups: [],
                totalDuplicates: 0,
                wastedBandwidth: 0,
                uniqueResources: 0
            };
        }

        // Group resources by their filename (ignoring URL differences)
        const fileNameMap = new Map();
        const exactURLMap = new Map();

        resources.forEach(resource => {
            const fileName = this.extractFileName(resource.name);
            const url = resource.url;

            // Track by filename
            if (!fileNameMap.has(fileName)) {
                fileNameMap.set(fileName, []);
            }
            fileNameMap.get(fileName).push(resource);

            // Track by exact URL
            if (!exactURLMap.has(url)) {
                exactURLMap.set(url, []);
            }
            exactURLMap.get(url).push(resource);
        });

        // Find duplicates
        const duplicateGroups = [];
        let totalDuplicateInstances = 0;
        let wastedBandwidth = 0;

        // Check for same filename from different URLs
        fileNameMap.forEach((resourceList, fileName) => {
            if (resourceList.length > 1) {
                // Check if these are truly duplicates (same size) or just same name
                const sizeGroups = new Map();
                
                resourceList.forEach(resource => {
                    const sizeKey = resource.size;
                    if (!sizeGroups.has(sizeKey)) {
                        sizeGroups.set(sizeKey, []);
                    }
                    sizeGroups.get(sizeKey).push(resource);
                });

                sizeGroups.forEach((group, size) => {
                    if (group.length > 1) {
                        const duplicateCount = group.length - 1;
                        const wastedSize = size * duplicateCount;
                        
                        duplicateGroups.push({
                            fileName: fileName,
                            type: group[0].type,
                            size: size,
                            instances: group.length,
                            duplicateCount: duplicateCount,
                            wastedSize: wastedSize,
                            urls: group.map(r => r.url),
                            severity: this.calculateSeverity(wastedSize, duplicateCount)
                        });

                        totalDuplicateInstances += duplicateCount;
                        wastedBandwidth += wastedSize;
                    }
                });
            }
        });

        // Sort by wasted size (highest first)
        duplicateGroups.sort((a, b) => b.wastedSize - a.wastedSize);

        // Calculate statistics
        const uniqueResources = resources.length - totalDuplicateInstances;
        const hasDuplicates = duplicateGroups.length > 0;
        const duplicatePercentage = resources.length > 0 
            ? ((totalDuplicateInstances / resources.length) * 100).toFixed(1)
            : 0;
        const wastedPercentage = resources.reduce((sum, r) => sum + r.size, 0) > 0
            ? ((wastedBandwidth / resources.reduce((sum, r) => sum + r.size, 0)) * 100).toFixed(1)
            : 0;

        return {
            hasDuplicates,
            duplicateGroups,
            totalDuplicates: totalDuplicateInstances,
            wastedBandwidth,
            uniqueResources,
            totalResources: resources.length,
            duplicatePercentage,
            wastedPercentage,
            suggestions: this.generateSuggestions(duplicateGroups, wastedBandwidth)
        };
    }

    /**
     * Extracts clean filename from resource name
     * @param {string} name - Resource name
     * @returns {string} - Clean filename
     */
    static extractFileName(name) {
        // Remove query parameters and fragments
        const cleanName = name.split('?')[0].split('#')[0];
        return cleanName;
    }

    /**
     * Calculates severity level based on wasted size and duplicate count
     * @param {number} wastedSize - Size of wasted bandwidth
     * @param {number} duplicateCount - Number of duplicate instances
     * @returns {string} - Severity level: 'high', 'medium', or 'low'
     */
    static calculateSeverity(wastedSize, duplicateCount) {
        const sizeMB = wastedSize / (1024 * 1024);
        
        if (sizeMB > 1 || duplicateCount >= 5) {
            return 'high';
        } else if (sizeMB > 0.1 || duplicateCount >= 3) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * Generates consolidation suggestions based on duplicate analysis
     * @param {Array} duplicateGroups - Array of duplicate groups
     * @param {number} totalWasted - Total wasted bandwidth
     * @returns {Array} - Array of suggestion objects
     */
    static generateSuggestions(duplicateGroups, totalWasted) {
        const suggestions = [];

        if (duplicateGroups.length === 0) {
            return suggestions;
        }

        // High-priority suggestions for large duplicates
        const highSeverityDuplicates = duplicateGroups.filter(g => g.severity === 'high');
        if (highSeverityDuplicates.length > 0) {
            suggestions.push({
                priority: 'high',
                category: 'Resource Consolidation',
                title: 'Critical: Large Resources Loaded Multiple Times',
                description: `${highSeverityDuplicates.length} resource(s) with significant duplication detected. ` +
                           `Wasting ${FormatUtils.formatBytes(highSeverityDuplicates.reduce((sum, g) => sum + g.wastedSize, 0))} in duplicate downloads.`,
                action: 'Ensure each resource is only loaded once. Check for duplicate <script>, <link>, or <img> tags.',
                impact: 'High - Significantly reduces page load time and bandwidth usage',
                resources: highSeverityDuplicates.map(g => g.fileName)
            });
        }

        // Medium-priority suggestions for moderate duplicates
        const mediumSeverityDuplicates = duplicateGroups.filter(g => g.severity === 'medium');
        if (mediumSeverityDuplicates.length > 0) {
            suggestions.push({
                priority: 'medium',
                category: 'Resource Optimization',
                title: 'Moderate Duplicate Resources Detected',
                description: `${mediumSeverityDuplicates.length} resource(s) loaded multiple times, ` +
                           `wasting ${FormatUtils.formatBytes(mediumSeverityDuplicates.reduce((sum, g) => sum + g.wastedSize, 0))}.`,
                action: 'Review your HTML for duplicate resource references. Consider using a bundler to consolidate resources.',
                impact: 'Medium - Improves page load time and reduces bandwidth',
                resources: mediumSeverityDuplicates.map(g => g.fileName)
            });
        }

        // General suggestion if total wasted bandwidth is significant
        if (totalWasted > 100 * 1024) { // > 100KB wasted
            suggestions.push({
                priority: 'medium',
                category: 'Build Process',
                title: 'Implement Resource Deduplication',
                description: `Total of ${FormatUtils.formatBytes(totalWasted)} wasted on duplicate resources.`,
                action: 'Use build tools like Webpack, Rollup, or Parcel to automatically deduplicate and bundle resources. ' +
                       'Implement proper dependency management.',
                impact: 'Medium - Prevents duplicate resource loading through automation',
                resources: []
            });
        }

        // Type-specific suggestions
        const duplicatesByType = this.groupByType(duplicateGroups);
        
        if (duplicatesByType.js && duplicatesByType.js.length > 0) {
            suggestions.push({
                priority: 'medium',
                category: 'JavaScript Optimization',
                title: 'JavaScript Files Loaded Multiple Times',
                description: `${duplicatesByType.js.length} JavaScript file(s) are loaded more than once.`,
                action: 'Consolidate JavaScript dependencies. Use a module bundler to create a single bundle. ' +
                       'Check for duplicate <script> tags in your HTML.',
                impact: 'Medium - Reduces script parsing time and bandwidth',
                resources: duplicatesByType.js.map(g => g.fileName)
            });
        }

        if (duplicatesByType.css && duplicatesByType.css.length > 0) {
            suggestions.push({
                priority: 'medium',
                category: 'CSS Optimization',
                title: 'CSS Files Loaded Multiple Times',
                description: `${duplicatesByType.css.length} CSS file(s) are loaded more than once.`,
                action: 'Combine CSS files into a single stylesheet. Check for duplicate <link> tags. ' +
                       'Consider using CSS preprocessing tools to manage dependencies.',
                impact: 'Medium - Reduces render-blocking CSS and bandwidth',
                resources: duplicatesByType.css.map(g => g.fileName)
            });
        }

        if (duplicatesByType.image && duplicatesByType.image.length > 0) {
            suggestions.push({
                priority: 'low',
                category: 'Image Optimization',
                title: 'Images Loaded Multiple Times',
                description: `${duplicatesByType.image.length} image(s) are referenced multiple times from different URLs.`,
                action: 'Ensure images are loaded from a single, consistent URL. Use browser caching effectively. ' +
                       'Consider using CSS sprites for small, frequently used images.',
                impact: 'Low to Medium - Leverages browser cache and reduces bandwidth',
                resources: duplicatesByType.image.map(g => g.fileName)
            });
        }

        return suggestions;
    }

    /**
     * Groups duplicate groups by resource type
     * @param {Array} duplicateGroups - Array of duplicate groups
     * @returns {Object} - Duplicates grouped by type
     */
    static groupByType(duplicateGroups) {
        const byType = {};
        
        duplicateGroups.forEach(group => {
            const type = group.type;
            const category = this.categorizeType(type);
            
            if (!byType[category]) {
                byType[category] = [];
            }
            byType[category].push(group);
        });

        return byType;
    }

    /**
     * Categorizes resource type into broader categories
     * @param {string} type - Resource type
     * @returns {string} - Category
     */
    static categorizeType(type) {
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif', 'ico', 'bmp'];
        const jsTypes = ['js', 'javascript', 'mjs'];
        const cssTypes = ['css'];

        if (imageTypes.includes(type.toLowerCase())) {
            return 'image';
        } else if (jsTypes.includes(type.toLowerCase())) {
            return 'js';
        } else if (cssTypes.includes(type.toLowerCase())) {
            return 'css';
        } else {
            return 'other';
        }
    }

    /**
     * Generates a summary message for duplicate detection
     * @param {Object} analysis - Duplicate analysis results
     * @returns {string} - Summary message
     */
    static getSummaryMessage(analysis) {
        if (!analysis.hasDuplicates) {
            return '✅ No duplicate resources detected. All resources are loaded only once.';
        }

        const { duplicateGroups, totalDuplicates, wastedBandwidth, duplicatePercentage } = analysis;
        
        return `⚠️ Found ${duplicateGroups.length} resource(s) loaded multiple times (${totalDuplicates} duplicate instances, ` +
               `${duplicatePercentage}% of all resources). Wasting ${FormatUtils.formatBytes(wastedBandwidth)} in duplicate downloads.`;
    }
}
