/**
 * Resource Analyzer
 * Main class that orchestrates resource analysis
 */

import { URLUtils } from '../utils/url-utils.js';
import { FormatUtils } from '../utils/format-utils.js';
import { ResourceParser } from './resource-parser.js';
import { ResourceFetcher } from './resource-fetcher.js';
import { PerformanceScorer } from './performance-scorer.js';

export class ResourceAnalyzer {
    constructor() {
        this.resources = [];
        this.totalSize = 0;
        this.fetcher = new ResourceFetcher();
    }

    /**
     * Main analysis function with dynamic updates and parallel fetching
     */
    async analyze(urlString, progressCallback, resourceCallback) {
        this.resources = [];
        this.totalSize = 0;

        // Normalize URL
        const baseURL = URLUtils.normalizeURL(urlString);
        
        // Fetch main HTML
        progressCallback('Fetching main HTML page...', 0, 1);
        const { html, size: htmlSize } = await this.fetcher.fetchHTML(baseURL.href);
        
        const mainResource = {
            name: URLUtils.getFileName(baseURL.href),
            type: 'html',
            size: htmlSize,
            url: baseURL.href
        };
        
        this.resources.push(mainResource);
        this.totalSize = htmlSize;
        
        // Immediately show the HTML file
        resourceCallback(mainResource, 1, 1, htmlSize);

        // Collect resource URLs
        progressCallback('Parsing HTML and collecting resources...', 1, 1);
        const resourceURLs = ResourceParser.collectResourceURLs(html, baseURL);
        
        const totalURLs = resourceURLs.length;
        progressCallback(`Found ${totalURLs} resources. Starting parallel download...`, 1, totalURLs + 1);
        
        // Fetch resources in parallel batches
        let processedURLs = 0;
        let successfulResources = 1; // Start at 1 for HTML
        const batchSize = 5; // Reduced batch size to avoid rate limiting
        
        for (let i = 0; i < resourceURLs.length; i += batchSize) {
            const batch = resourceURLs.slice(i, i + batchSize);
            const batchResults = await this.fetcher.fetchResourcesBatch(batch, 3); // Max 3 concurrent requests
            
            // Process results from this batch
            for (const result of batchResults) {
                processedURLs++;
                
                if (result.size > 0) {
                    const resource = {
                        name: result.name,
                        type: result.type,
                        size: result.size,
                        url: result.url
                    };
                    
                    this.resources.push(resource);
                    this.totalSize += result.size;
                    successfulResources++;
                    
                    // Update UI immediately with this resource
                    progressCallback(`Fetching resources... (${processedURLs}/${totalURLs} checked)`, processedURLs + 1, totalURLs + 1);
                    resourceCallback(resource, successfulResources, totalURLs + 1, this.totalSize);
                } else {
                    // Still update progress even if resource failed
                    progressCallback(`Fetching resources... (${processedURLs}/${totalURLs} checked)`, processedURLs + 1, totalURLs + 1);
                }
            }
        }

        return {
            resources: this.resources,
            totalSize: this.totalSize,
            totalFiles: this.resources.length,
            mainHtmlSize: htmlSize
        };
    }

    /**
     * Formats bytes to human-readable format
     */
    formatBytes(bytes) {
        return FormatUtils.formatBytes(bytes);
    }

    /**
     * Clears the resource cache
     */
    clearCache() {
        this.fetcher.clearCache();
    }

    /**
     * Calculates performance score
     */
    calculatePerformanceScore(results) {
        return PerformanceScorer.calculatePerformanceScore(results);
    }
}
