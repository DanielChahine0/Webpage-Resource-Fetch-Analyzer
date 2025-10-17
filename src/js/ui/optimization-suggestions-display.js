/**
 * Optimization Suggestions Display
 * UI component for displaying optimization recommendations
 * 
 * Webpage Resource Fetch Analyzer
 * Created by: Daniel Chahine
 */

export class OptimizationSuggestionsDisplay {
    constructor() {
        this.container = null;
    }

    /**
     * Display optimization suggestions
     * @param {Array} suggestions - Array of suggestion objects
     * @param {Object} summary - Summary statistics
     */
    display(suggestions, summary) {
        this.container = document.getElementById('optimizationSuggestions');
        
        if (!this.container) {
            // Create container if it doesn't exist
            this.createContainer();
        }
        
        // Clear previous content
        this.container.innerHTML = '';
        
        if (suggestions.length === 0) {
            this.displayNoSuggestions();
            return;
        }
        
        // Display summary header
        this.displaySummary(summary);
        
        // Display suggestions
        this.displaySuggestions(suggestions);
        
        // Show the container
        this.container.style.display = 'block';
    }

    /**
     * Create suggestions container
     */
    createContainer() {
        const resultsSection = document.getElementById('resultsSection');
        
        this.container = document.createElement('div');
        this.container.id = 'optimizationSuggestions';
        this.container.className = 'optimization-suggestions';
        
        // Insert after performance score card
        const performanceCard = document.getElementById('performanceScoreCard');
        if (performanceCard && performanceCard.nextSibling) {
            resultsSection.insertBefore(this.container, performanceCard.nextSibling);
        } else {
            resultsSection.insertBefore(this.container, resultsSection.firstChild);
        }
    }

    /**
     * Display no suggestions message
     */
    displayNoSuggestions() {
        this.container.innerHTML = `
            <div class="optimization-header">
                <h3>Optimization Suggestions</h3>
            </div>
            <div class="no-suggestions">
                <div class="no-suggestions-icon">✓</div>
                <h4>Great Job!</h4>
                <p>No major optimization opportunities detected. Your website is well-optimized.</p>
            </div>
        `;
    }

    /**
     * Display summary statistics
     */
    displaySummary(summary) {
        const summaryHTML = `
            <div class="optimization-header">
                <div class="optimization-title">
                    <h3>Optimization Suggestions</h3>
                    <p class="optimization-subtitle">Actionable recommendations to improve performance</p>
                </div>
                <div class="optimization-stats">
                    <div class="opt-stat">
                        <span class="opt-stat-value">${summary.totalSuggestions}</span>
                        <span class="opt-stat-label">Suggestions</span>
                    </div>
                    ${summary.totalPotentialSavings !== '0 B' ? `
                        <div class="opt-stat">
                            <span class="opt-stat-value">${summary.totalPotentialSavings}</span>
                            <span class="opt-stat-label">Potential Savings</span>
                        </div>
                    ` : ''}
                    <div class="opt-stat priority-high">
                        <span class="opt-stat-value">${summary.highPriority}</span>
                        <span class="opt-stat-label">High Priority</span>
                    </div>
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', summaryHTML);
    }

    /**
     * Display all suggestions
     */
    displaySuggestions(suggestions) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-list';
        
        suggestions.forEach((suggestion, index) => {
            const suggestionCard = this.createSuggestionCard(suggestion, index);
            suggestionsContainer.appendChild(suggestionCard);
        });
        
        this.container.appendChild(suggestionsContainer);
    }

    /**
     * Create individual suggestion card
     */
    createSuggestionCard(suggestion, index) {
        const card = document.createElement('div');
        card.className = `suggestion-card priority-${suggestion.priority}`;
        card.id = `suggestion-${suggestion.id}`;
        
        // Priority badge
        const priorityBadge = this.getPriorityBadge(suggestion.priority);
        
        // Impact badge
        const impactBadge = suggestion.impactText ? 
            `<span class="impact-badge">${suggestion.impactText}</span>` : '';
        
        card.innerHTML = `
            <div class="suggestion-header">
                <div class="suggestion-title-row">
                    <h4 class="suggestion-title">
                        <span class="suggestion-number">${index + 1}</span>
                        ${suggestion.title}
                    </h4>
                    <div class="suggestion-badges">
                        ${priorityBadge}
                        ${impactBadge}
                    </div>
                </div>
                <p class="suggestion-category">${suggestion.category}</p>
            </div>
            
            <div class="suggestion-description">
                ${suggestion.description}
            </div>
            
            <div class="suggestion-actions">
                <div class="actions-header">
                    <strong>Recommended Actions:</strong>
                </div>
                <ul class="actions-list">
                    ${suggestion.actions.map(action => `<li>${action}</li>`).join('')}
                </ul>
            </div>
            
            ${suggestion.resources ? this.createResourcesList(suggestion) : ''}
        `;
        
        return card;
    }

    /**
     * Get priority badge HTML
     */
    getPriorityBadge(priority) {
        const badges = {
            high: '<span class="priority-badge priority-high">High Priority</span>',
            medium: '<span class="priority-badge priority-medium">Medium Priority</span>',
            low: '<span class="priority-badge priority-low">Low Priority</span>'
        };
        return badges[priority] || '';
    }

    /**
     * Create resources list for suggestion
     */
    createResourcesList(suggestion) {
        if (!suggestion.resources || suggestion.resources.length === 0) {
            return '';
        }
        
        // Limit displayed resources to prevent overwhelming UI
        const displayLimit = 5;
        const resources = suggestion.resources.slice(0, displayLimit);
        const hasMore = suggestion.resources.length > displayLimit;
        
        let resourcesHTML = `
            <div class="affected-resources">
                <div class="resources-header">
                    <strong>Affected Resources (${suggestion.resources.length}):</strong>
                </div>
                <ul class="resources-list">
        `;
        
        resources.forEach(resource => {
            if (resource.urls) {
                // Duplicate resources
                resourcesHTML += `
                    <li class="resource-item">
                        <span class="resource-name">${resource.filename}</span>
                        <span class="resource-meta">Loaded ${resource.count}× • ${this.formatBytes(resource.size)} each</span>
                    </li>
                `;
            } else {
                // Regular resources
                const fileName = this.extractFileName(resource.url);
                const sizeDiff = resource.potentialSize ? 
                    `<span class="size-savings">→ ${this.formatBytes(resource.potentialSize)}</span>` : '';
                
                resourcesHTML += `
                    <li class="resource-item">
                        <span class="resource-name" title="${resource.url}">${fileName}</span>
                        <span class="resource-meta">
                            ${this.formatBytes(resource.size)} ${sizeDiff}
                        </span>
                    </li>
                `;
            }
        });
        
        if (hasMore) {
            const remaining = suggestion.resources.length - displayLimit;
            resourcesHTML += `
                <li class="resource-item more-resources">
                    <span class="resource-name">+ ${remaining} more resource${remaining > 1 ? 's' : ''}</span>
                </li>
            `;
        }
        
        resourcesHTML += `
                </ul>
            </div>
        `;
        
        return resourcesHTML;
    }

    /**
     * Extract filename from URL
     */
    extractFileName(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const fileName = pathname.split('/').pop() || pathname;
            return fileName.length > 50 ? fileName.substring(0, 47) + '...' : fileName;
        } catch {
            return url.length > 50 ? url.substring(0, 47) + '...' : url;
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
     * Hide suggestions container
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Clear suggestions
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container.style.display = 'none';
        }
    }
}
