/**
 * Resource Fetcher
 * Handles fetching resources with caching and parallel processing
 */

import { URLUtils } from '../utils/url-utils.js';

export class ResourceFetcher {
    constructor() {
        this.sizeCache = new Map();
        this.proxyUrl = 'https://api.allorigins.win/raw?url=';
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
            console.log(`⏳ Rate limiting: waiting ${delayNeeded}ms before next request`);
            await new Promise(resolve => setTimeout(resolve, delayNeeded));
        }
        
        this.lastRequestTime = Date.now();
    }

    /**
     * Fetches HTML content using CORS proxy
     */
    async fetchHTML(url) {
        console.log(`🌐 Fetching main HTML from: ${url}`);
        await this.addDelay(200); // Longer delay for HTML fetch
        const response = await fetch(this.proxyUrl + encodeURIComponent(url));
        
        if (!response.ok) {
            console.error(`❌ Failed to fetch HTML: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        const size = new Blob([html]).size;
        console.log(`✅ HTML fetched successfully (${(size / 1024).toFixed(2)} KB)`);
        return { html, size };
    }

    /**
     * Try direct fetch first, fallback to proxy
     */
    async tryDirectFetch(url, timeout = 5000) {
        try {
            console.log(`🎯 Attempting direct fetch: ${url}`);
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
                    console.log(`✅ Direct fetch successful: ${(size / 1024).toFixed(2)} KB`);
                    return size;
                }
                console.log(`⚠️ Direct fetch OK but no content-length header`);
            } else {
                console.log(`⚠️ Direct fetch failed: ${response.status}`);
            }
        } catch (e) {
            console.log(`⚠️ Direct fetch error: ${e.message} - will try proxy`);
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
            console.log(`💾 Cache hit for: ${url.substring(0, 60)}... (${(cachedSize / 1024).toFixed(2)} KB)`);
            return cachedSize;
        }
        
        console.log(`📥 Fetching: ${url.substring(0, 80)}...`);
        
        // Try direct fetch first (no rate limits)
        const directSize = await this.tryDirectFetch(url);
        if (directSize !== null) {
            this.sizeCache.set(url, directSize);
            return directSize;
        }
        
        // Fallback to proxy with rate limiting and retries
        console.log(`🔄 Falling back to proxy for: ${url.substring(0, 60)}...`);
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                // Add delay before each proxy request
                await this.addDelay();
                
                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                
                const response = await fetch(this.proxyUrl + encodeURIComponent(url), { 
                    method: 'GET',
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const blob = await response.blob();
                    const size = blob.size;
                    console.log(`✅ Proxy fetch successful: ${(size / 1024).toFixed(2)} KB`);
                    
                    // Cache the result
                    this.sizeCache.set(url, size);
                    return size;
                } else if (response.status === 429 && attempt < retries) {
                    // Rate limited - wait longer before retry
                    const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
                    console.warn(`⚠️ Rate limited for ${url.substring(0, 60)}..., retrying in ${backoffDelay}ms... (attempt ${attempt + 1}/${retries + 1})`);
                    await new Promise(resolve => setTimeout(resolve, backoffDelay));
                    continue;
                } else {
                    console.warn(`⚠️ Proxy returned status ${response.status} for ${url.substring(0, 60)}...`);
                }
            } catch (e) {
                if (e.name === 'AbortError') {
                    console.warn(`⏱️ Timeout fetching ${url.substring(0, 60)}...`);
                } else if (attempt < retries) {
                    console.warn(`⚠️ Failed to fetch ${url.substring(0, 60)}... (attempt ${attempt + 1}/${retries + 1}):`, e.message);
                    await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
                    continue;
                } else {
                    console.warn(`❌ Failed to fetch ${url.substring(0, 60)}...:`, e.message);
                }
            }
        }
        
        // Cache failed fetches as 0 to avoid retrying
        console.log(`💀 Caching failed fetch as 0 for: ${url.substring(0, 60)}...`);
        this.sizeCache.set(url, 0);
        return 0;
    }

    /**
     * Fetches multiple resources in parallel with concurrency limit
     */
    async fetchResourcesBatch(urls, concurrency = 3) {
        console.log(`📦 Processing batch of ${urls.length} resources with concurrency ${concurrency}`);
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
        console.log(`✅ Batch complete: ${successCount}/${urls.length} resources fetched successfully`);
        return batchResults;
    }

    /**
     * Clears the size cache
     */
    clearCache() {
        const cacheSize = this.sizeCache.size;
        this.sizeCache.clear();
        console.log(`🗑️ Cache cleared (removed ${cacheSize} entries)`);
    }
}
