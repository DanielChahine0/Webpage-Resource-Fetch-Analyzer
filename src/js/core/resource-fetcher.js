/**
 * Resource Fetcher
 * Handles fetching resources with caching and parallel processing
 */

import { URLUtils } from '../utils/url-utils.js';

export class ResourceFetcher {
    constructor() {
        this.sizeCache = new Map();
        this.proxyUrl = 'https://api.allorigins.win/raw?url=';
    }

    /**
     * Fetches HTML content using CORS proxy
     */
    async fetchHTML(url) {
        const response = await fetch(this.proxyUrl + encodeURIComponent(url));
        
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
        
        return await Promise.all(results);
    }

    /**
     * Clears the size cache
     */
    clearCache() {
        this.sizeCache.clear();
    }
}
