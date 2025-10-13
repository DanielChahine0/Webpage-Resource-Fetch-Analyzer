# Rate Limiting Fix

## Problem
The application was hitting HTTP 429 "Too Many Requests" errors when using the `api.allorigins.win` CORS proxy. This happened because:
- Too many concurrent requests (10 at a time)
- No delay between requests
- No retry logic for rate-limited requests
- Large batch sizes (10 resources per batch)

## Solution Implemented

### 1. Request Rate Limiting
- Added `minRequestDelay` of 100ms between proxy requests
- Added `addDelay()` method to enforce minimum time between requests
- Tracks `lastRequestTime` to calculate delays

### 2. Direct Fetch First Strategy
- Attempts direct `HEAD` request before using proxy
- Many resources (same-origin or CORS-enabled) can be fetched directly
- Reduces load on the proxy service
- Faster for resources that don't need proxy

### 3. Retry Logic with Exponential Backoff
- Retries up to 2 times on failure
- Exponential backoff for 429 errors: 1s, 2s, 4s (max 5s)
- Regular 500ms delays for other failures
- Logs retry attempts for debugging

### 4. Reduced Concurrency
- Changed from 10 to **3 concurrent requests**
- Reduced batch size from 10 to **5 resources per batch**
- Much gentler on the proxy service

## Technical Changes

### resource-fetcher.js
```javascript
// New properties
this.lastRequestTime = 0;
this.minRequestDelay = 100; // ms

// New methods
async addDelay(ms = this.minRequestDelay)
async tryDirectFetch(url, timeout = 5000)

// Updated method
async fetchResourceSize(url, timeout = 10000, retries = 2)
```

### resource-analyzer.js
```javascript
const batchSize = 5; // Reduced from 10
const batchResults = await this.fetcher.fetchResourcesBatch(batch, 3); // Reduced from 10
```

## Expected Results
- **Fewer rate limit errors**: Requests are spaced out properly
- **Better success rate**: Retry logic handles temporary failures
- **Faster for some resources**: Direct fetch bypasses proxy when possible
- **More reliable**: Exponential backoff prevents cascading failures

## Performance Notes
- Analysis will take slightly longer due to reduced concurrency
- Trade-off: reliability vs speed
- Most users won't notice the difference
- Resources that allow CORS will be faster (direct fetch)

## Future Improvements
Consider:
1. Alternative CORS proxies as fallbacks
2. User-configurable concurrency settings
3. Progressive enhancement (try fastest method first)
4. Local caching across sessions
