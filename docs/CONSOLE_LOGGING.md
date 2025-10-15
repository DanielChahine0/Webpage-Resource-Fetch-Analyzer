# Console Logging System

## Overview
The application includes comprehensive console logging to track the resource fetching process in real-time.

## Log Categories

| Prefix | Meaning | Use Case |
|--------|---------|----------|
| [START] | Starting process | Analysis initialization |
| [FETCH] | Fetching HTML | Main HTML fetch operations |
| [FOUND] | Resources found | Resource discovery |
| [BATCH] | Batch processing | Batch status updates |
| [RESOURCE] | Fetching resource | Individual resource fetch |
| [DIRECT] | Direct fetch | Direct fetch attempts |
| [PROXY] | Proxy fallback | Proxy service usage |
| [CACHE] | Cache hit | Cached data retrieved |
| [SUCCESS] | Success | Successful operations |
| [WAIT] | Rate limiting | Request delays |
| [RETRY] | Warning | Retry attempts |
| [ERROR] | Error | Failed operations |
| [COMPLETE] | Summary | Analysis statistics |

## Example Log Flow

```
[START] Starting analysis for: https://example.com
[FETCH] Fetching main HTML from: https://example.com
[WAIT] Rate limiting: waiting 200ms before next request
[SUCCESS] HTML fetched successfully (45.23 KB)
[FOUND] Found 25 resources to fetch
[BATCH] Processing batch of 5 resources with concurrency 3
[RESOURCE] Fetching: https://example.com/style.css
[DIRECT] Attempting direct fetch: https://example.com/style.css
[SUCCESS] Direct fetch successful: 12.45 KB
[RESOURCE] Fetching: https://cdn.example.com/image.jpg
[PROXY] Falling back to proxy for: https://cdn.example.com/image.jpg
[SUCCESS] Proxy fetch successful: 234.56 KB
[CACHE] Cache hit for: https://example.com/style.css (12.45 KB)
[COMPLETE] Analysis Complete - Total: 25 resources, 2.34 MB
```

## How to Use

1. **Open DevTools**: Press F12 in your browser
2. **Navigate to Console**: Click the Console tab
3. **Run Analysis**: Analyze any URL
4. **Watch Logs**: See real-time progress

## Filtering Logs

Use DevTools console filter to focus on specific events:
- `[SUCCESS]` - Only successes
- `[RETRY]` - Only warnings
- `[ERROR]` - Only errors
- `Cache` - Cache operations only
- `Rate limiting` - Rate limit delays only

## Implementation

The logging system is implemented in:
- `src/js/utils/logger.js` - Centralized logger utility
- `src/js/core/resource-fetcher.js` - Fetch operations logging
- `src/js/core/resource-analyzer.js` - Analysis lifecycle logging

Logging can be disabled in production by setting `isDevelopment = false` in `logger.js`.
