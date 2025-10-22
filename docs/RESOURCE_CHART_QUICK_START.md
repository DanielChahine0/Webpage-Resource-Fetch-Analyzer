# Resource Type Charts - Quick Start Guide

## What is it?
An interactive pie chart that shows the breakdown of your webpage's resources by file type (images, CSS, JavaScript, fonts, videos, etc.) with detailed statistics.

## Quick Features
✅ **Interactive Pie Chart** - Visual breakdown by resource type  
✅ **Hover Tooltips** - Size, count, and percentage on hover  
✅ **Statistics Table** - Detailed breakdown with percentages  
✅ **Color-Coded** - Each type has its own color  
✅ **Responsive** - Works on all screen sizes  

## How to Use

### For Users
1. Enter a URL and click "Analyze"
2. Wait for the analysis to complete
3. Scroll down to see the **Resource Type Distribution** chart
4. **Hover** over chart segments to see detailed info
5. View the statistics table for complete breakdown

### For Developers

#### Basic Usage
```javascript
import { ResourceChartDisplay } from './src/js/ui/resource-chart-display.js';

// Display chart
ResourceChartDisplay.display(resourcesArray);
```

#### Hide Chart
```javascript
ResourceChartDisplay.hide();
```

## Resource Types & Colors

| Type       | Color      | Description        |
|------------|------------|--------------------|
| HTML       | 🔴 Red     | HTML documents     |
| CSS        | 🔵 Blue    | Stylesheets        |
| JavaScript | 🟠 Orange  | JS files           |
| Images     | 🟢 Green   | Image files        |
| Fonts      | 🟣 Purple  | Font files         |
| Videos     | 🟤 Brown   | Video files        |
| Audio      | 🩵 Teal    | Audio files        |
| Other      | ⚪ Gray    | Other file types   |

## What Information is Shown?

### In the Chart
- Visual proportion of each resource type
- Color-coded segments
- Legend at the bottom

### In Tooltips (on hover)
- Resource type name
- Total size (e.g., "2.5 MB")
- File count (e.g., "12 files")
- Percentage (e.g., "35.2%")

### In the Statistics Table
- Type with color indicator
- File count
- Total size
- Percentage bar with text
- Total row at the bottom

## Example Output

```
Resource Type Distribution
┌─────────────────────────────────┐
│     [Interactive Pie Chart]     │
│                                 │
│  Legend: HTML CSS JS Images etc │
└─────────────────────────────────┘

Resource Type Breakdown
┌──────────┬───────┬────────┬─────────────┐
│ Type     │ Count │ Size   │ Percentage  │
├──────────┼───────┼────────┼─────────────┤
│ ● Images │   25  │ 3.2 MB │ ████ 42.1% │
│ ● JS     │   18  │ 1.8 MB │ ███  23.4% │
│ ● CSS    │    8  │ 850 KB │ ██   11.2% │
│ ● Fonts  │    4  │ 620 KB │ █     8.1% │
│ ● HTML   │    3  │ 450 KB │ █     5.9% │
│ ● Videos │    2  │ 650 KB │ █     8.5% │
│ ● Other  │    6  │  60 KB │ ▌     0.8% │
├──────────┼───────┼────────┼─────────────┤
│ Total    │   66  │ 7.6 MB │    100.0%  │
└──────────┴───────┴────────┴─────────────┘
```

## Testing the Feature

1. Open `test-resource-chart.html` in your browser
2. See the chart with sample data
3. Try hovering over different segments
4. Resize the window to test responsiveness

## Common Questions

### Q: Why is my chart not showing?
**A:** Ensure the analysis has completed and resources were found.

### Q: Can I export the chart?
**A:** Currently, the chart is included in PDF exports. Image export coming soon!

### Q: Why are some types grouped as "Other"?
**A:** Resource types that don't fit standard categories (JSON, XML, etc.) are grouped as "Other".

### Q: The colors don't match my theme?
**A:** You can customize colors in `resource-chart-display.js` → `getTypeColor()` method.

### Q: Can I hide certain resource types?
**A:** This feature is planned for future updates. For now, all types are shown.

## Tips for Best Results

1. **Analyze complete pages** - Partial pages may show skewed results
2. **Check large segments** - Hover to identify optimization opportunities
3. **Compare runs** - Analyze before/after optimization changes
4. **Use with other features** - Combine with Performance Score and Optimization Suggestions

## Related Features

- **Performance Score** - Overall page performance rating
- **Treemap Visualization** - Individual file size visualization
- **Optimization Suggestions** - Recommendations based on analysis
- **Load Time Estimates** - Expected load times for different connections

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Chart not visible | Wait for analysis to complete |
| No tooltips | Ensure JavaScript is enabled |
| Wrong colors | Check browser console for errors |
| Table not showing | Refresh page and try again |

## Integration Checklist

- [x] Chart.js library added to HTML
- [x] CSS file imported in main.css
- [x] ResourceChartDisplay imported in ui-controller.js
- [x] display() called after analysis completes
- [x] HTML section added to index.html

## Support

For issues or questions:
1. Check browser console for errors
2. Review `RESOURCE_CHART.md` for detailed documentation
3. Test with `test-resource-chart.html`
4. Check that Chart.js is loading correctly

## Next Steps

After implementing the chart:
1. Test with real websites
2. Check mobile responsiveness
3. Verify PDF export includes chart data
4. Consider adding export chart as image feature

---

**Created by:** Daniel Chahine  
**Version:** 1.0  
**Last Updated:** October 2025
