# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step — pure vanilla JS/HTML/CSS. Serve with any static file server:

```bash
python -m http.server 8000
# or
npx http-server
```

Open `http://localhost:8000`. The JS uses ES6 modules (`type="module"`), so a server is required (file:// won't work).

For production, set `isDevelopment = false` in `src/js/utils/logger.js` to suppress console output.

## Architecture

The app is a single-page tool with no build toolchain or dependencies beyond CDN-loaded Chart.js and jsPDF.

### Data Flow

```
UIController (ui-controller.js)
  └── ResourceAnalyzer.analyze(url, progressCb, resourceCb)
        ├── URLUtils.normalizeURL()          — adds https://, resolves relative paths
        ├── ResourceFetcher.fetchHTML()      — fetches page HTML via CORS proxy
        ├── ResourceParser.collectResourceURLs() — extracts all resource URLs from HTML
        └── ResourceFetcher.fetchResourcesBatch() — parallel fetches in batches of 5, 3 concurrent
              └── sizeCache (Map) — deduplicates fetches within a session

  After analysis completes, UIController runs all display modules in sequence:
    PerformanceScorer → PerformanceScoreDisplay
    LoadTimeEstimator → LoadTimeDisplay
    OptimizationSuggester → OptimizationSuggestionsDisplay
    ResourceChartDisplay (Chart.js pie chart)
    DuplicateDetector → DuplicateDisplay
```

### Module Responsibilities

**`src/js/core/`** — pure logic, no DOM:
- `resource-analyzer.js` — orchestrates fetching and assembles the `resources[]` array
- `resource-fetcher.js` — CORS proxy rotation (8 proxies, falls back on failure), in-memory size cache, 10s timeout
- `resource-parser.js` — HTML parsing via `DOMParser`, extracts img/script/link/video/audio/font/iframe/CSS url() references
- `performance-scorer.js` — calculates 0–100 score from total size, request count, resource distribution, and compression signals
- `load-time-estimator.js` — estimates load time across 5 network profiles (3G/4G/5G/WiFi/Cable)
- `optimization-suggester.js` — generates prioritized recommendations from the resources array
- `duplicate-detector.js` — groups resources by filename to find duplicates and calculate wasted bandwidth

**`src/js/ui/`** — DOM manipulation, each display module owns its section:
- `ui-controller.js` — wires form submit, export buttons, and calls all display modules
- `results-display.js` — manages the resource table rows and stat counters
- `progress-display.js` — progress bar and time estimate
- All other `*-display.js` files — each renders its own `<div>` section in `index.html`
- `csv-exporter.js` / `pdf-exporter.js` — static export methods; pdf-exporter uses jsPDF + autotable

**`src/js/utils/`**:
- `url-utils.js` — URL normalization, filename extraction, base URL resolution
- `format-utils.js` — byte formatting (B/KB/MB)
- `logger.js` — dev/prod logging toggle (`isDevelopment` flag)

### CSS Structure

`src/css/main.css` is the entry point — it `@import`s all other CSS files. Each CSS file maps 1-to-1 with a UI section. Theme tokens are in `theme.css` (`--accent-primary`, `--font-mono`, etc.).

**Design system** (Signal Monitor aesthetic):
- Fonts: `Syne` (display/UI) + `IBM Plex Mono` (data/numbers/URLs) via Google Fonts
- Primary accent: `#e8a020` amber — used for CTAs, focus rings, progress bar, stat card left borders
- Resource type colors are distinct per type (see `theme.css` `--type-*` variables)
- Progress bar shimmer: `progressShimmer` keyframe in `base.css`

### CORS Proxy Handling

`ResourceFetcher` maintains a list of 8 CORS proxies and rotates on failure. The active proxy index persists across fetches within a session. `AllOrigins GET` requires special response parsing (returns JSON `{ contents: "..." }`) — handled via the optional `parseResponse` field on the proxy config object.

### Key Constraints

- **No bundler** — imports use relative paths with `.js` extensions; keep them that way
- **No package.json** — no npm dependencies; all third-party libs are CDN `<script>` tags in `index.html`
- The treemap feature (`treemap-display.js`, `treemap.css`) is implemented but removed from the UI — the code exists but is not rendered
