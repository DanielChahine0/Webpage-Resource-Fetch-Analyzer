# Treemap Visualization Feature

## Overview
The Treemap Visualization feature provides an interactive, visual representation of all webpage resources based on their file sizes. This makes it easy to quickly identify the largest resources and understand the distribution of different resource types.

## Features

### 1. **Size-Based Visualization**
- Resources are displayed as rectangles with sizes proportional to their file size
- Larger files appear as larger rectangles
- Makes it immediately obvious which resources consume the most bandwidth

### 2. **Color-Coded by Resource Type**
Each resource type has a unique gradient color scheme:
- **HTML**: Purple gradient (`#667eea` to `#764ba2`)
- **CSS**: Pink gradient (`#f093fb` to `#f5576c`)
- **JavaScript**: Orange gradient (`#ffd89b` to `#f7971e`)
- **Images**: Green gradient (`#43e97b` to `#38f9d7`)
- **Fonts**: Yellow-pink gradient (`#fa709a` to `#fee140`)
- **Video**: Blue gradient (`#30cfd0` to `#330867`)
- **Audio**: Teal-pink gradient (`#a8edea` to `#fed6e3`)
- **Other**: Purple-yellow gradient (`#d299c2` to `#fef9d7`)

### 3. **Grouped by Type**
- Resources are automatically grouped by their type
- Each group shows:
  - Type name (e.g., "JS", "CSS", "IMAGE")
  - Total size of all resources in the group
  - Number of files in the group
- Groups are sorted by total size (largest first)

### 4. **Interactive Elements**
- **Hover Effect**: Rectangles scale up slightly on hover with shadow effect
- **Click to View Details**: Click any resource to see a modal with detailed information:
  - Resource name
  - Type (with color-coded badge)
  - Size (formatted)
  - Full URL
- **Tooltips**: Hover over any item to see its name, size, and URL

### 5. **Toggle View**
- Switch between grouped and flat view with the toggle button
- **Grouped View** (default): Resources organized by type in separate containers
- **Flat View**: All resource groups displayed in a single column for easier comparison

### 6. **Responsive Design**
- Adapts to different screen sizes
- Mobile-optimized with touch-friendly interactions
- Adjusts minimum sizes and spacing for smaller devices

### 7. **Size Labels**
- Resources that take up more than 5% of their group display their size directly on the rectangle
- Helps quickly identify exact sizes without hovering

## Usage

### Automatic Display
The treemap automatically appears after analyzing a webpage, positioned between the load time estimates and statistics cards.

### Interacting with the Treemap
1. **View Resource Details**: Click any colored rectangle
2. **Toggle View Mode**: Click the "Toggle View" button at the top-right
3. **Explore by Type**: Observe how resources are grouped by type
4. **Identify Large Files**: Larger rectangles indicate larger files

### Reading the Visualization
- **Size**: Rectangle size = file size
- **Color**: Different colors = different resource types
- **Position**: Within each type group, resources are sorted by size (largest first)
- **Groups**: Entire groups are sized proportionally to their total size

## Technical Implementation

### Files
- **JavaScript**: `src/js/ui/treemap-display.js`
- **CSS**: `src/css/treemap.css`
- **Integration**: Added to `ui-controller.js` and `results-display.js`

### Key Functions

#### `TreemapDisplay.display(resources)`
Main function that creates and displays the treemap visualization from an array of resources.

#### `TreemapDisplay.groupResourcesByType(resources)`
Groups resources by their type and calculates total sizes for each group.

#### `TreemapDisplay.createTreemapItems(container, groupedData, totalSize)`
Creates the visual treemap elements with proper sizing and styling.

#### `TreemapDisplay.showResourceDetails(resource)`
Displays a modal with detailed information about a clicked resource.

#### `TreemapDisplay.clear()`
Clears the treemap display (called when starting a new analysis).

### Styling Classes
- `.treemap-visualization`: Main container
- `.treemap-container`: Flex container for all groups
- `.treemap-group`: Container for each resource type group
- `.treemap-items`: Container for individual resource items
- `.treemap-item`: Individual resource rectangle
- `.treemap-modal`: Modal overlay for resource details

## Benefits

1. **Visual Understanding**: Instantly see which resources are largest
2. **Quick Optimization Targets**: Easily identify files that need optimization
3. **Type Distribution**: Understand the balance between different resource types
4. **Interactive Exploration**: Drill down into specific resources for details
5. **Performance Analysis**: Complement the performance score with visual data

## Example Use Cases

### Finding Large Images
Look for large green rectangles in the IMAGE group - these might need compression or optimization.

### JavaScript Bundle Analysis
Check the JS group to see if you have large JavaScript files that could be code-split.

### CSS Optimization
Identify oversized CSS files that might contain unused styles.

### Overall Size Distribution
Compare group sizes to understand which type of resource dominates your page weight.

## Accessibility

- Semantic HTML with proper ARIA labels
- Keyboard navigation support (Escape to close modal)
- Color is not the only visual indicator (also uses labels and grouping)
- Tooltips provide additional context
- Modal dialogs announce content properly

## Browser Compatibility

Works in all modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- ES6 JavaScript modules
- CSS gradients and transitions

## Future Enhancements

Potential improvements that could be added:
- Zoom and pan functionality for very large datasets
- Filter by resource type
- Sort options (by size, alphabetically, etc.)
- Export treemap as image
- Custom color themes
- Comparison mode (before/after optimization)
- Hierarchical treemap with nested folders

## Performance Considerations

- Efficiently handles hundreds of resources
- Uses CSS transforms for smooth animations
- Minimal DOM manipulation
- Event delegation where possible
- Lazy rendering for large datasets (if needed in future)

---

**Created by**: Daniel Chahine  
**Date**: October 2025  
**Version**: 1.0.0
