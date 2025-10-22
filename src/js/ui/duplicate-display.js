/**
 * Duplicate Display
 * Handles rendering of duplicate resource detection results
 */

import { FormatUtils } from '../utils/format-utils.js';

export class DuplicateDisplay {
    /**
     * Display duplicate detection results
     * @param {Object} analysis - Duplicate analysis results
     */
    static display(analysis) {
        const container = document.getElementById('duplicateDetection');
        
        if (!container) {
            console.error('Duplicate detection container not found');
            return;
        }

        // Show the container
        container.style.display = 'block';

        // Clear previous content
        container.innerHTML = '';

        // Create header
        const header = document.createElement('div');
        header.className = 'duplicate-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Duplicate Resource Detection';
        header.appendChild(title);

        // Add summary status
        const summary = document.createElement('div');
        summary.className = analysis.hasDuplicates ? 'duplicate-summary warning' : 'duplicate-summary success';
        
        const summaryText = document.createElement('span');
        summaryText.textContent = analysis.hasDuplicates 
            ? `Found ${analysis.duplicateGroups.length} resource(s) loaded multiple times`
            : 'No duplicate resources detected';
        
        summary.appendChild(summaryText);
        header.appendChild(summary);

        container.appendChild(header);

        // If no duplicates, show success message and return
        if (!analysis.hasDuplicates) {
            const successMessage = document.createElement('div');
            successMessage.className = 'duplicate-no-issues';
            successMessage.innerHTML = `
                <p><strong>Great job!</strong> All resources are loaded only once.</p>
                <p>No bandwidth is being wasted on duplicate downloads.</p>
            `;
            container.appendChild(successMessage);
            return;
        }

        // Display statistics cards
        const statsContainer = document.createElement('div');
        statsContainer.className = 'duplicate-stats';

        const stats = [
            {
                label: 'Duplicate Resources',
                value: analysis.duplicateGroups.length,
                description: 'Unique resources loaded multiple times'
            },
            {
                label: 'Total Duplicates',
                value: analysis.totalDuplicates,
                description: `${analysis.duplicatePercentage}% of all resources`
            },
            {
                label: 'Wasted Bandwidth',
                value: FormatUtils.formatBytes(analysis.wastedBandwidth),
                description: `${analysis.wastedPercentage}% of total size`
            },
            {
                label: 'Unique Resources',
                value: analysis.uniqueResources,
                description: `${analysis.totalResources} total resources`
            }
        ];

        stats.forEach(stat => {
            const statCard = document.createElement('div');
            statCard.className = 'duplicate-stat-card';
            statCard.innerHTML = `
                <div class="duplicate-stat-value">${stat.value}</div>
                <div class="duplicate-stat-label">${stat.label}</div>
                <div class="duplicate-stat-description">${stat.description}</div>
            `;
            statsContainer.appendChild(statCard);
        });

        container.appendChild(statsContainer);

        // Display duplicate groups
        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'duplicate-groups';

        const groupsHeader = document.createElement('h4');
        groupsHeader.textContent = 'Duplicate Resources Details';
        groupsContainer.appendChild(groupsHeader);

        analysis.duplicateGroups.forEach((group, index) => {
            const groupCard = document.createElement('div');
            groupCard.className = `duplicate-group severity-${group.severity}`;

            // Group header
            const groupHeaderDiv = document.createElement('div');
            groupHeaderDiv.className = 'duplicate-group-header';
            
            const severityBadge = document.createElement('span');
            severityBadge.className = `severity-badge severity-${group.severity}`;
            severityBadge.textContent = group.severity.toUpperCase();
            
            const fileName = document.createElement('span');
            fileName.className = 'duplicate-filename';
            fileName.textContent = group.fileName;
            fileName.title = group.fileName;
            
            groupHeaderDiv.appendChild(severityBadge);
            groupHeaderDiv.appendChild(fileName);
            groupCard.appendChild(groupHeaderDiv);

            // Group details
            const groupDetails = document.createElement('div');
            groupDetails.className = 'duplicate-group-details';
            groupDetails.innerHTML = `
                <div class="duplicate-detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="file-type type-${group.type}">${group.type.toUpperCase()}</span>
                </div>
                <div class="duplicate-detail-row">
                    <span class="detail-label">Size:</span>
                    <span>${FormatUtils.formatBytes(group.size)}</span>
                </div>
                <div class="duplicate-detail-row">
                    <span class="detail-label">Instances:</span>
                    <span>${group.instances} times (${group.duplicateCount} duplicates)</span>
                </div>
                <div class="duplicate-detail-row">
                    <span class="detail-label">Wasted:</span>
                    <span class="wasted-bandwidth">${FormatUtils.formatBytes(group.wastedSize)}</span>
                </div>
            `;
            groupCard.appendChild(groupDetails);

            // URLs list (collapsible)
            const urlsContainer = document.createElement('div');
            urlsContainer.className = 'duplicate-urls-container';
            
            const urlsToggle = document.createElement('button');
            urlsToggle.className = 'duplicate-urls-toggle';
            urlsToggle.textContent = `Show ${group.urls.length} URLs ▼`;
            urlsToggle.onclick = () => {
                urlsList.classList.toggle('expanded');
                urlsToggle.textContent = urlsList.classList.contains('expanded')
                    ? `Hide URLs ▲`
                    : `Show ${group.urls.length} URLs ▼`;
            };
            
            const urlsList = document.createElement('div');
            urlsList.className = 'duplicate-urls-list';
            
            group.urls.forEach((url, idx) => {
                const urlItem = document.createElement('div');
                urlItem.className = 'duplicate-url-item';
                urlItem.innerHTML = `
                    <span class="url-index">${idx + 1}.</span>
                    <span class="url-text" title="${url}">${url}</span>
                `;
                urlsList.appendChild(urlItem);
            });
            
            urlsContainer.appendChild(urlsToggle);
            urlsContainer.appendChild(urlsList);
            groupCard.appendChild(urlsContainer);

            groupsContainer.appendChild(groupCard);
        });

        container.appendChild(groupsContainer);

        // Display suggestions if available
        if (analysis.suggestions && analysis.suggestions.length > 0) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'duplicate-suggestions';

            const suggestionsHeader = document.createElement('h4');
            suggestionsHeader.textContent = '💡 Consolidation Suggestions';
            suggestionsContainer.appendChild(suggestionsHeader);

            analysis.suggestions.forEach(suggestion => {
                const suggestionCard = document.createElement('div');
                suggestionCard.className = `duplicate-suggestion priority-${suggestion.priority}`;

                suggestionCard.innerHTML = `
                    <div class="suggestion-header">
                        <span class="priority-badge priority-${suggestion.priority}">${suggestion.priority.toUpperCase()}</span>
                        <span class="suggestion-category">${suggestion.category}</span>
                    </div>
                    <h5 class="suggestion-title">${suggestion.title}</h5>
                    <p class="suggestion-description">${suggestion.description}</p>
                    <div class="suggestion-action">
                        <strong>Action:</strong> ${suggestion.action}
                    </div>
                    <div class="suggestion-impact">
                        <strong>Impact:</strong> ${suggestion.impact}
                    </div>
                    ${suggestion.resources && suggestion.resources.length > 0 ? `
                        <div class="suggestion-resources">
                            <strong>Affected Resources:</strong>
                            <ul>
                                ${suggestion.resources.slice(0, 5).map(r => `<li>${r}</li>`).join('')}
                                ${suggestion.resources.length > 5 ? `<li>...and ${suggestion.resources.length - 5} more</li>` : ''}
                            </ul>
                        </div>
                    ` : ''}
                `;

                suggestionsContainer.appendChild(suggestionCard);
            });

            container.appendChild(suggestionsContainer);
        }
    }

    /**
     * Clear duplicate detection display
     */
    static clear() {
        const container = document.getElementById('duplicateDetection');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }
}
