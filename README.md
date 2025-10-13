# 🔍 Webpage Resource Fetch Analyzer

A web-based tool that analyzes and measures all resources loaded by a webpage, including HTML, CSS, JavaScript, images, videos, audio files, and more. This is a JavaScript/HTML conversion of the original Java Assignment1 project.

## ⚡ Performance

**Optimized for Speed**: Uses parallel fetching, caching, and timeout protection to analyze websites **5-10x faster** than sequential approaches. See [OPTIMIZATIONS.md](OPTIMIZATIONS.md) for details.

## 📋 Features

- **Performance Score Calculator**: Get an overall performance score (0-100) similar to Google Lighthouse
  - Analyzes page size, request count, resource distribution, and compression
  - Color-coded indicators (Excellent/Good/Fair/Poor)
  - Detailed breakdown of individual metrics
  - Actionable insights for optimization
- **URL Analysis**: Input any webpage URL and analyze all its resources
- **Fast Parallel Fetching**: Downloads up to 10 resources simultaneously
- **Smart Caching**: Avoids re-downloading duplicate resources
- **Dynamic Loading**: See results appear in real-time with progress tracking
- **Resource Detection**: Automatically detects and extracts:
  - Images (including lazy-loaded with `data-src` and `srcset`)
  - Stylesheets (CSS files)
  - JavaScript files
  - Video and audio files
  - Fonts
  - Iframes, embeds, and objects
  - Resources in inline styles and `<style>` blocks
- **Size Calculation**: Fetches and calculates the size of each resource
- **Dark Theme UI**: Clean, modern interface that's easy on the eyes
- **Export Functionality**: Export analysis results to CSV format
- **Statistics Dashboard**: View total files, total size, and main HTML size at a glance
- **Timeout Protection**: 10-second timeout prevents hanging on slow resources

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CORS proxy and resource fetching)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/DanielChahine0/Webpage-Resource-Fetch-Analyzer.git
   cd Webpage-Resource-Fetch-Analyzer
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" → your browser, or
   - Use a local server (recommended):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server
     ```

3. Visit `http://localhost:8000` (if using a local server)

## 📖 Usage

1. Enter a URL in the input field (e.g., `https://example.com` or just `example.com`)
2. Click the "Analyze" button
3. Wait for the analysis to complete
4. View the results including:
   - Total number of files
   - Total size of all resources
   - Main HTML file size
   - Detailed table of all resources with their names, types, sizes, and URLs
5. Export results to CSV using the "Export CSV" button

### Example URLs to Try

- `https://en.wikipedia.org/wiki/MP3`
- `https://www.york.ca`
- `https://example.com`
- `130.63.236.137` (IPv4 addresses supported)

## 🛠️ Technical Details

### Files Structure

- `index.html` - Main HTML structure and layout
- `styles.css` - Styling and responsive design
- `script.js` - Core functionality and resource analysis logic

### Key Features Implementation

#### URL Normalization
- Automatically adds `https://` if no protocol is specified
- Converts `http://` to `https://` for better security
- Handles IPv4 addresses with reverse DNS lookup considerations

#### Resource Collection
The analyzer extracts resources from:
- `<img>` tags (including `data-src` and `srcset` attributes)
- `<script>` tags with `src` attributes
- `<link>` tags (stylesheets and icons)
- `<video>`, `<audio>`, and `<source>` tags
- `<iframe>`, `<embed>`, and `<object>` tags
- CSS `url()` references in `<style>` blocks
- Inline `style` attributes with background images

#### CORS Handling
Due to browser security restrictions, this tool uses the [AllOrigins](https://allorigins.win/) CORS proxy service to fetch remote resources. This means:
- Some websites may not be accessible due to their own restrictions
- Fetching may be slower than direct access
- Large resources may take time to download

### Comparison with Java Version

This web implementation mirrors the functionality of the original Java code:

| Java Implementation | Web Implementation |
|---------------------|-------------------|
| `normalizeURL()` | `normalizeURL()` |
| `collectResourceUrls()` | `collectResourceURLs()` |
| `fetchSize()` | `fetchResourceSize()` |
| `getBytes()` | `fetchHTML()` |
| `fileNameFromUrl()` | `getFileName()` |
| `extractUrlsFromCss()` | `extractUrlsFromCSS()` |
| HttpURLConnection | Fetch API with CORS proxy |

## ⚠️ Limitations

1. **CORS Restrictions**: Some websites may block cross-origin requests
2. **Proxy Dependency**: Relies on AllOrigins proxy service availability
3. **Size Accuracy**: Some dynamic or protected resources may not be fetchable
4. **Performance**: Larger sites with many resources may take time to analyze


## 🙏 Acknowledgments

- Original Java implementation concepts and algorithms
- [AllOrigins](https://allorigins.win/) for CORS proxy service
A tool that fetches a webpage, identifies all embedded resources (images, scripts, stylesheets, etc.), and calculates their individual and total sizes. Handles redirects, IPv4 normalization, and HTTPS certificate mismatches for accurate web resource analysis.
