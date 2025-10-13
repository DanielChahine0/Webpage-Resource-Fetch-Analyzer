/**
 * URL Utility Functions
 * Handles URL normalization, resolution, and parsing
 */

export class URLUtils {
    /**
     * Normalizes a URL by adding https:// if no protocol is present
     */
    static normalizeURL(urlString) {
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
     * Resolves a relative URL to absolute
     */
    static resolveURL(base, relative) {
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
     * Gets file name from URL
     */
    static getFileName(urlString) {
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
    static getFileType(urlString) {
        const fileName = URLUtils.getFileName(urlString).toLowerCase();
        
        if (fileName.endsWith('.html') || fileName.endsWith('.htm')) return 'html';
        if (fileName.endsWith('.css')) return 'css';
        if (fileName.endsWith('.js')) return 'js';
        if (fileName.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|bmp)$/)) return 'image';
        if (fileName.match(/\.(mp4|webm|ogg|avi|mov)$/)) return 'video';
        if (fileName.match(/\.(mp3|wav|ogg|m4a)$/)) return 'audio';
        if (fileName.match(/\.(woff|woff2|ttf|eot|otf)$/)) return 'font';
        
        return 'other';
    }
}
