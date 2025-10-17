/**
 * Optimization Suggester
 * Analyzes resources and provides actionable optimization recommendations
 * 
 * Webpage Resource Fetch Analyzer
 * Created by: Daniel Chahine
 */

export class OptimizationSuggester {
    constructor() {
        this.suggestions = [];
        this.thresholds = {
            largeImageSize: 200 * 1024, // 200KB
            largeFileSize: 500 * 1024, // 500KB
            tooManyRequests: 50,
            compressionRatio: 0.7, // Assume 30% compression possible
            minifiableTypes: ['css', 'js']
        };
    }

    /**
     * Analyze resources and generate optimization suggestions
     * @param {Array} resources - Array of resource objects
     * @param {Object} summary - Summary statistics
     * @returns {Array} Array of suggestion objects
     */
    analyzeSuggestions(resources, summary) {
        this.suggestions = [];
        
        // Analyze different aspects
        this.analyzeImages(resources);
        this.analyzeMinification(resources);
        this.analyzeCompression(resources);
        this.analyzeRequestCount(summary);
        this.analyzeCDN(resources);
        this.analyzeModernFormats(resources);
        this.analyzeHTTPS(resources);
        this.analyzeDuplicates(resources);
        
        // Sort by priority and impact
        this.suggestions.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        return this.suggestions;
    }

    /**
     * Analyze images for optimization opportunities
     */
    analyzeImages(resources) {
        const images = resources.filter(r => r.type === 'image');
        
        if (images.length === 0) return;
        
        const totalImageSize = images.reduce((sum, img) => sum + img.size, 0);
        const largeImages = images.filter(img => img.size > this.thresholds.largeImageSize);
        
        if (largeImages.length > 0) {
            const totalLargeSize = largeImages.reduce((sum, img) => sum + img.size, 0);
            const potentialSavings = totalLargeSize * 0.4; // Assume 40% compression
            
            this.suggestions.push({
                id: 'compress-images',
                category: 'Images',
                priority: 'high',
                title: 'Compress Images',
                description: `${largeImages.length} large image${largeImages.length > 1 ? 's' : ''} detected. Compressing images could reduce size by ${this.formatBytes(potentialSavings)}.`,
                impact: potentialSavings,
                impactText: `~${this.formatBytes(potentialSavings)} savings`,
                actions: [
                    'Use image compression tools (TinyPNG, ImageOptim, Squoosh)',
                    'Optimize images before uploading to your website',
                    'Use appropriate quality settings (80-85% for JPEG)',
                    'Remove unnecessary metadata from images'
                ],
                resources: largeImages.map(img => ({
                    url: img.url,
                    size: img.size,
                    potentialSize: Math.round(img.size * 0.6)
                }))
            });
        }
        
        // Check total image size
        if (totalImageSize > 2 * 1024 * 1024) { // 2MB
            const percentOfTotal = (totalImageSize / resources.reduce((sum, r) => sum + r.size, 0)) * 100;
            
            this.suggestions.push({
                id: 'image-heavy',
                category: 'Images',
                priority: 'medium',
                title: 'Image-Heavy Page',
                description: `Images account for ${percentOfTotal.toFixed(1)}% of total page size (${this.formatBytes(totalImageSize)}). Consider lazy loading or responsive images.`,
                impact: totalImageSize * 0.3,
                impactText: `Potential improvement`,
                actions: [
                    'Implement lazy loading for below-the-fold images',
                    'Use responsive images with srcset attribute',
                    'Consider using CSS sprites for small icons',
                    'Load images progressively (progressive JPEG, interlaced PNG)'
                ]
            });
        }
    }

    /**
     * Analyze minification opportunities
     */
    analyzeMinification(resources) {
        const minifiableResources = resources.filter(r => 
            this.thresholds.minifiableTypes.includes(r.type)
        );
        
        if (minifiableResources.length === 0) return;
        
        // Check for unminified files (simple heuristic: check filename)
        const likelyUnminified = minifiableResources.filter(r => 
            !r.url.includes('.min.') && r.size > 10 * 1024 // > 10KB
        );
        
        if (likelyUnminified.length > 0) {
            const totalSize = likelyUnminified.reduce((sum, r) => sum + r.size, 0);
            const potentialSavings = totalSize * 0.3; // Assume 30% size reduction
            
            this.suggestions.push({
                id: 'minify-files',
                category: 'Code Optimization',
                priority: 'high',
                title: 'Minify CSS/JavaScript Files',
                description: `${likelyUnminified.length} CSS/JS file${likelyUnminified.length > 1 ? 's' : ''} appear to be unminified. Minification could reduce size by ${this.formatBytes(potentialSavings)}.`,
                impact: potentialSavings,
                impactText: `~${this.formatBytes(potentialSavings)} savings`,
                actions: [
                    'Minify JavaScript files using terser or uglify-js',
                    'Minify CSS files using cssnano or clean-css',
                    'Use build tools (Webpack, Rollup, Parcel) for automatic minification',
                    'Remove comments, whitespace, and unused code'
                ],
                resources: likelyUnminified.map(r => ({
                    url: r.url,
                    type: r.type,
                    size: r.size,
                    potentialSize: Math.round(r.size * 0.7)
                }))
            });
        }
    }

    /**
     * Analyze compression opportunities
     */
    analyzeCompression(resources) {
        const compressibleTypes = ['html', 'css', 'js', 'json', 'xml', 'svg'];
        const compressible = resources.filter(r => compressibleTypes.includes(r.type));
        
        if (compressible.length === 0) return;
        
        const totalSize = compressible.reduce((sum, r) => sum + r.size, 0);
        const potentialSavings = totalSize * (1 - this.thresholds.compressionRatio);
        
        if (totalSize > 100 * 1024) { // If > 100KB of compressible content
            this.suggestions.push({
                id: 'enable-compression',
                category: 'Server Configuration',
                priority: 'high',
                title: 'Enable Gzip/Brotli Compression',
                description: `Text-based resources (${this.formatBytes(totalSize)}) could benefit from server compression. Enable gzip or brotli to reduce bandwidth by ~${this.formatBytes(potentialSavings)}.`,
                impact: potentialSavings,
                impactText: `~${this.formatBytes(potentialSavings)} savings`,
                actions: [
                    'Enable Brotli compression (better than gzip) on your web server',
                    'Configure gzip compression as fallback for older browsers',
                    'Compress HTML, CSS, JavaScript, JSON, XML, and SVG files',
                    'Set appropriate compression levels (4-6 for good balance)',
                    'Add compression headers to your server configuration'
                ]
            });
        }
    }

    /**
     * Analyze request count
     */
    analyzeRequestCount(summary) {
        const totalRequests = summary.totalResources;
        
        if (totalRequests > this.thresholds.tooManyRequests) {
            this.suggestions.push({
                id: 'reduce-requests',
                category: 'Network Optimization',
                priority: 'medium',
                title: 'Reduce HTTP Requests',
                description: `Page makes ${totalRequests} HTTP requests. Each request adds latency. Consider combining resources to reduce requests.`,
                impact: totalRequests - 30, // Target: ~30 requests
                impactText: `Reduce by ${totalRequests - 30} requests`,
                actions: [
                    'Combine multiple CSS files into one',
                    'Combine multiple JavaScript files into one',
                    'Use CSS sprites for multiple small images',
                    'Inline small CSS/JS directly in HTML (for critical resources)',
                    'Use HTTP/2 or HTTP/3 for multiplexing',
                    'Remove unused third-party scripts'
                ]
            });
        }
    }

    /**
     * Analyze CDN usage
     */
    analyzeCDN(resources) {
        const cdnDomains = [
            'cdn.', 'cloudfront.net', 'cloudflare.com', 
            'fastly.net', 'akamai.net', 'jsdelivr.net', 
            'unpkg.com', 'cdnjs.com', 'gstatic.com'
        ];
        
        const totalResources = resources.length;
        const cdnResources = resources.filter(r => 
            cdnDomains.some(cdn => r.url.toLowerCase().includes(cdn))
        );
        
        const cdnPercentage = (cdnResources.length / totalResources) * 100;
        
        if (cdnPercentage < 20 && totalResources > 10) {
            this.suggestions.push({
                id: 'use-cdn',
                category: 'Network Optimization',
                priority: 'medium',
                title: 'Consider Using a CDN',
                description: `Only ${cdnPercentage.toFixed(0)}% of resources are served from a CDN. Using a CDN can significantly improve load times globally.`,
                impact: 0,
                impactText: 'Faster global delivery',
                actions: [
                    'Use a CDN for static assets (images, CSS, JavaScript)',
                    'Popular CDNs: Cloudflare, AWS CloudFront, Fastly, BunnyCDN',
                    'Serve libraries from public CDNs (cdnjs, jsdelivr, unpkg)',
                    'Enable CDN caching with appropriate cache headers',
                    'Use CDN features like image optimization and compression'
                ]
            });
        }
    }

    /**
     * Analyze modern image format usage
     */
    analyzeModernFormats(resources) {
        const images = resources.filter(r => r.type === 'image');
        
        if (images.length === 0) return;
        
        // Check for WebP/AVIF usage
        const modernFormats = images.filter(img => 
            img.url.toLowerCase().includes('.webp') || 
            img.url.toLowerCase().includes('.avif')
        );
        
        const oldFormats = images.filter(img => 
            img.url.toLowerCase().includes('.jpg') || 
            img.url.toLowerCase().includes('.jpeg') || 
            img.url.toLowerCase().includes('.png')
        );
        
        if (oldFormats.length > 3 && modernFormats.length === 0) {
            const totalOldSize = oldFormats.reduce((sum, img) => sum + img.size, 0);
            const potentialSavings = totalOldSize * 0.3; // WebP/AVIF typically 30% smaller
            
            this.suggestions.push({
                id: 'modern-formats',
                category: 'Images',
                priority: 'medium',
                title: 'Convert Images to WebP/AVIF',
                description: `${oldFormats.length} image${oldFormats.length > 1 ? 's use' : ' uses'} older formats (JPEG/PNG). Converting to WebP/AVIF could save ~${this.formatBytes(potentialSavings)}.`,
                impact: potentialSavings,
                impactText: `~${this.formatBytes(potentialSavings)} savings`,
                actions: [
                    'Convert images to WebP format (widely supported)',
                    'Use AVIF for even better compression (newer format)',
                    'Provide fallbacks for older browsers using <picture> tag',
                    'Use tools like Squoosh, cwebp, or online converters',
                    'Set up automatic conversion in your build process'
                ]
            });
        }
    }

    /**
     * Analyze HTTPS usage
     */
    analyzeHTTPS(resources) {
        const httpResources = resources.filter(r => 
            r.url.toLowerCase().startsWith('http://')
        );
        
        if (httpResources.length > 0) {
            this.suggestions.push({
                id: 'use-https',
                category: 'Security',
                priority: 'high',
                title: 'Use HTTPS for All Resources',
                description: `${httpResources.length} resource${httpResources.length > 1 ? 's are' : ' is'} loaded over insecure HTTP. This can cause security warnings and mixed content issues.`,
                impact: 0,
                impactText: 'Security & SEO improvement',
                actions: [
                    'Update all resource URLs to use HTTPS',
                    'Enable HTTPS on your server if not already enabled',
                    'Use Content Security Policy to enforce HTTPS',
                    'Update third-party resources to HTTPS versions',
                    'HTTPS is required for modern browser features'
                ],
                resources: httpResources.map(r => ({ url: r.url }))
            });
        }
    }

    /**
     * Detect duplicate resources
     */
    analyzeDuplicates(resources) {
        const urlMap = new Map();
        const duplicates = [];
        
        resources.forEach(resource => {
            // Extract filename from URL
            const filename = resource.url.split('/').pop().split('?')[0];
            
            if (urlMap.has(filename)) {
                urlMap.get(filename).push(resource);
            } else {
                urlMap.set(filename, [resource]);
            }
        });
        
        // Find actual duplicates (same filename, loaded multiple times)
        urlMap.forEach((resArray, filename) => {
            if (resArray.length > 1) {
                duplicates.push({ filename, resources: resArray });
            }
        });
        
        if (duplicates.length > 0) {
            const wastedSize = duplicates.reduce((sum, dup) => {
                const size = dup.resources[0].size;
                return sum + (size * (dup.resources.length - 1));
            }, 0);
            
            this.suggestions.push({
                id: 'remove-duplicates',
                category: 'Code Optimization',
                priority: 'medium',
                title: 'Remove Duplicate Resources',
                description: `${duplicates.length} resource${duplicates.length > 1 ? 's are' : ' is'} loaded multiple times, wasting ${this.formatBytes(wastedSize)} of bandwidth.`,
                impact: wastedSize,
                impactText: `~${this.formatBytes(wastedSize)} wasted`,
                actions: [
                    'Check for duplicate script/link tags in HTML',
                    'Ensure libraries are loaded only once',
                    'Use a module bundler to prevent duplicate includes',
                    'Check for resources loaded by multiple third-party scripts'
                ],
                resources: duplicates.map(dup => ({
                    filename: dup.filename,
                    count: dup.resources.length,
                    size: dup.resources[0].size,
                    urls: dup.resources.map(r => r.url)
                }))
            });
        }
    }

    /**
     * Format bytes to human-readable string
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    /**
     * Get summary statistics about suggestions
     */
    getSummary() {
        const totalImpact = this.suggestions.reduce((sum, s) => sum + (s.impact || 0), 0);
        const highPriority = this.suggestions.filter(s => s.priority === 'high').length;
        const mediumPriority = this.suggestions.filter(s => s.priority === 'medium').length;
        const lowPriority = this.suggestions.filter(s => s.priority === 'low').length;
        
        return {
            totalSuggestions: this.suggestions.length,
            totalPotentialSavings: this.formatBytes(totalImpact),
            highPriority,
            mediumPriority,
            lowPriority,
            categories: [...new Set(this.suggestions.map(s => s.category))]
        };
    }
}
