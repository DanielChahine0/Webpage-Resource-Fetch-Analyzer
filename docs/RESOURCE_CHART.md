# Resource Type Charts - Implementation Guide

## Overview
The Resource Type Charts feature provides an interactive pie chart visualization that shows the breakdown of resources by file type (images, CSS, JavaScript, fonts, etc.). This feature helps users quickly understand the composition of their web page's resources.

## Features

### 1. **Interactive Pie Chart**
- Visual representation of resource distribution by type
- Color-coded segments for each resource type
- Smooth animations and hover effects

### 2. **Detailed Tooltips**
- Shows resource type name
- Displays total size in human-readable format
- Shows file count for that type
- Displays percentage of total resources

### 3. **Statistics Table**
- Comprehensive breakdown of each resource type
- Columns: Type, Count, Size, Percentage
- Visual indicators matching chart colors
- Percentage bars for quick comparison
- Total row summarizing all resources

### 4. **Responsive Design**
- Adapts to different screen sizes
- Grid layout on desktop (chart + table side-by-side)
- Stacked layout on mobile devices
- Touch-friendly interactions

## Technical Implementation

### File Structure
```
src/
├── js/
│   └── ui/
│       └── resource-chart-display.js  # Chart display logic
└── css/
    └── resource-chart.css             # Chart styling
```

### Resource Types
The following resource types are recognized and displayed:
- **HTML** - HTML documents (red: #e74c3c)
- **CSS** - Stylesheets (blue: #3498db)
- **JavaScript** - JS files (orange: #f39c12)
- **Images** - Image files (green: #2ecc71)
- **Fonts** - Font files (purple: #9b59b6)
- **Videos** - Video files (dark orange: #e67e22)
- **Audio** - Audio files (teal: #1abc9c)
- **Other** - Other resource types (gray: #95a5a6)

### Dependencies
- **Chart.js v4.4.0** - Chart rendering library
- Loaded from CDN: `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`

## Usage

### Programmatic Usage
```javascript
import { ResourceChartDisplay } from './src/js/ui/resource-chart-display.js';

// Display chart with resources array
ResourceChartDisplay.display(resources);

// Hide chart
ResourceChartDisplay.hide();
```

### Resource Data Format
Resources should have the following structure:
```javascript
{
    name: 'filename.ext',
    type: 'js',              // Resource type
    size: 150000,            // Size in bytes
    url: 'https://...'       // Full URL
}
```

## API Reference

### ResourceChartDisplay Class

#### Static Methods

##### `display(resources)`
Displays the resource type chart with the given resources.
- **Parameters:**
  - `resources` (Array): Array of resource objects
- **Returns:** void

##### `hide()`
Hides the chart section and destroys the chart instance.
- **Returns:** void

##### `calculateTypeStats(resources)`
Calculates statistics for each resource type.
- **Parameters:**
  - `resources` (Array): Array of resource objects
- **Returns:** Object with `stats` array and `totalSize`

##### `getTypeColor(type)`
Returns the color code for a resource type.
- **Parameters:**
  - `type` (String): Resource type
- **Returns:** String (hex color code)

##### `getTypeLabel(type)`
Returns the display label for a resource type.
- **Parameters:**
  - `type` (String): Resource type
- **Returns:** String (formatted label)

##### `createStatsTable(stats, totalSize)`
Creates and renders the statistics table.
- **Parameters:**
  - `stats` (Array): Array of type statistics
  - `totalSize` (Number): Total size of all resources
- **Returns:** void

## HTML Structure

### Chart Section
```html
<div id="resourceChartSection" class="resource-chart-section" 
     role="region" aria-label="Resource Type Chart" style="display: none;">
    <h3>Resource Type Distribution</h3>
    <div class="resource-chart-content">
        <div id="resourceChartContainer">
            <!-- Pie chart rendered here -->
        </div>
        <div id="resourceChartStats">
            <!-- Statistics table rendered here -->
        </div>
    </div>
</div>
```

## CSS Classes

### Main Classes
- `.resource-chart-section` - Main container
- `.resource-chart-content` - Grid layout container
- `.resource-chart-table` - Statistics table
- `.type-indicator` - Colored dot for type
- `.percentage-bar` - Visual percentage indicator
- `.percentage-text` - Percentage text overlay

## Chart Configuration

### Chart.js Options
```javascript
{
    type: 'pie',
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#e0e0e0',
                    usePointStyle: true
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        // Shows type, size, count, percentage
                    }
                }
            }
        }
    }
}
```

## Integration

### UI Controller Integration
The chart is automatically displayed after analysis completes:
```javascript
// In ui-controller.js handleAnalyze method
TreemapDisplay.display(this.analyzer.resources);
ResourceChartDisplay.display(this.analyzer.resources); // ← Added
DuplicateDisplay.display(duplicateAnalysis);
```

## Testing

### Test File
A test file is provided: `test-resource-chart.html`

To test:
1. Open `test-resource-chart.html` in a browser
2. View the sample chart with mock data
3. Test interactions (hover, responsive)

### Test Data
The test file includes sample resources covering all types:
- JavaScript files
- CSS files
- Images (JPG, PNG, SVG)
- HTML documents
- Fonts (WOFF2)
- Videos (MP4)
- Audio (MP3)
- Other files (JSON, XML)

## Accessibility

### ARIA Attributes
- `role="region"` - Defines chart as a region
- `aria-label` - Provides descriptive label
- `role="img"` - Canvas marked as image

### Keyboard Navigation
- Chart.js handles keyboard interactions
- Tab navigation through legend items
- Screen reader compatible tooltips

## Performance Considerations

### Chart Instance Management
- Previous chart instance destroyed before creating new one
- Prevents memory leaks
- Ensures clean state

### Rendering Optimization
- Canvas-based rendering for smooth performance
- Efficient DOM updates
- Lazy loading (only renders when section is visible)

## Browser Compatibility

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Fallbacks
- Graceful degradation if Chart.js fails to load
- Statistics table still displays without chart
- Console warnings for debugging

## Customization

### Changing Colors
Edit the `getTypeColor()` method in `resource-chart-display.js`:
```javascript
static getTypeColor(type) {
    const colors = {
        'html': '#yourcolor',
        // ... more colors
    };
    return colors[type] || colors['other'];
}
```

### Adding New Types
1. Add type to `getFileType()` in `url-utils.js`
2. Add color in `getTypeColor()`
3. Add label in `getTypeLabel()`

### Styling Adjustments
Modify `resource-chart.css` for:
- Layout changes
- Color adjustments
- Spacing modifications
- Responsive breakpoints

## Troubleshooting

### Chart Not Displaying
1. Check if Chart.js is loaded: `console.log(typeof Chart)`
2. Verify resources array is not empty
3. Check browser console for errors
4. Ensure CSS is properly imported

### Incorrect Colors/Types
1. Verify resource types in data
2. Check `getFileType()` in `url-utils.js`
3. Ensure color mappings are correct

### Performance Issues
1. Limit chart animations for large datasets
2. Consider pagination for tables
3. Use `maintainAspectRatio: false` for fixed sizes

## Future Enhancements

### Potential Features
- [ ] Multiple chart types (bar, doughnut)
- [ ] Export chart as image
- [ ] Comparison with historical data
- [ ] Custom color themes
- [ ] Filtering by resource type
- [ ] Click to show/hide types
- [ ] Animation controls
- [ ] Data labels on chart

## Credits
- Chart rendering: Chart.js v4
- Created by: Daniel Chahine
- Date: October 2025

## Related Documentation
- See also: `TREEMAP_VISUALIZATION.md`
- See also: `PERFORMANCE_SCORE.md`
- See also: `PROJECT_STRUCTURE.md`
