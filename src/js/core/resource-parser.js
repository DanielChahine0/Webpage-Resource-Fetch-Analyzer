/**
 * Resource Parser
 * Extracts resource URLs from HTML and CSS
 */

import { URLUtils } from '../utils/url-utils.js';

export class ResourceParser {
    /**
     * Checks if a source is a placeholder
     */
    static isPlaceholder(src) {
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
     * Extracts URLs from CSS content
     */
    static extractUrlsFromCSS(css, base, urls) {
        const urlRegex = /url\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/gi;
        let match;
        
        while ((match = urlRegex.exec(css)) !== null) {
            const url = match[1];
            const resolved = URLUtils.resolveURL(base, url);
            if (resolved) urls.add(resolved);
        }
    }

    /**
     * Collects all resource URLs from HTML
     */
    static collectResourceURLs(html, baseURL) {
        const urls = new Set();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Images
        doc.querySelectorAll('img').forEach(img => {
            let src = img.getAttribute('src') || img.getAttribute('data-src');
            
            if (ResourceParser.isPlaceholder(src)) {
                src = img.getAttribute('data-src');
            }
            
            // Handle srcset
            if (ResourceParser.isPlaceholder(src)) {
                const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');
                if (srcset) {
                    srcset.split(',').forEach(candidate => {
                        const url = candidate.trim().split(' ')[0];
                        const resolved = URLUtils.resolveURL(baseURL, url);
                        if (resolved) urls.add(resolved);
                    });
                }
            }
            
            const resolved = URLUtils.resolveURL(baseURL, src);
            if (resolved) urls.add(resolved);
        });

        // Scripts
        doc.querySelectorAll('script[src]').forEach(script => {
            const resolved = URLUtils.resolveURL(baseURL, script.getAttribute('src'));
            if (resolved) urls.add(resolved);
        });

        // Stylesheets and icons
        doc.querySelectorAll('link').forEach(link => {
            const rel = (link.getAttribute('rel') || '').toLowerCase();
            if (rel.includes('stylesheet') || rel.includes('icon')) {
                const resolved = URLUtils.resolveURL(baseURL, link.getAttribute('href'));
                if (resolved) urls.add(resolved);
            }
        });

        // Video and Audio
        doc.querySelectorAll('video, audio, source').forEach(media => {
            const src = media.getAttribute('src') || media.getAttribute('data-src');
            const resolved = URLUtils.resolveURL(baseURL, src);
            if (resolved) urls.add(resolved);
        });

        // Iframes
        doc.querySelectorAll('iframe[src]').forEach(iframe => {
            const resolved = URLUtils.resolveURL(baseURL, iframe.getAttribute('src'));
            if (resolved) urls.add(resolved);
        });

        // Embed and Object
        doc.querySelectorAll('embed[src]').forEach(embed => {
            const resolved = URLUtils.resolveURL(baseURL, embed.getAttribute('src'));
            if (resolved) urls.add(resolved);
        });

        doc.querySelectorAll('object[data]').forEach(obj => {
            const resolved = URLUtils.resolveURL(baseURL, obj.getAttribute('data'));
            if (resolved) urls.add(resolved);
        });

        // Extract from style tags
        doc.querySelectorAll('style').forEach(style => {
            ResourceParser.extractUrlsFromCSS(style.textContent, baseURL, urls);
        });

        // Extract from inline styles
        doc.querySelectorAll('[style]').forEach(elem => {
            ResourceParser.extractUrlsFromCSS(elem.getAttribute('style'), baseURL, urls);
        });

        return Array.from(urls);
    }
}
