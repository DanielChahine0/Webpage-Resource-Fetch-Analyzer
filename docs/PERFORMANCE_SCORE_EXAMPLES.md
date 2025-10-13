# Performance Score Examples

## Visual Guide to Performance Scores

### Excellent Score (90-100) 🟢
```
┌─────────────────────────────────────┐
│    ⚡ Performance Score      ℹ️    │
├─────────────────────────────────────┤
│                                     │
│          ╭───────────╮              │
│         ╱   ██████   ╲             │
│        │   ███  ███   │            │
│        │   ███  ███   │            │
│        │      95      │  GREEN     │
│        │   EXCELLENT  │            │
│        │   ███  ███   │            │
│         ╲   ██████   ╱             │
│          ╰───────────╯              │
│                                     │
│  Score Breakdown:                   │
│  📦 Page Size (30%):        98/100  │
│  🔢 Request Count (25%):    95/100  │
│  📊 Resource Distribution:  90/100  │
│  🗜️ Compression (20%):      92/100  │
│                                     │
│  Metrics:                           │
│  Total Size: 0.45 MB                │
│  Total Requests: 18                 │
│  Large Files (>500KB): 0            │
└─────────────────────────────────────┘
```
**What this means:** Outstanding performance! Fast loading, minimal requests, well-optimized.

---

### Good Score (75-89) 🟠
```
┌─────────────────────────────────────┐
│    ⚡ Performance Score      ℹ️    │
├─────────────────────────────────────┤
│                                     │
│          ╭───────────╮              │
│         ╱   ██████   ╲             │
│        │   ███  ███   │            │
│        │   ███  ███   │            │
│        │      82      │  ORANGE    │
│        │     GOOD     │            │
│        │   ███  ███   │            │
│         ╲   ██████   ╱             │
│          ╰───────────╯              │
│                                     │
│  Score Breakdown:                   │
│  📦 Page Size (30%):        85/100  │
│  🔢 Request Count (25%):    80/100  │
│  📊 Resource Distribution:  78/100  │
│  🗜️ Compression (20%):      85/100  │
│                                     │
│  Metrics:                           │
│  Total Size: 0.82 MB                │
│  Total Requests: 38                 │
│  Large Files (>500KB): 1            │
└─────────────────────────────────────┘
```
**What this means:** Good performance with minor optimization opportunities.

---

### Fair Score (50-74) 🟧
```
┌─────────────────────────────────────┐
│    ⚡ Performance Score      ℹ️    │
├─────────────────────────────────────┤
│                                     │
│          ╭───────────╮              │
│         ╱   ██████   ╲             │
│        │   ███  ███   │            │
│        │   ███  ███   │            │
│        │      63      │  DARK ORG  │
│        │     FAIR     │            │
│        │   ███  ███   │            │
│         ╲   ██████   ╱             │
│          ╰───────────╯              │
│                                     │
│  Score Breakdown:                   │
│  📦 Page Size (30%):        65/100  │
│  🔢 Request Count (25%):    58/100  │
│  📊 Resource Distribution:  60/100  │
│  🗜️ Compression (20%):      70/100  │
│                                     │
│  Metrics:                           │
│  Total Size: 1.65 MB                │
│  Total Requests: 78                 │
│  Large Files (>500KB): 4            │
└─────────────────────────────────────┘
```
**What this means:** Moderate performance. Consider optimization for better UX.

---

### Poor Score (0-49) 🔴
```
┌─────────────────────────────────────┐
│    ⚡ Performance Score      ℹ️    │
├─────────────────────────────────────┤
│                                     │
│          ╭───────────╮              │
│         ╱   ██████   ╲             │
│        │   ███  ███   │            │
│        │   ███  ███   │            │
│        │      38      │   RED      │
│        │     POOR     │            │
│        │   ███  ███   │            │
│         ╲   ██████   ╱             │
│          ╰───────────╯              │
│                                     │
│  Score Breakdown:                   │
│  📦 Page Size (30%):        35/100  │
│  🔢 Request Count (25%):    30/100  │
│  📊 Resource Distribution:  45/100  │
│  🗜️ Compression (20%):      40/100  │
│                                     │
│  Metrics:                           │
│  Total Size: 4.82 MB                │
│  Total Requests: 145                │
│  Large Files (>500KB): 12           │
└─────────────────────────────────────┘
```
**What this means:** Significant performance issues. Optimization strongly recommended.

---

## Score Components Explained

### 📦 Page Size (30% weight)
- **Impact:** Most important factor
- **Target:** < 500 KB for excellent score
- **Why it matters:** Smaller pages load faster, use less data

### 🔢 Request Count (25% weight)
- **Impact:** High importance
- **Target:** < 25 requests for excellent score
- **Why it matters:** Each request adds latency

### 📊 Resource Distribution (25% weight)
- **Impact:** High importance
- **Target:** Balanced mix of resources
- **Why it matters:** Heavy images or JS hurt performance

### 🗜️ Compression/Optimization (20% weight)
- **Impact:** Moderate importance
- **Target:** Small average file size
- **Why it matters:** Indicates proper compression and minification

---

## How to Improve Your Score

### If Page Size is Low:
- ✅ Compress images (use WebP, optimize JPEGs)
- ✅ Minify CSS and JavaScript
- ✅ Remove unused code
- ✅ Use lazy loading for images

### If Request Count is Low:
- ✅ Combine CSS files
- ✅ Combine JavaScript files
- ✅ Use CSS sprites for small images
- ✅ Inline critical CSS

### If Resource Distribution is Low:
- ✅ Optimize large images
- ✅ Split large JavaScript bundles
- ✅ Remove duplicate resources
- ✅ Use CDNs for common libraries

### If Compression Score is Low:
- ✅ Enable gzip/brotli compression
- ✅ Optimize image formats
- ✅ Minify all text-based resources
- ✅ Use modern formats (WebP, AVIF)

---

## Real-World Score Examples

| Website Type | Typical Score | Characteristics |
|-------------|---------------|-----------------|
| Personal Blog | 85-95 | Small, minimal assets |
| News Website | 45-65 | Many ads, heavy images |
| E-commerce | 60-75 | Product images, scripts |
| Corporate Site | 70-85 | Professional, optimized |
| Landing Page | 80-95 | Single page, focused |
| Web App | 55-70 | Heavy JavaScript |

---

**Note:** Scores are calculated based on the fetched resources and may vary depending on:
- Network conditions
- CORS proxy availability
- Resource accessibility
- Dynamic content loading
