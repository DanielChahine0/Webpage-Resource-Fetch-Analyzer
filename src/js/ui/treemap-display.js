/**
 * Treemap Display
 * Visualizes resources as an interactive treemap based on size
 */

import { FormatUtils } from '../utils/format-utils.js';

export class TreemapDisplay {
    /**
     * Displays the treemap visualization
     * @param {Array} resources - Array of resource objects
     */
    static display(resources) {
        const container = document.getElementById('treemapVisualization');
        if (!container) return;

        container.style.display = 'block';
        const treemapContainer = document.getElementById('treemapContainer');
        treemapContainer.innerHTML = '';

        if (!resources || resources.length === 0) {
            treemapContainer.innerHTML = '<p class="no-data">No resources to display</p>';
            return;
        }

        // Group resources by type
        const groupedData = this.groupResourcesByType(resources);
        
        // Calculate total size for percentage calculations
        const totalSize = resources.reduce((sum, r) => sum + r.size, 0);

        // Create treemap items
        this.createTreemapItems(treemapContainer, groupedData, totalSize);
    }

    /**
     * Groups resources by their type
     * @param {Array} resources - Array of resource objects
     * @returns {Object} Grouped resources by type
     */
    static groupResourcesByType(resources) {
        const groups = {};
        
        resources.forEach(resource => {
            const type = resource.type || 'other';
            if (!groups[type]) {
                groups[type] = {
                    type: type,
                    resources: [],
                    totalSize: 0
                };
            }
            groups[type].resources.push(resource);
            groups[type].totalSize += resource.size;
        });

        return groups;
    }

    /**
     * Creates treemap items in the container
     * @param {HTMLElement} container - Container element
     * @param {Object} groupedData - Grouped resources by type
     * @param {number} totalSize - Total size of all resources
     */
    static createTreemapItems(container, groupedData, totalSize) {
        // Sort groups by size (largest first)
        const sortedGroups = Object.values(groupedData).sort((a, b) => b.totalSize - a.totalSize);

        sortedGroups.forEach(group => {
            const groupPercentage = (group.totalSize / totalSize) * 100;
            
            // Create group container
            const groupElement = document.createElement('div');
            groupElement.className = 'treemap-group';
            groupElement.style.flexBasis = `${groupPercentage}%`;
            groupElement.setAttribute('data-type', group.type);

            // Create group header
            const groupHeader = document.createElement('div');
            groupHeader.className = 'treemap-group-header';
            groupHeader.innerHTML = `
                <span class="treemap-type">${group.type.toUpperCase()}</span>
                <span class="treemap-size">${FormatUtils.formatBytes(group.totalSize)}</span>
                <span class="treemap-count">${group.resources.length} files</span>
            `;
            groupElement.appendChild(groupHeader);

            // Create items container
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'treemap-items';

            // Sort resources within the group by size
            const sortedResources = group.resources.sort((a, b) => b.size - a.size);

            // Create individual resource items
            sortedResources.forEach(resource => {
                const itemPercentage = (resource.size / group.totalSize) * 100;
                
                const item = document.createElement('div');
                item.className = 'treemap-item';
                item.style.flexBasis = `${itemPercentage}%`;
                item.setAttribute('data-resource-type', group.type);
                item.setAttribute('title', `${resource.name}\n${FormatUtils.formatBytes(resource.size)}\n${resource.url}`);

                // Add size indicator for larger items
                if (itemPercentage > 5) {
                    const sizeLabel = document.createElement('span');
                    sizeLabel.className = 'treemap-item-label';
                    sizeLabel.textContent = FormatUtils.formatBytes(resource.size);
                    item.appendChild(sizeLabel);
                }

                // Add click event for details
                item.addEventListener('click', () => {
                    this.showResourceDetails(resource);
                });

                itemsContainer.appendChild(item);
            });

            groupElement.appendChild(itemsContainer);
            container.appendChild(groupElement);
        });

        // Add toggle button
        this.addToggleButton(container);
    }

    /**
     * Shows detailed information about a resource
     * @param {Object} resource - Resource object
     */
    static showResourceDetails(resource) {
        const modal = document.createElement('div');
        modal.className = 'treemap-modal';
        modal.innerHTML = `
            <div class="treemap-modal-content">
                <div class="treemap-modal-header">
                    <h3>Resource Details</h3>
                    <button class="treemap-modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="treemap-modal-body">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${resource.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value"><span class="file-type type-${resource.type}">${resource.type.toUpperCase()}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Size:</span>
                        <span class="detail-value">${FormatUtils.formatBytes(resource.size)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">URL:</span>
                        <span class="detail-value detail-url">${resource.url}</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        const closeBtn = modal.querySelector('.treemap-modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    /**
     * Adds a toggle button to switch between grouped and flat view
     * @param {HTMLElement} container - Container element
     */
    static addToggleButton(container) {
        const existingToggle = document.getElementById('treemapToggle');
        if (existingToggle) return;

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'treemap-toggle-container';
        toggleContainer.innerHTML = `
            <button id="treemapToggle" class="treemap-toggle-btn">
                <span class="toggle-icon">Toggle</span>
                <span class="toggle-text">Toggle View</span>
            </button>
        `;

        const vizSection = document.getElementById('treemapVisualization');
        vizSection.insertBefore(toggleContainer, container);

        const toggleBtn = document.getElementById('treemapToggle');
        toggleBtn.addEventListener('click', () => {
            container.classList.toggle('flat-view');
        });
    }

    /**
     * Clears the treemap display
     */
    static clear() {
        const container = document.getElementById('treemapVisualization');
        if (container) {
            container.style.display = 'none';
            const treemapContainer = document.getElementById('treemapContainer');
            if (treemapContainer) {
                treemapContainer.innerHTML = '';
            }
        }

        const toggleContainer = document.querySelector('.treemap-toggle-container');
        if (toggleContainer) {
            toggleContainer.remove();
        }
    }

    /**
     * Hides the treemap display
     */
    static hide() {
        const container = document.getElementById('treemapVisualization');
        if (container) {
            container.style.display = 'none';
        }
    }
}
