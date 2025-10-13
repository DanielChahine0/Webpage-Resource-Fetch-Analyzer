/**
 * Performance Score Calculator
 * Calculates performance scores based on multiple metrics
 */

export class PerformanceScorer {
    /**
     * Calculates performance score (0-100) based on multiple metrics
     * Similar to Google Lighthouse scoring
     */
    static calculatePerformanceScore(results) {
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
