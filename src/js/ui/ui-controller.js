/**
 * UI Controller
 * Main controller that orchestrates all UI components
 */

import { ResourceAnalyzer } from '../core/resource-analyzer.js';
import { ProgressDisplay } from './progress-display.js';
import { ResultsDisplay } from './results-display.js';
import { PerformanceScoreDisplay } from './performance-score-display.js';
import { LoadTimeDisplay } from './load-time-display.js';
import { TreemapDisplay } from './treemap-display.js';
import { ResourceChartDisplay } from './resource-chart-display.js';
import { OptimizationSuggester } from '../core/optimization-suggester.js';
import { OptimizationSuggestionsDisplay } from './optimization-suggestions-display.js';
import { DuplicateDetector } from '../core/duplicate-detector.js';
import { DuplicateDisplay } from './duplicate-display.js';
import { ErrorDisplay } from './error-display.js';
import { LoadingDisplay } from './loading-display.js';
import { CSVExporter } from './csv-exporter.js';
import { PDFExporter } from './pdf-exporter.js';

export class UIController {
    constructor() {
        this.analyzer = new ResourceAnalyzer();
        this.progressDisplay = new ProgressDisplay();
        this.resultsDisplay = new ResultsDisplay(this.analyzer);
        this.optimizationSuggester = new OptimizationSuggester();
        this.optimizationDisplay = new OptimizationSuggestionsDisplay();
        this.results = null;
        this.performanceData = null;
        this.initEventListeners();
    }

    /**
     * Initializes event listeners
     */
    initEventListeners() {
        const form = document.getElementById('analyzerForm');
        const exportBtn = document.getElementById('exportBtn');
        const exportPdfBtn = document.getElementById('exportPdfBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAnalyze();
        });

        exportBtn.addEventListener('click', () => {
            CSVExporter.export(this.results, this.analyzer);
        });

        exportPdfBtn.addEventListener('click', async () => {
            try {
                await PDFExporter.export(this.results, this.analyzer, this.performanceData);
            } catch (error) {
                ErrorDisplay.show(`PDF Export Error: ${error.message}`);
            }
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
            // Show proxy status
            const proxyInfo = this.analyzer.fetcher.getCurrentProxy();
            this.progressDisplay.updateProxyStatus(proxyInfo.name);
            
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
            this.performanceData = this.analyzer.calculatePerformanceScore(results);
            PerformanceScoreDisplay.display(this.performanceData);
            
            // Display load time estimates
            LoadTimeDisplay.display(this.analyzer.resources);
            
            // Generate and display optimization suggestions
            const suggestions = this.optimizationSuggester.analyzeSuggestions(
                this.analyzer.resources,
                results
            );
            const suggestionsSummary = this.optimizationSuggester.getSummary();
            this.optimizationDisplay.display(suggestions, suggestionsSummary);
            
            // Display treemap visualization
            TreemapDisplay.display(this.analyzer.resources);
            
            // Display resource type chart
            ResourceChartDisplay.display(this.analyzer.resources);
            
            // Display duplicate detection analysis
            const duplicateAnalysis = DuplicateDetector.analyzeDuplicates(this.analyzer.resources);
            DuplicateDisplay.display(duplicateAnalysis);
            
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
