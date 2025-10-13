// Webpage Resource Fetch Analyzer
// Converts the Java Assignment1 functionality to JavaScript

class ResourceAnalyzer {
    constructor() {
        this.resources = [];
        this.totalSize = 0;
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
     * Fetches resource size
     */
    async fetchResourceSize(url) {
        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(proxyUrl + encodeURIComponent(url), { method: 'GET' });
            
            if (response.ok) {
                const blob = await response.blob();
                return blob.size;
            }
        } catch (e) {
            console.warn(`Failed to fetch ${url}:`, e.message);
        }
        
        return 0;
    }

    /**
     * Main analysis function with dynamic updates
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
        
        const total = resourceURLs.length;
        progressCallback(`Found ${total} resources. Starting download...`, 1, total + 1);
        
        // Fetch sizes for each resource - show results immediately
        let processed = 1; // Start at 1 because we already have HTML
        
        for (const resourceURL of resourceURLs) {
            const size = await this.fetchResourceSize(resourceURL);
            
            if (size > 0) {
                const resource = {
                    name: this.getFileName(resourceURL),
                    type: this.getFileType(resourceURL),
                    size: size,
                    url: resourceURL
                };
                
                this.resources.push(resource);
                this.totalSize += size;
                
                // Update UI immediately with this resource
                processed++;
                progressCallback(`Fetching resources...`, processed, total + 1);
                resourceCallback(resource, processed, total + 1, this.totalSize);
            } else {
                processed++;
                progressCallback(`Fetching resources...`, processed, total + 1);
            }
        }

        return {
            resources: this.resources,
            totalSize: this.totalSize,
            totalFiles: this.resources.length,
            mainHtmlSize: htmlSize
        };
    }
}

// UI Controller
class UIController {
    constructor() {
        this.analyzer = new ResourceAnalyzer();
        this.results = null;
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
        }
    }

    updateProgress(message, current, total) {
        const progressStatus = document.getElementById('progressStatus');
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        
        progressStatus.textContent = message;
        progressText.textContent = `${current} / ${total}`;
        
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressBar.style.width = percentage + '%';
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

    displayResults(results) {
        this.results = results;
        this.hideError();

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
        let resourceIndex = 0;

        try {
            const results = await this.analyzer.analyze(
                urlInput,
                // Progress callback
                (message, current, total) => {
                    this.updateProgress(message, current, total);
                },
                // Resource callback - called immediately when each resource is fetched
                (resource, current, total, totalSize) => {
                    resourceIndex++;
                    this.addResourceToTable(resource, resourceIndex);
                    
                    if (resource.type === 'html') {
                        mainHtmlSize = resource.size;
                    }
                    
                    this.updateStats(resourceIndex, totalSize, mainHtmlSize);
                }
            );
            
            this.results = results;
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
