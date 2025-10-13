# Proxy Services and Rate Limiting

## Overview
The application uses CORS proxy services to fetch resources from cross-origin URLs. It includes intelligent fallback, rate limiting, and error handling to ensure reliable operation.

## Proxy Services (Priority Order)

The app tries these proxies sequentially until one succeeds:

1. **CORS Proxy** (corsproxy.io) - Most reliable, default starting point
2. **CORS.SH** - Fast alternative
3. **AllOrigins GET** - Reliable, returns JSON response
4. **AllOrigins RAW** - Original option
5. **Proxy.CORS.SH** - Backup option
6. **API CORS Proxy** (codetabs.com) - Established service
7. **ThingProxy** - Often down but worth trying
8. **CORS Anywhere** - Requires manual access request

## Key Features

### 1. Smart Fallback System
- Automatically tries next proxy if current one fails
- 15-second timeout per proxy attempt
- Tracks errors for detailed user feedback
- Logs all attempts to console for debugging

### 2. Rate Limiting
- **100ms delay** between proxy requests (default)
- **200ms delay** for HTML fetches (longer delay)
- Prevents hitting proxy service rate limits
- Exponential backoff for 429 errors: 1s, 2s, 4s (max 5s)

### 3. Direct Fetch First
- Attempts direct HEAD request before using proxy
- Works for same-origin or CORS-enabled resources
- Reduces load on proxy services
- Faster for compatible resources

### 4. Retry Logic
- Up to 2 retries per resource (3 total attempts)
- Exponential backoff for rate limit errors (429)
- Linear backoff (500ms) for other failures
- Caches failed fetches as 0 to avoid re-trying

### 5. Concurrency Control
- **3 concurrent requests** maximum (reduced from 10)
- **5 resources per batch** (reduced from 10)
- Gentler on proxy services
- More reliable overall

## Troubleshooting

### "All proxy services failed" Error

This occurs when all proxies fail. Common causes:
- **Service outages** - Proxies are temporarily down
- **Rate limiting** - Too many requests
- **Website blocking** - Target site blocks known proxy IPs
- **Network issues** - Connectivity problems

**Solutions:**
1. **Wait 2-5 minutes** and retry (simplest)
2. **Try different URLs** - Start with `https://example.com`
3. **Check internet connection** - Verify connectivity
4. **Clear browser cache** - Hard reload (Ctrl+F5)
5. **Check console** - Open DevTools (F12) for detailed errors

### Recommended Test URLs

**Usually work:**
- `https://example.com` - Lightweight, fast
- `https://httpbin.org/html` - Made for testing
- `https://www.wikipedia.org` - Lots of resources
- `http://info.cern.ch` - First website ever

**May have issues:**
- `https://github.com` - Anti-bot protection
- `https://google.com` - Blocks most proxies
- `https://facebook.com` - Strict CORS policies

### Error Patterns

**"Failed to fetch"**
- Network connectivity issue or proxy completely down

**"403 Forbidden"**
- Blocked by proxy or target website

**"429 Too Many Requests"**
- Rate limit hit, automatic retry with backoff

**"Timeout"**
- Proxy took too long (>15 seconds)

## Implementation

The proxy system is implemented in:
- `src/js/core/resource-fetcher.js` - Core proxy logic
- `src/js/ui/error-display.js` - Error message formatting
- `src/js/ui/progress-display.js` - Proxy status display

## Configuration

Key parameters in `resource-fetcher.js`:
```javascript
this.minRequestDelay = 100;        // Delay between requests (ms)
this.concurrency = 3;               // Max concurrent requests
const timeout = 15000;              // Proxy timeout (ms)
const retries = 2;                  // Max retry attempts
```

## Best Practices

1. **Start with simple URLs** like `example.com` to test
2. **Monitor console logs** to see which proxy is working
3. **Be patient** with rate limits - delays are intentional
4. **Avoid rapid re-analysis** of the same URL
5. **Clear cache** if experiencing persistent issues

## Advanced: CORS Anywhere Access

For the CORS Anywhere proxy (rarely needed):
1. Visit: `https://cors-anywhere.herokuapp.com/corsdemo`
2. Click "Request temporary access to the demo server"
3. Access granted for 2 hours
4. Try your request again
