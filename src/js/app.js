/**
 * Webpage Resource Fetch Analyzer
 * Main Application Entry Point
 * 
 * This application analyzes webpages and calculates performance scores
 * based on resource size, request count, distribution, and optimization.
 * 
 * Created by: Daniel Chahine
 * Date: October 2025
 */

import { UIController } from './ui/ui-controller.js';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
    console.log('Webpage Resource Fetch Analyzer initialized');
});
