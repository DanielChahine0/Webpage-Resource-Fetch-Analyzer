# Performance Score Feature

## Overview
The Performance Score Calculator provides a comprehensive 0-100 score for analyzed webpages, similar to Google Lighthouse. It helps users quickly assess overall performance quality.

## Score Categories

| Score | Category | Indicator | Meaning |
|-------|----------|-----------|---------|
| 90-100 | Excellent | 🟢 Green | Outstanding performance |
| 75-89 | Good | 🟠 Orange | Good performance, minor improvements possible |
| 50-74 | Fair | 🟧 Dark Orange | Moderate performance, improvements recommended |
| 0-49 | Poor | 🔴 Red | Significant performance issues |

## Scoring Metrics

The score is calculated using 4 weighted metrics:

### 1. Page Size Score (30% weight)
Evaluates total page size in MB:
- **Excellent**: < 500 KB
- **Good**: 500 KB - 1 MB
- **Fair**: 1 MB - 2 MB
- **Poor**: > 2 MB

### 2. Request Count Score (25% weight)
Evaluates total HTTP requests:
- **Excellent**: < 25 requests
- **Good**: 25-50 requests
- **Fair**: 50-100 requests
- **Poor**: > 100 requests

### 3. Resource Distribution Score (25% weight)
Checks for balanced resource distribution. Penalties for:
- Image-heavy pages (> 70% of total size)
- Excessive JavaScript (> 50% of total size)
- Too much CSS (> 30% of total size)
- Large individual files (> 500 KB each)

### 4. Compression/Optimization Score (20% weight)
Estimates compression effectiveness. Penalties for:
- High average file size (> 200 KB suggests poor compression)
- Unoptimized images (average image size > 500 KB)

## Visual Display

The performance score appears prominently at the top of analysis results:
- Large circular score indicator with gradient background
- Color-coded based on score category
- Category label (Excellent/Good/Fair/Poor)
- Info button (i) to toggle detailed breakdown
- Expandable section showing:
  - Individual metric scores
  - Key performance metrics
  - Number of large files
  - Total page size and request count

## Usage

1. Analyze any URL
2. View the performance score at the top of results
3. Click the info button (i) for detailed breakdown
4. Review individual metric scores and recommendations

## Implementation

The feature is implemented in:
- `src/js/core/performance-scorer.js` - Score calculation logic
- `src/js/ui/performance-score-display.js` - Visual display component
- `src/css/performance-score.css` - Styling and animations

The score is calculated after resource analysis and automatically displayed in the UI.

## Benefits

- **Quick Assessment**: Instantly understand webpage performance
- **Actionable Insights**: Detailed breakdown identifies specific issues
- **Industry Standard**: Similar to Google Lighthouse methodology
- **User-Friendly**: Visual indicators and clear categories
- **Comprehensive**: Considers multiple performance aspects
