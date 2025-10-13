# Quick Start Guide - Performance Score Feature

## How to Test the New Performance Score Calculator

### 1. Open the Application
- Double-click `index.html` to open it in your web browser
- Or right-click → "Open with" → Choose your preferred browser

### 2. Analyze a Webpage
Try these test URLs to see different performance scores:

#### Fast Website (Expected Score: 85-95)
```
example.com
```

#### Medium Website (Expected Score: 60-80)
```
github.com
```

#### Heavy Website (Expected Score: 40-60)
```
cnn.com
```

### 3. View Performance Score
After analysis completes, you'll see:
- A large circular score indicator at the top
- Color coding based on performance:
  - **Green** = Excellent (90-100)
  - **Orange** = Good (75-89)
  - **Dark Orange** = Fair (50-74)
  - **Red** = Poor (0-49)

### 4. View Detailed Breakdown
- Click the **ℹ️** info button to expand/collapse details
- See individual metric scores:
  - Page Size Score
  - Request Count Score
  - Resource Distribution Score
  - Compression/Optimization Score
- View key metrics like total size, request count, and large files

### 5. Understanding the Scores

#### Page Size (30% of total score)
- Measures total page weight
- Lighter pages score higher

#### Request Count (25% of total score)
- Measures number of HTTP requests
- Fewer requests score higher

#### Resource Distribution (25% of total score)
- Evaluates balance of resource types
- Well-distributed resources score higher
- Penalties for too many images or JS files

#### Compression/Optimization (20% of total score)
- Estimates how well resources are optimized
- Smaller average file sizes score higher

## What to Look For

### Excellent Score (90-100) ✅
- Total size < 500 KB
- Less than 25 requests
- Well-optimized images
- Balanced resource distribution

### Good Score (75-89) 👍
- Total size < 1 MB
- Less than 50 requests
- Some optimization opportunities
- Generally good distribution

### Fair Score (50-74) ⚠️
- Total size 1-2 MB
- 50-100 requests
- Multiple optimization opportunities
- May have large files

### Poor Score (0-49) ❌
- Total size > 2 MB
- More than 100 requests
- Many large unoptimized files
- Poor resource distribution

## Tips for Testing

1. **Test multiple websites** to see how scores vary
2. **Click the info button** to understand which metrics affect the score
3. **Compare similar websites** to see optimization differences
4. **Look for patterns** - heavy news sites typically score lower than simple pages

## Troubleshooting

### Score not appearing
- Make sure analysis completed successfully
- Check browser console for errors (F12)
- Try refreshing the page

### Wrong scores
- Some websites may block the CORS proxy
- Very large sites may timeout on some resources
- This affects the calculation accuracy

## Next Steps

After testing, you can:
- Export results to CSV (including score data in future update)
- Analyze multiple pages and compare scores
- Use insights to optimize your own websites

## Need Help?

If you encounter issues:
1. Check the browser console (F12) for errors
2. Verify the URL is accessible
3. Try a different website
4. Refresh the page and try again

---

**Created by Daniel Chahine**
Performance Score Calculator v1.0
