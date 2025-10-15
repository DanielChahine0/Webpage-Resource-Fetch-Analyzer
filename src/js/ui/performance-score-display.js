/**
 * Performance Score Display
 * Handles rendering of performance score UI
 */

export class PerformanceScoreDisplay {
    /**
     * Displays the performance score card
     */
    static display(performanceData) {
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
                <h3>Performance Score</h3>
                <button class="info-btn" id="scoreInfoBtn" title="View detailed breakdown">i</button>
            </div>
            <div class="score-circle ${colorClass}">
                <div class="score-value">${score}</div>
                <div class="score-category">${category}</div>
            </div>
            <div class="score-breakdown" id="scoreBreakdown" style="display: none;">
                <h4>Score Breakdown:</h4>
                <div class="breakdown-item">
                    <span class="breakdown-label">Page Size (30%)</span>
                    <span class="breakdown-value">${breakdown.pageSize}/100</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Request Count (25%)</span>
                    <span class="breakdown-value">${breakdown.requestCount}/100</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Resource Distribution (25%)</span>
                    <span class="breakdown-value">${breakdown.resourceDistribution}/100</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Compression/Optimization (20%)</span>
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
}
