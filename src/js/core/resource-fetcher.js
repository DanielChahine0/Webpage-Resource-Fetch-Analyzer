/**
 * Resource Fetcher
 * Handles fetching resources with caching and parallel processing
 */

import { URLUtils } from '../utils/url-utils.js';
import { logger } from '../utils/logger.js';

export class ResourceFetcher {
    constructor() {
        this.sizeCache = new Map();
        // Multiple proxy fallback options
        this.proxies = [
            {
                name: 'CORS Proxy',
                url: 'https://corsproxy.io/?',
                format: (url) => this.proxies[0].url + encodeURIComponent(url)
            },
            {
                name: 'CORS.SH',
                url: 'https://cors.sh/',
                format: (url) => this.proxies[1].url + url
            },
            {
                name: 'AllOrigins GET',
                url: 'https://api.allorigins.win/get?url=',
                format: (url) => this.proxies[2].url + encodeURIComponent(url),
                parseResponse: async (response) => {
                    const data = await response.json();
                    return data.contents;
                }
            },
            {
                name: 'AllOrigins RAW',
                url: 'https://api.allorigins.win/raw?url=',
                format: (url) => this.proxies[3].url + encodeURIComponent(url)
            },
            {
                name: 'Proxy.CORS.SH',
                url: 'https://proxy.cors.sh/',
                format: (url) => this.proxies[4].url + url
            },
            {
                name: 'API CORS Proxy',
                url: 'https://api.codetabs.com/v1/proxy?quest=',
                format: (url) => this.proxies[5].url + encodeURIComponent(url)
            },
            {
                name: 'ThingProxy',
                url: 'https://thingproxy.freeboard.io/fetch/',
                format: (url) => this.proxies[6].url + encodeURIComponent(url)
            },
            {
                name: 'CORS Anywhere',
                url: 'https://cors-anywhere.herokuapp.com/',
                format: (url) => this.proxies[7].url + url,
                needsRequest: true // Requires user to request access first
            }
        ];
        this.currentProxyIndex = 0; // Start with CORS Proxy (most reliable)
        this.lastRequestTime = 0;
        this.minRequestDelay = 100; // Minimum delay between requests in ms
    }

    /**
     * Delay to prevent rate limiting
     */
    async addDelay(ms = this.minRequestDelay) {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < ms) {
            const delayNeeded = ms - timeSinceLastRequest;
            logger.log(`[RATELIMIT] Rate limiting: waiting ${delayNeeded}ms before next request`);
            await new Promise(resolve => setTimeout(resolve, delayNeeded));
        }
        
        this.lastRequestTime = Date.now();
    }

    /**
     * Fetches HTML content using CORS proxy with automatic fallback
     */
    async fetchHTML(url) {
        logger.log(`[FETCH] Fetching main HTML from: ${url}`);
        
        const errors = [];
        
        // Try each proxy until one works
        for (let i = 0; i < this.proxies.length; i++) {
            const proxyIndex = (this.currentProxyIndex + i) % this.proxies.length;
            const proxy = this.proxies[proxyIndex];
            
            try {
                logger.log(`Trying ${proxy.name}...`);
                await this.addDelay(200); // Longer delay for HTML fetch
                
                const proxyUrl = proxy.format(url);
                
                // Add timeout for fetch request
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
                
                const response = await fetch(proxyUrl, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const errorMsg = `${response.status} ${response.statusText}`;
                    logger.warn(`${proxy.name} failed: ${errorMsg}`);
                    errors.push(`${proxy.name}: ${errorMsg}`);
                    continue;
                }
                
                // Parse response based on proxy type
                let html;
                if (proxy.parseResponse) {
                    html = await proxy.parseResponse(response);
                } else {
                    html = await response.text();
                }
                
                const size = new Blob([html]).size;
                logger.log(`HTML fetched successfully using ${proxy.name} (${(size / 1024).toFixed(2)} KB)`);
                
                // Remember successful proxy for next time
                this.currentProxyIndex = proxyIndex;
                
                return { html, size };
            } catch (error) {
                const errorMsg = error.name === 'AbortError' ? 'Timeout (15s)' : error.message;
                logger.warn(`${proxy.name} error: ${errorMsg}`);
                errors.push(`${proxy.name}: ${errorMsg}`);
                
                // Special handling for CORS Anywhere
                if (proxy.needsRequest && error.message.includes('403')) {
                    logger.warn(`CORS Anywhere requires manual access request at: ${proxy.url}`);
                }
            }
        }
        
        // All proxies failed - provide detailed error
        const errorDetails = errors.slice(0, 3).join('\n• ');
        throw new Error(
            `All proxy services failed. This could be due to:\n\n` +
            `• The website blocking proxy requests\n` +
            `• Temporary proxy service outages\n` +
            `• Network connectivity issues\n\n` +
            `Recent errors:\n• ${errorDetails}\n\n` +
            `Try a different URL or wait a few minutes and try again.`
        );
    }

    /**
     * Try direct fetch first, fallback to proxy
     */
    async tryDirectFetch(url, timeout = 5000) {
        try {
            logger.log(`Attempting direct fetch: ${url}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(url, { 
                method: 'HEAD', // Use HEAD to just get size
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    const size = parseInt(contentLength, 10);
                    logger.log(`Direct fetch successful: ${(size / 1024).toFixed(2)} KB`);
                    return size;
                }
                logger.log(`Direct fetch OK but no content-length header`);
            } else {
                logger.log(`Direct fetch failed: ${response.status}`);
            }
        } catch (e) {
            logger.log(`Direct fetch error: ${e.message} - will try proxy`);
        }
        return null;
    }

    /**
     * Fetches resource size with timeout, caching, and retry logic
     */
    async fetchResourceSize(url, timeout = 10000, retries = 2) {
        // Check cache first
        if (this.sizeCache.has(url)) {
            const cachedSize = this.sizeCache.get(url);
            logger.log(`Cache hit for: ${url.substring(0, 60)}... (${(cachedSize / 1024).toFixed(2)} KB)`);
            return cachedSize;
        }
        
        logger.log(`Fetching: ${url.substring(0, 80)}...`);
        
        // Try direct fetch first (no rate limits)
        const directSize = await this.tryDirectFetch(url);
        if (directSize !== null) {
            this.sizeCache.set(url, directSize);
            return directSize;
        }
        
        // Fallback to proxy with rate limiting and retries
        logger.log(`Falling back to proxy for: ${url.substring(0, 60)}...`);
        for (let attempt = 0; attempt <= retries; attempt++) {
            // Try current working proxy
            const proxy = this.proxies[this.currentProxyIndex];
            
            try {
                // Add delay before each proxy request
                await this.addDelay();
                
                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                
                const proxyUrl = proxy.format(url);
                const response = await fetch(proxyUrl, { 
                    method: 'GET',
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    let size;
                    
                    // Parse response based on proxy type
                    if (proxy.parseResponse) {
                        const content = await proxy.parseResponse(response);
                        size = new Blob([content]).size;
                    } else {
                        const blob = await response.blob();
                        size = blob.size;
                    }
                    
                    logger.log(`Proxy fetch successful using ${proxy.name}: ${(size / 1024).toFixed(2)} KB`);
                    
                    // Cache the result
                    this.sizeCache.set(url, size);
                    return size;
                } else if (response.status === 429 && attempt < retries) {
                    // Rate limited - wait longer before retry
                    const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
                    logger.warn(`Rate limited for ${url.substring(0, 60)}..., retrying in ${backoffDelay}ms... (attempt ${attempt + 1}/${retries + 1})`);
                    await new Promise(resolve => setTimeout(resolve, backoffDelay));
                    continue;
                } else {
                    logger.warn(`${proxy.name} returned status ${response.status} for ${url.substring(0, 60)}...`);
                    
                    // Try next proxy on failure
                    if (attempt < retries) {
                        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
                        logger.log(`Switching to ${this.proxies[this.currentProxyIndex].name}`);
                    }
                }
            } catch (e) {
                if (e.name === 'AbortError') {
                    logger.warn(`Timeout fetching ${url.substring(0, 60)}...`);
                } else if (attempt < retries) {
                    logger.warn(`Failed to fetch ${url.substring(0, 60)}... (attempt ${attempt + 1}/${retries + 1}):`, e.message);
                    await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
                    continue;
                } else {
                    logger.warn(`Failed to fetch ${url.substring(0, 60)}...:`, e.message);
                }
            }
        }
        
        // Cache failed fetches as 0 to avoid retrying
        logger.log(`💀 Caching failed fetch as 0 for: ${url.substring(0, 60)}...`);
        this.sizeCache.set(url, 0);
        return 0;
    }

    /**
     * Fetches multiple resources in parallel with concurrency limit
     */
    async fetchResourcesBatch(urls, concurrency = 3) {
        logger.log(`Processing batch of ${urls.length} resources with concurrency ${concurrency}`);
        const results = [];
        const executing = [];
        
        for (const url of urls) {
            const promise = this.fetchResourceSize(url).then(size => ({
                url,
                size,
                name: URLUtils.getFileName(url),
                type: URLUtils.getFileType(url)
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
        
        const batchResults = await Promise.all(results);
        const successCount = batchResults.filter(r => r.size > 0).length;
        logger.log(`Batch complete: ${successCount}/${urls.length} resources fetched successfully`);
        return batchResults;
    }

    /**
     * Clears the size cache
     */
    clearCache() {
        const cacheSize = this.sizeCache.size;
        this.sizeCache.clear();
        console.log(`Cache cleared (removed ${cacheSize} entries)`);
    }

    /**
     * Get current proxy information
     */
    getCurrentProxy() {
        const proxy = this.proxies[this.currentProxyIndex];
        return {
            name: proxy.name,
            index: this.currentProxyIndex,
            totalProxies: this.proxies.length
        };
    }

    /**
     * Manually switch to next proxy
     */
    switchProxy() {
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
        const proxy = this.proxies[this.currentProxyIndex];
        logger.log(`Switched to ${proxy.name}`);
        return proxy.name;
    }
}
