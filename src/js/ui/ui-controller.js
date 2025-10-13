/**
 * UI Controller
 * Main controller that orchestrates all UI components
 */

import { ResourceAnalyzer } from '../core/resource-analyzer.js';
import { ProgressDisplay } from './progress-display.js';
import { ResultsDisplay } from './results-display.js';
import { PerformanceScoreDisplay } from './performance-score-display.js';
import { ErrorDisplay } from './error-display.js';
import { LoadingDisplay } from './loading-display.js';
import { CSVExporter } from './csv-exporter.js';

export class UIController {
    constructor() {
        this.analyzer = new ResourceAnalyzer();
        this.progressDisplay = new ProgressDisplay();
        this.resultsDisplay = new ResultsDisplay(this.analyzer);
        this.results = null;
        this.initEventListeners();
    }

    /**
     * Initializes event listeners
     */
    initEventListeners() {
        const form = document.getElementById('analyzerForm');
        const exportBtn = document.getElementById('exportBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAnalyze();
        });

        exportBtn.addEventListener('click', () => {
            CSVExporter.export(this.results, this.analyzer);
        });
    }

    /**
     * Handles the analyze button click
     */
    async handleAnalyze() {
        const urlInput = document.getElementById('urlInput').value.trim();

        if (!urlInput) {
            ErrorDisplay.show('Please enter a URL');
            return;
        }

        // Clear cache for fresh analysis
        this.analyzer.clearCache();

        LoadingDisplay.show(true);
        ErrorDisplay.hide();
        this.progressDisplay.show(true);
        
        // Clear previous results
        this.resultsDisplay.clearTable();
        
        // Show results section immediately
        this.resultsDisplay.show();
        
        let mainHtmlSize = 0;

        try {
            const results = await this.analyzer.analyze(
                urlInput,
                // Progress callback
                (message, current, total) => {
                    this.progressDisplay.update(message, current, total);
                },
                // Resource callback
                (resource, successfulIndex, total, totalSize) => {
                    this.resultsDisplay.addResourceToTable(resource, successfulIndex);
                    
                    if (resource.type === 'html') {
                        mainHtmlSize = resource.size;
                    }
                    
                    this.resultsDisplay.updateStats(successfulIndex, totalSize, mainHtmlSize);
                }
            );
            
            // Store results and display performance score
            this.results = results;
            const performanceData = this.analyzer.calculatePerformanceScore(results);
            PerformanceScoreDisplay.display(performanceData);
            this.progressDisplay.show(false);
        } catch (error) {
            ErrorDisplay.show(`Error: ${error.message}`);
            this.progressDisplay.show(false);
            this.resultsDisplay.hide();
        } finally {
            LoadingDisplay.show(false);
        }
    }
}
