# Console Logging Guide

## Overview
Comprehensive console logging has been added to help track the resource fetching process in real-time. All logs use emoji prefixes for easy visual identification.

## Log Emoji Key

| Emoji | Meaning | Type |
|-------|---------|------|
| 🚀 | Starting process | Info |
| 🌐 | Fetching main HTML | Info |
| 📋 | Resources discovered | Info |
| 📦 | Batch processing | Info |
| 📥 | Fetching individual resource | Info |
| 🎯 | Direct fetch attempt | Info |
| 🔄 | Falling back to proxy | Info |
| 💾 | Cache hit | Success |
| ✅ | Successful operation | Success |
| ⏳ | Rate limiting delay | Warning |
| ⚠️ | Warning/retry | Warning |
| ⏱️ | Timeout | Warning |
| ❌ | Error | Error |
| 💀 | Failed fetch cached | Info |
| 🗑️ | Cache cleared | Info |
| 📊 | Summary statistics | Info |

## Log Flow Example

### 1. Analysis Start
```
🚀 Starting analysis for: https://example.com
🔗 Normalized URL: https://example.com/
```

### 2. HTML Fetch
```
🌐 Fetching main HTML from: https://example.com
⏳ Rate limiting: waiting 200ms before next request
✅ HTML fetched successfully (45.23 KB)
```

### 3. Resource Discovery
```
📋 Found 25 resources to fetch
```

### 4. Batch Processing
```
📦 Processing batch of 5 resources with concurrency 3
```

### 5. Individual Resource Fetch (Success - Direct)
```
📥 Fetching: https://example.com/style.css
🎯 Attempting direct fetch: https://example.com/style.css
✅ Direct fetch successful: 12.45 KB
```

### 6. Individual Resource Fetch (Success - Proxy)
```
📥 Fetching: https://cdn.example.com/image.jpg
🎯 Attempting direct fetch: https://cdn.example.com/image.jpg
⚠️ Direct fetch error: Failed to fetch - will try proxy
🔄 Falling back to proxy for: https://cdn.example.com/image.jpg
⏳ Rate limiting: waiting 100ms before next request
✅ Proxy fetch successful: 234.56 KB
```

### 7. Rate Limited (With Retry)
```
📥 Fetching: https://example.com/script.js
🎯 Attempting direct fetch: https://example.com/script.js
⚠️ Direct fetch error: Failed to fetch - will try proxy
🔄 Falling back to proxy for: https://example.com/script.js
⏳ Rate limiting: waiting 100ms before next request
⚠️ Rate limited for https://example.com/script.js..., retrying in 1000ms... (attempt 1/3)
⏳ Rate limiting: waiting 100ms before next request
✅ Proxy fetch successful: 45.67 KB
```

### 8. Failed Fetch (After Retries)
```
📥 Fetching: https://broken.example.com/missing.png
🎯 Attempting direct fetch: https://broken.example.com/missing.png
⚠️ Direct fetch failed: 404
🔄 Falling back to proxy for: https://broken.example.com/missing.png
⏳ Rate limiting: waiting 100ms before next request
⚠️ Failed to fetch https://broken.example.com/missing.png... (attempt 1/3): Not Found
⚠️ Failed to fetch https://broken.example.com/missing.png... (attempt 2/3): Not Found
❌ Failed to fetch https://broken.example.com/missing.png...: Not Found
💀 Caching failed fetch as 0 for: https://broken.example.com/missing.png...
```

### 9. Cache Hit
```
📥 Fetching: https://example.com/style.css
💾 Cache hit for: https://example.com/style.css (12.45 KB)
```

### 10. Batch Complete
```
✅ Batch complete: 4/5 resources fetched successfully
```

### 11. Analysis Complete
```
📊 Analysis Complete Summary:
   Total Resources: 23
   Total Size: 2.34 MB
   Successful Fetches: 23/26
   Failed Fetches: 3
```

### 12. Cache Clear
```
🗑️ Cache cleared (removed 23 entries)
```

## Reading the Logs

### Success Pattern
```
📥 → 🎯 → ✅  (Direct fetch successful)
📥 → 🎯 → ⚠️ → 🔄 → ⏳ → ✅  (Proxy fetch successful)
```

### Rate Limited Pattern
```
📥 → 🎯 → ⚠️ → 🔄 → ⏳ → ⚠️ (Rate limited) → ⏳ → ✅
```

### Failure Pattern
```
📥 → 🎯 → ⚠️ → 🔄 → ⏳ → ⚠️ → ⚠️ → ❌ → 💀
```

### Cache Hit Pattern
```
📥 → 💾  (Instant return)
```

## Performance Tips

### Too Many Rate Limit Warnings?
If you see many `⏳ Rate limiting` messages:
- This is normal and working as intended
- Prevents HTTP 429 errors
- Consider reducing concurrent requests if excessive

### Too Many Failed Fetches?
If you see many `❌` and `💀` messages:
- Check internet connection
- Some resources may be blocked by CORS
- Failed resources are cached to avoid retrying

### Want Quieter Logs?
Comment out specific log lines in:
- `src/js/core/resource-fetcher.js`
- `src/js/core/resource-analyzer.js`

## Debugging Scenarios

### Scenario 1: All Resources Failing
Look for:
```
⚠️ Direct fetch error: Failed to fetch
⚠️ Proxy returned status 429
```
**Solution**: Proxy is rate limiting. Wait a few minutes and try again.

### Scenario 2: Slow Performance
Look for:
```
⏳ Rate limiting: waiting XXXms before next request
```
**Solution**: This is intentional to prevent rate limits. Working as designed.

### Scenario 3: Some Resources Cached as 0
Look for:
```
💀 Caching failed fetch as 0
```
**Solution**: Resource genuinely unavailable. Clear cache and retry if needed.

## Console Commands

You can interact with the analyzer in the console:

```javascript
// Clear the cache manually
analyzer.fetcher.clearCache();

// Check cache size
analyzer.fetcher.sizeCache.size;

// View cached URLs
Array.from(analyzer.fetcher.sizeCache.keys());

// View cache statistics
console.table(
  Array.from(analyzer.fetcher.sizeCache.entries())
    .map(([url, size]) => ({ url: url.substring(0, 50), size: `${(size/1024).toFixed(2)} KB` }))
);
```

## Filtering Logs

In Chrome DevTools, you can filter logs by:
1. Click the filter icon
2. Enter emoji or text to filter:
   - `✅` - Show only successes
   - `⚠️` - Show only warnings
   - `❌` - Show only errors
   - `Rate limiting` - Show rate limiting messages
   - `Cache` - Show cache operations

## Best Practices

1. **Keep console open** during analysis for real-time feedback
2. **Look for patterns** - many similar errors indicate systematic issue
3. **Check the summary** at the end for overall statistics
4. **Use cache hits** - second analysis should be much faster
5. **Monitor rate limiting** - if excessive, consider reducing concurrency further
