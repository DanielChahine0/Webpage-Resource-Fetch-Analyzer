// Webpage Resource Fetch Analyzer
// Converts the Java Assignment1 functionality to JavaScript

class ResourceAnalyzer {
    constructor() {
        this.resources = [];
        this.totalSize = 0;
        this.sizeCache = new Map(); // Cache for resource sizes
    }

    /**
     * Normalizes a URL by adding https:// if no protocol is present
     */
    normalizeURL(urlString) {
        let url = urlString.trim();
        
        // Add https:// if no protocol is present
        if (url.startsWith('http://')) {
            url = 'https://' + url.substring(7);
        } else if (!url.includes('://')) {
            url = 'https://' + url;
        }
        
        try {
            return new URL(url);
        } catch (e) {
            throw new Error('Invalid URL format');
        }
    }

    /**
     * Checks if a source is a placeholder
     */
    isPlaceholder(src) {
        if (!src) return true;
        const lower = src.toLowerCase();
        return (
            lower.startsWith('data:') ||
            lower.includes('placeholder') ||
            lower.includes('blank') ||
            lower.includes('space')
        );
    }

    /**
     * Extracts attribute value from an HTML tag
     */
    getAttrValue(tag, attrName) {
        const regex = new RegExp(`${attrName}\\s*=\\s*["']([^"']*)["']`, 'i');
        const match = tag.match(regex);
        if (match) return match[1];
        
        // Try without quotes
        const regexNoQuotes = new RegExp(`${attrName}\\s*=\\s*([^\\s>]+)`, 'i');
        const matchNoQuotes = tag.match(regexNoQuotes);
        return matchNoQuotes ? matchNoQuotes[1] : null;
    }

    /**
     * Resolves a relative URL to absolute
     */
    resolveURL(base, relative) {
        if (!relative || relative.trim() === '') return null;
        
        let trimmed = relative.trim();
        
        // Handle protocol-relative URLs
        if (trimmed.startsWith('//')) {
            trimmed = base.protocol + trimmed;
        }
        
        try {
            const resolved = new URL(trimmed, base);
            if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
                return resolved.href;
            }
        } catch (e) {
            // Invalid URL
        }
        
        return null;
    }

    /**
     * Extracts URLs from CSS content
     */
    extractUrlsFromCSS(css, base, urls) {
        const urlRegex = /url\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/gi;
        let match;
        
        while ((match = urlRegex.exec(css)) !== null) {
            const url = match[1];
            const resolved = this.resolveURL(base, url);
            if (resolved) urls.add(resolved);
        }
    }

    /**
     * Collects all resource URLs from HTML
     */
    collectResourceURLs(html, baseURL) {
        const urls = new Set();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Images
        doc.querySelectorAll('img').forEach(img => {
            let src = img.getAttribute('src') || img.getAttribute('data-src');
            
            if (this.isPlaceholder(src)) {
                src = img.getAttribute('data-src');
            }
            
            // Handle srcset
            if (this.isPlaceholder(src)) {
                const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');
                if (srcset) {
                    srcset.split(',').forEach(candidate => {
                        const url = candidate.trim().split(' ')[0];
                        const resolved = this.resolveURL(baseURL, url);
                        if (resolved) urls.add(resolved);
                    });
                }
            }
            
            const resolved = this.resolveURL(baseURL, src);
            if (resolved) urls.add(resolved);
        });

        // Scripts
        doc.querySelectorAll('script[src]').forEach(script => {
            const resolved = this.resolveURL(baseURL, script.getAttribute('src'));
            if (resolved) urls.add(resolved);
        });

        // Stylesheets and icons
        doc.querySelectorAll('link').forEach(link => {
            const rel = (link.getAttribute('rel') || '').toLowerCase();
            if (rel.includes('stylesheet') || rel.includes('icon')) {
                const resolved = this.resolveURL(baseURL, link.getAttribute('href'));
                if (resolved) urls.add(resolved);
            }
        });

        // Video and Audio
        doc.querySelectorAll('video, audio, source').forEach(media => {
            const src = media.getAttribute('src') || media.getAttribute('data-src');
            const resolved = this.resolveURL(baseURL, src);
            if (resolved) urls.add(resolved);
        });

        // Iframes
        doc.querySelectorAll('iframe[src]').forEach(iframe => {
            const resolved = this.resolveURL(baseURL, iframe.getAttribute('src'));
            if (resolved) urls.add(resolved);
        });

        // Embed and Object
        doc.querySelectorAll('embed[src]').forEach(embed => {
            const resolved = this.resolveURL(baseURL, embed.getAttribute('src'));
            if (resolved) urls.add(resolved);
        });

        doc.querySelectorAll('object[data]').forEach(obj => {
            const resolved = this.resolveURL(baseURL, obj.getAttribute('data'));
            if (resolved) urls.add(resolved);
        });

        // Extract from style tags
        doc.querySelectorAll('style').forEach(style => {
            this.extractUrlsFromCSS(style.textContent, baseURL, urls);
        });

        // Extract from inline styles
        doc.querySelectorAll('[style]').forEach(elem => {
            this.extractUrlsFromCSS(elem.getAttribute('style'), baseURL, urls);
        });

        return Array.from(urls);
    }

    /**
     * Gets file name from URL
     */
    getFileName(urlString) {
        const url = new URL(urlString);
        const path = url.pathname;
        
        if (!path || path === '/' || path === '') {
            return url.hostname + '.html';
        }
        
        const lastSlash = path.lastIndexOf('/');
        let fileName = lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
        
        if (!fileName) {
            fileName = 'index.html';
        }
        
        return fileName;
    }

    /**
     * Determines file type from URL
     */
    getFileType(urlString) {
        const fileName = this.getFileName(urlString).toLowerCase();
        
        if (fileName.endsWith('.html') || fileName.endsWith('.htm')) return 'html';
        if (fileName.endsWith('.css')) return 'css';
        if (fileName.endsWith('.js')) return 'js';
        if (fileName.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|bmp)$/)) return 'image';
        if (fileName.match(/\.(mp4|webm|ogg|avi|mov)$/)) return 'video';
        if (fileName.match(/\.(mp3|wav|ogg|m4a)$/)) return 'audio';
        if (fileName.match(/\.(woff|woff2|ttf|eot|otf)$/)) return 'font';
        
        return 'other';
    }

    /**
     * Formats bytes to human-readable format
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Fetches HTML content using CORS proxy
     */
    async fetchHTML(url) {
        // Use a CORS proxy to fetch content
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        return { html, size: new Blob([html]).size };
    }

    /**
     * Fetches resource size with timeout and caching
     */
    async fetchResourceSize(url, timeout = 10000) {
        // Check cache first
        if (this.sizeCache.has(url)) {
            return this.sizeCache.get(url);
        }
        
        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(proxyUrl + encodeURIComponent(url), { 
                method: 'GET',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const blob = await response.blob();
                const size = blob.size;
                
                // Cache the result
                this.sizeCache.set(url, size);
                return size;
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                console.warn(`Timeout fetching ${url}`);
            } else {
                console.warn(`Failed to fetch ${url}:`, e.message);
            }
        }
        
        // Cache failed fetches as 0 to avoid retrying
        this.sizeCache.set(url, 0);
        return 0;
    }

    /**
     * Fetches multiple resources in parallel with concurrency limit
     */
    async fetchResourcesBatch(urls, concurrency = 10) {
        const results = [];
        const executing = [];
        
        for (const url of urls) {
            const promise = this.fetchResourceSize(url).then(size => ({
                url,
                size,
                name: this.getFileName(url),
                type: this.getFileType(url)
            }));
            
            results.push(promise);
            
            if (concurrency <= urls.length) {
                const executingPromise = promise.then(() => {
                    executing.splice(executing.indexOf(executingPromise), 1);
                });
                executing.push(executingPromise);
                
                if (executing.length >= concurrency) {
                    await Promise.race(executing);
                }
            }
        }
        
        return await Promise.all(results);
    }

    /**
     * Main analysis function with dynamic updates and parallel fetching
     */
    async analyze(urlString, progressCallback, resourceCallback) {
        this.resources = [];
        this.totalSize = 0;

        // Normalize URL
        const baseURL = this.normalizeURL(urlString);
        
        // Fetch main HTML
        progressCallback('Fetching main HTML page...', 0, 1);
        const { html, size: htmlSize } = await this.fetchHTML(baseURL.href);
        
        const mainResource = {
            name: this.getFileName(baseURL.href),
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
        const resourceURLs = this.collectResourceURLs(html, baseURL);
        
        const totalURLs = resourceURLs.length;
        progressCallback(`Found ${totalURLs} resources. Starting parallel download...`, 1, totalURLs + 1);
        
        // Fetch resources in parallel batches
        let processedURLs = 0; // Track how many URLs we've processed
        let successfulResources = 1; // Track successfully added resources (start at 1 for HTML)
        const batchSize = 10; // Process 10 at a time
        
        for (let i = 0; i < resourceURLs.length; i += batchSize) {
            const batch = resourceURLs.slice(i, i + batchSize);
            const batchResults = await this.fetchResourcesBatch(batch, batchSize);
            
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
                    // Show: current successful resource / processed URLs (of total URLs)
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
     * Clears the size cache
     */
    clearCache() {
        this.sizeCache.clear();
    }

    /**
     * Calculates performance score (0-100) based on multiple metrics
     * Similar to Google Lighthouse scoring
     */
    calculatePerformanceScore(results) {
        const scores = {
            pageSize: 0,
            requestCount: 0,
            resourceDistribution: 0,
            compression: 0
        };

        // 1. Page Size Score (30% weight)
        // Excellent: < 500 KB, Good: < 1 MB, Fair: < 2 MB, Poor: > 2 MB
        const totalSizeMB = results.totalSize / (1024 * 1024);
        if (totalSizeMB < 0.5) {
            scores.pageSize = 100;
        } else if (totalSizeMB < 1) {
            scores.pageSize = 90 - ((totalSizeMB - 0.5) / 0.5) * 15; // 90-75
        } else if (totalSizeMB < 2) {
            scores.pageSize = 75 - ((totalSizeMB - 1) / 1) * 25; // 75-50
        } else if (totalSizeMB < 5) {
            scores.pageSize = 50 - ((totalSizeMB - 2) / 3) * 30; // 50-20
        } else {
            scores.pageSize = Math.max(0, 20 - ((totalSizeMB - 5) / 5) * 20); // 20-0
        }

        // 2. Request Count Score (25% weight)
        // Excellent: < 25, Good: < 50, Fair: < 100, Poor: > 100
        const requestCount = results.totalFiles;
        if (requestCount < 25) {
            scores.requestCount = 100;
        } else if (requestCount < 50) {
            scores.requestCount = 90 - ((requestCount - 25) / 25) * 15; // 90-75
        } else if (requestCount < 100) {
            scores.requestCount = 75 - ((requestCount - 50) / 50) * 35; // 75-40
        } else if (requestCount < 150) {
            scores.requestCount = 40 - ((requestCount - 100) / 50) * 20; // 40-20
        } else {
            scores.requestCount = Math.max(0, 20 - ((requestCount - 150) / 50) * 20); // 20-0
        }

        // 3. Resource Distribution Score (25% weight)
        // Checks for balanced distribution and optimal resource types
        const typeCount = {};
        let totalResourceSize = 0;
        
        results.resources.forEach(resource => {
            if (!typeCount[resource.type]) {
                typeCount[resource.type] = { count: 0, size: 0 };
            }
            typeCount[resource.type].count++;
            typeCount[resource.type].size += resource.size;
            totalResourceSize += resource.size;
        });

        // Calculate distribution penalties
        let distributionScore = 100;
        
        // Check for excessive images
        if (typeCount.image) {
            const imageRatio = typeCount.image.size / totalResourceSize;
            if (imageRatio > 0.7) {
                distributionScore -= 30; // Heavy penalty for image-heavy pages
            } else if (imageRatio > 0.5) {
                distributionScore -= 15;
            }
        }

        // Check for excessive JavaScript
        if (typeCount.js) {
            const jsRatio = typeCount.js.size / totalResourceSize;
            if (jsRatio > 0.5) {
                distributionScore -= 25;
            } else if (jsRatio > 0.3) {
                distributionScore -= 10;
            }
        }

        // Reward for having CSS (up to a point)
        if (typeCount.css) {
            const cssRatio = typeCount.css.size / totalResourceSize;
            if (cssRatio > 0.3) {
                distributionScore -= 15; // Too much CSS
            }
        }

        // Check for large individual files
        const largeFiles = results.resources.filter(r => r.size > 500 * 1024); // > 500KB
        if (largeFiles.length > 0) {
            distributionScore -= Math.min(20, largeFiles.length * 5);
        }

        scores.resourceDistribution = Math.max(0, distributionScore);

        // 4. Compression/Optimization Score (20% weight)
        // Estimate compression based on file sizes
        let compressionScore = 100;
        
        // Check average file size
        const avgFileSize = totalResourceSize / results.totalFiles;
        if (avgFileSize > 200 * 1024) { // Avg > 200KB suggests poor compression
            compressionScore -= 30;
        } else if (avgFileSize > 100 * 1024) { // Avg > 100KB
            compressionScore -= 15;
        }

        // Check for unoptimized images (rough estimate)
        if (typeCount.image) {
            const avgImageSize = typeCount.image.size / typeCount.image.count;
            if (avgImageSize > 500 * 1024) { // Avg image > 500KB
                compressionScore -= 25;
            } else if (avgImageSize > 200 * 1024) { // Avg image > 200KB
                compressionScore -= 10;
            }
        }

        scores.compression = Math.max(0, compressionScore);

        // Calculate weighted total score
        const weights = {
            pageSize: 0.30,
            requestCount: 0.25,
            resourceDistribution: 0.25,
            compression: 0.20
        };

        const totalScore = Math.round(
            scores.pageSize * weights.pageSize +
            scores.requestCount * weights.requestCount +
            scores.resourceDistribution * weights.resourceDistribution +
            scores.compression * weights.compression
        );

        return {
            totalScore: Math.max(0, Math.min(100, totalScore)),
            breakdown: {
                pageSize: Math.round(scores.pageSize),
                requestCount: Math.round(scores.requestCount),
                resourceDistribution: Math.round(scores.resourceDistribution),
                compression: Math.round(scores.compression)
            },
            metrics: {
                totalSizeMB: totalSizeMB.toFixed(2),
                requestCount: requestCount,
                typeDistribution: typeCount,
                largeFileCount: results.resources.filter(r => r.size > 500 * 1024).length
            }
        };
    }
}

// UI Controller
class UIController {
    constructor() {
        this.analyzer = new ResourceAnalyzer();
        this.results = null;
        this.startTime = null;
        this.itemsProcessed = 0;
        this.totalItems = 0;
        this.initEventListeners();
    }

    initEventListeners() {
        const form = document.getElementById('analyzerForm');
        const exportBtn = document.getElementById('exportBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAnalyze();
        });

        exportBtn.addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    showLoader(show) {
        const btn = document.getElementById('analyzeBtn');
        const btnText = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.loader');

        btn.disabled = show;
        btnText.style.display = show ? 'none' : 'inline';
        loader.style.display = show ? 'inline-block' : 'none';
    }

    showError(message) {
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');
        const resultsSection = document.getElementById('resultsSection');

        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        resultsSection.style.display = 'none';
    }

    hideError() {
        const errorSection = document.getElementById('errorSection');
        errorSection.style.display = 'none';
    }

    showProgress(show) {
        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = show ? 'block' : 'none';
        
        if (!show) {
            // Reset progress bar
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = '0%';
        } else {
            // Reset timer when showing progress
            this.startTime = Date.now();
            this.itemsProcessed = 0;
        }
    }

    formatTime(seconds) {
        if (seconds < 1) {
            return 'Less than a second';
        } else if (seconds < 60) {
            return `${Math.round(seconds)} second${seconds !== 1 ? 's' : ''}`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.round(seconds % 60);
            if (remainingSeconds === 0) {
                return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
            return `${minutes} min ${remainingSeconds} sec`;
        }
    }

    updateProgress(message, current, total) {
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
            
            timeEstimate.textContent = this.formatTime(estimatedTimeRemaining);
        } else if (current >= total) {
            timeEstimate.textContent = 'Complete!';
        } else {
            timeEstimate.textContent = 'Calculating...';
        }
    }

    addResourceToTable(resource, index) {
        const tbody = document.getElementById('resourcesBody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index}</td>
            <td><strong>${resource.name}</strong></td>
            <td><span class="file-type type-${resource.type}">${resource.type.toUpperCase()}</span></td>
            <td>${this.analyzer.formatBytes(resource.size)}</td>
            <td class="url-cell" title="${resource.url}">${resource.url}</td>
        `;
        tbody.appendChild(row);
        
        // Auto-scroll to show new items
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    updateStats(fileCount, totalSize, mainHtmlSize) {
        document.getElementById('totalFiles').textContent = fileCount;
        document.getElementById('totalSize').textContent = this.analyzer.formatBytes(totalSize);
        if (mainHtmlSize !== undefined) {
            document.getElementById('mainHtmlSize').textContent = this.analyzer.formatBytes(mainHtmlSize);
        }
    }

    displayPerformanceScore(performanceData) {
        const scoreContainer = document.getElementById('performanceScoreCard');
        if (!scoreContainer) return;

        const score = performanceData.totalScore;
        const breakdown = performanceData.breakdown;

        // Determine score category and color
        let category, colorClass;
        if (score >= 90) {
            category = 'Excellent';
            colorClass = 'score-excellent';
        } else if (score >= 75) {
            category = 'Good';
            colorClass = 'score-good';
        } else if (score >= 50) {
            category = 'Fair';
            colorClass = 'score-fair';
        } else {
            category = 'Poor';
            colorClass = 'score-poor';
        }

        // Update the score display
        scoreContainer.innerHTML = `
            <div class="performance-header">
                <h3>⚡ Performance Score</h3>
                <button class="info-btn" id="scoreInfoBtn" title="View detailed breakdown">ℹ️</button>
            </div>
            <div class="score-circle ${colorClass}">
                <div class="score-value">${score}</div>
                <div class="score-category">${category}</div>
            </div>
            <div class="score-breakdown" id="scoreBreakdown" style="display: none;">
                <h4>Score Breakdown:</h4>
                <div class="breakdown-item">
                    <span class="breakdown-label">📦 Page Size (30%)</span>
                    <span class="breakdown-value">${breakdown.pageSize}/100</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">🔢 Request Count (25%)</span>
                    <span class="breakdown-value">${breakdown.requestCount}/100</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">📊 Resource Distribution (25%)</span>
                    <span class="breakdown-value">${breakdown.resourceDistribution}/100</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">🗜️ Compression/Optimization (20%)</span>
                    <span class="breakdown-value">${breakdown.compression}/100</span>
                </div>
                <div class="metrics-info">
                    <p><strong>Metrics:</strong></p>
                    <p>Total Size: ${performanceData.metrics.totalSizeMB} MB</p>
                    <p>Total Requests: ${performanceData.metrics.requestCount}</p>
                    <p>Large Files (&gt;500KB): ${performanceData.metrics.largeFileCount}</p>
                </div>
            </div>
        `;

        // Add event listener for info button
        const infoBtn = document.getElementById('scoreInfoBtn');
        if (infoBtn) {
            infoBtn.addEventListener('click', () => {
                const breakdown = document.getElementById('scoreBreakdown');
                if (breakdown.style.display === 'none') {
                    breakdown.style.display = 'block';
                } else {
                    breakdown.style.display = 'none';
                }
            });
        }
    }

    displayResults(results) {
        this.results = results;
        this.hideError();

        // Calculate and display performance score
        const performanceData = this.analyzer.calculatePerformanceScore(results);
        this.displayPerformanceScore(performanceData);

        // Update stats cards
        this.updateStats(results.totalFiles, results.totalSize, results.mainHtmlSize);

        // Show results section if not already visible
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection.style.display === 'none') {
            resultsSection.style.display = 'block';
        }
    }

    async handleAnalyze() {
        const urlInput = document.getElementById('urlInput').value.trim();

        if (!urlInput) {
            this.showError('Please enter a URL');
            return;
        }

        // Clear cache for fresh analysis (optional - comment out to keep cache between analyses)
        this.analyzer.clearCache();

        this.showLoader(true);
        this.hideError();
        this.showProgress(true);
        
        // Clear previous results
        const tbody = document.getElementById('resourcesBody');
        tbody.innerHTML = '';
        
        // Show results section immediately
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        
        let mainHtmlSize = 0;

        try {
            const results = await this.analyzer.analyze(
                urlInput,
                // Progress callback
                (message, current, total) => {
                    this.updateProgress(message, current, total);
                },
                // Resource callback - called immediately when each resource is fetched
                // successfulIndex is the number of this successful resource (1, 2, 3...)
                (resource, successfulIndex, total, totalSize) => {
                    this.addResourceToTable(resource, successfulIndex);
                    
                    if (resource.type === 'html') {
                        mainHtmlSize = resource.size;
                    }
                    
                    this.updateStats(successfulIndex, totalSize, mainHtmlSize);
                }
            );
            
            // Store results and display performance score
            this.results = results;
            this.displayPerformanceScore(this.analyzer.calculatePerformanceScore(results));
            this.showProgress(false);
        } catch (error) {
            this.showError(`Error: ${error.message}`);
            this.showProgress(false);
            resultsSection.style.display = 'none';
        } finally {
            this.showLoader(false);
        }
    }

    exportToCSV() {
        if (!this.results) return;

        let csv = 'File Name,Type,Size (Bytes),Size (Formatted),URL\n';

        this.results.resources.forEach(resource => {
            csv += `"${resource.name}","${resource.type}",${resource.size},"${this.analyzer.formatBytes(resource.size)}","${resource.url}"\n`;
        });

        csv += `\nTotal Files,${this.results.totalFiles}\n`;
        csv += `Total Size,${this.results.totalSize},"${this.analyzer.formatBytes(this.results.totalSize)}"\n`;

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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});
