# Webpage Resource Fetch Analyzer

A web-based tool that analyzes and measures all resources loaded by a webpage, including HTML, CSS, JavaScript, images, videos, audio files, and more. This is a JavaScript/HTML conversion of the original Java Assignment1 project.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deployment Ready](https://img.shields.io/badge/deployment-ready-brightgreen.svg)](DEPLOYMENT.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/DanielChahine0/Webpage-Resource-Fetch-Analyzer/pulls)

## Live Demo

> 🚀 **Ready to deploy!** See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions to GitHub Pages, Netlify, Vercel, and more.

## Performance

**Optimized for Speed**: Uses parallel fetching, caching, and timeout protection to analyze websites **5-10x faster** than sequential approaches.

## Features

- **Performance Score Calculator**: Get an overall performance score (0-100) similar to Google Lighthouse
  - Analyzes page size, request count, resource distribution, and compression
  - Color-coded indicators (Excellent/Good/Fair/Poor)
  - Detailed breakdown of individual metrics
  - Actionable insights for optimization
- **Load Time Estimation**: See estimated load times across different network connections
  - 5 network profiles: 3G, 4G/LTE, 5G, WiFi, and Cable/Fiber
  - Detailed breakdown: latency, download time, and parse/render time
  - Speed categories with visual indicators
  - Considers parallel connections and resource prioritization
- **Treemap Visualization**: Interactive visual representation of resource sizes
  - Size-proportional rectangles for each resource
  - Color-coded by resource type (HTML, CSS, JS, Images, etc.)
  - Grouped by type with total size and file count
  - Click resources for detailed information
  - Toggle between grouped and flat views
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
- **Export Functionality**: 
  - Export analysis results to CSV format (includes load time estimates)
  - **NEW!** Generate comprehensive PDF reports with charts, recommendations, and professional formatting
- **Statistics Dashboard**: View total files, total size, and main HTML size at a glance
- **Timeout Protection**: 10-second timeout prevents hanging on slow resources

## Getting Started

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

## Usage

1. Enter a URL in the input field (e.g., `https://example.com` or just `example.com`)
2. Click the "Analyze" button
3. Wait for the analysis to complete
4. View the results including:
   - Overall performance score with detailed breakdown
   - Load time estimates for different network speeds
   - Interactive treemap visualization
   - Total number of files
   - Total size of all resources
   - Main HTML file size
   - Detailed table of all resources with their names, types, sizes, and URLs
5. Export results:
   - **CSV Export**: Click "📊 Export CSV" for spreadsheet-compatible data
   - **PDF Report**: Click "📄 Export PDF Report" for comprehensive analysis reports with charts and recommendations

### Example URLs to Try

- `https://en.wikipedia.org/wiki/MP3`
- `https://www.york.ca`
- `https://example.com`
- `130.63.236.137` (IPv4 addresses supported)

## Technical Details

### Project Structure

The project uses a modern, modular architecture for better maintainability:

```
Webpage-Resource-Fetch-Analyzer/
├── index.html                 # Main HTML entry point
├── README.md                  # This file
├── src/
│   ├── js/                    # JavaScript modules (ES6)
│   │   ├── app.js             # Application entry point
│   │   ├── core/              # Core business logic
│   │   │   ├── resource-analyzer.js
│   │   │   ├── resource-parser.js
│   │   │   ├── resource-fetcher.js
│   │   │   └── performance-scorer.js
│   │   ├── ui/                # UI components
│   │   │   ├── ui-controller.js
│   │   │   ├── progress-display.js
│   │   │   ├── results-display.js
│   │   │   ├── performance-score-display.js
│   │   │   ├── error-display.js
│   │   │   ├── loading-display.js
│   │   │   ├── csv-exporter.js
│   │   │   └── pdf-exporter.js   # NEW: PDF report generation
│   │   └── utils/             # Utility functions
│   │       ├── url-utils.js
│   │       └── format-utils.js
│   └── css/                   # CSS modules
│       ├── main.css           # CSS entry point
│       ├── base.css
│       ├── layout.css
│       ├── input-form.css
│       ├── progress.css
│       ├── performance-score.css
│       ├── results.css
│       ├── table.css
│       ├── error.css
│       └── responsive.css
├── docs/                      # Documentation
│   ├── PROJECT_STRUCTURE.md  # Detailed architecture guide
│   └── [other documentation files]
└── assets/                    # Static assets

```

For detailed information about the architecture, see [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md).

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

## Deployment

This application is **production-ready** and can be deployed to various platforms:

- **GitHub Pages** - Free and automatic (recommended)
- **Netlify** - One-click deployment
- **Vercel** - Instant global deployment
- **Cloudflare Pages** - Fast CDN
- **Traditional hosting** - Upload via FTP

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed deployment instructions.

### Quick Deploy

1. **Prepare for production**:
   ```powershell
   .\prepare-deploy.ps1
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Done! Site will be live at `https://yourusername.github.io/repo-name/`

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for all platforms
- **[BUILD.md](BUILD.md)** - Build and optimization instructions
- **[docs/PDF_EXPORT.md](docs/PDF_EXPORT.md)** - PDF report generation feature guide
- **[docs/PDF_EXPORT_QUICK_START.md](docs/PDF_EXPORT_QUICK_START.md)** - Quick start for PDF reports
- **[docs/](docs/)** - Additional technical documentation

## Technologies Used

- **Vanilla JavaScript (ES6+)** - No frameworks, pure performance
- **CSS3** - Modern responsive design
- **Fetch API** - Async resource fetching
- **ES6 Modules** - Clean, modular architecture

## Acknowledgments

- Original Java implementation concepts and algorithms
- [AllOrigins](https://allorigins.win/) for CORS proxy service

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Daniel Chahine**
- GitHub: [@DanielChahine0](https://github.com/DanielChahine0)

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Show your support

Give a ⭐ if this project helped you!
