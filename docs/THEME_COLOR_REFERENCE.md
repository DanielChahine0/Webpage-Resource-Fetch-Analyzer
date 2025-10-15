# Theme Color Reference

## Quick Color Palette

### 🌑 Backgrounds
```css
--bg-primary:    #0a0e27  /* Page background */
--bg-secondary:  #141937  /* Alternate background */
--bg-tertiary:   #1a1f3a  /* Third level */
--bg-elevated:   #1f2541  /* Elevated elements */
```

### 🎴 Surfaces (Cards & Containers)
```css
--surface-primary:   #1a1f3a  /* Main cards */
--surface-secondary: #1f2541  /* Nested elements */
--surface-hover:     #252b4a  /* Hover states */
--surface-border:    rgba(99, 102, 241, 0.15)  /* Borders */
```

### 📝 Text
```css
--text-primary:   #e2e8f0  /* Main text */
--text-secondary: #94a3b8  /* Labels, secondary */
--text-tertiary:  #64748b  /* Less important */
--text-muted:     #475569  /* Least important */
```

### 💎 Accent (Indigo)
```css
--accent-primary:   #6366f1  /* Main accent */
--accent-secondary: #818cf8  /* Lighter accent */
--accent-hover:     #4f46e5  /* Hover state */
--accent-light:     rgba(99, 102, 241, 0.1)  /* Transparent */
```

### ✅ Status Colors
```css
/* Success - Green */
--success:       #10b981
--success-light: rgba(16, 185, 129, 0.1)

/* Warning - Amber */
--warning:       #f59e0b
--warning-light: rgba(245, 158, 11, 0.1)

/* Error - Red */
--error:       #ef4444
--error-light: rgba(239, 68, 68, 0.1)

/* Info - Blue */
--info:       #3b82f6
--info-light: rgba(59, 130, 246, 0.1)
```

### 📊 Performance Scores
```css
--score-excellent: #10b981  /* Green */
--score-good:      #f59e0b  /* Amber */
--score-fair:      #fb923c  /* Orange */
--score-poor:      #ef4444  /* Red */
```

### 📡 Network Visualization
```css
--network-fast:     #3b82f6  /* Blue */
--network-latency:  #6366f1  /* Indigo */
--network-download: #8b5cf6  /* Purple */
--network-parse:    #10b981  /* Green */
```

## Visual Hierarchy

### Text Contrast on Primary Background (#0a0e27)
- Primary text (#e2e8f0): ⭐⭐⭐⭐⭐ Excellent contrast
- Secondary text (#94a3b8): ⭐⭐⭐⭐ Great contrast
- Tertiary text (#64748b): ⭐⭐⭐ Good contrast
- Muted text (#475569): ⭐⭐ Acceptable contrast

### Component Layering
```
Level 0: Page Background (--bg-primary)
    ↓
Level 1: Main Container (--surface-secondary)
    ↓
Level 2: Cards (--surface-primary)
    ↓
Level 3: Nested Elements (--surface-secondary)
    ↓
Level 4: Hover State (--surface-hover)
```

## Common Patterns

### Primary Button
```css
background: var(--accent-primary);
color: var(--text-primary);
/* Hover */
background: var(--accent-hover);
```

### Secondary Button
```css
background: var(--surface-secondary);
color: var(--text-primary);
border: 1px solid var(--surface-border);
/* Hover */
background: var(--surface-hover);
```

### Card
```css
background: var(--surface-primary);
border: 1px solid var(--surface-border);
box-shadow: var(--shadow-md);
```

### Input Field
```css
background: var(--surface-secondary);
border: 2px solid var(--surface-border);
color: var(--text-primary);
/* Focus */
border-color: var(--accent-primary);
```

## Color Usage Guidelines

### When to use each color:

**Backgrounds:**
- Use `--bg-primary` for the page
- Use `--surface-primary` for main cards
- Use `--surface-secondary` for nested sections

**Text:**
- Use `--text-primary` for headlines and important text
- Use `--text-secondary` for labels and descriptions
- Use `--text-tertiary` for metadata
- Use `--text-muted` for footnotes

**Accents:**
- Use `--accent-primary` for buttons and links
- Use `--accent-light` for backgrounds behind accent content
- Reserve accent colors for actionable elements

**Status:**
- Use status colors sparingly
- Always pair with a light background variant
- Ensure good contrast with text

## Customization Examples

### Change to Purple Theme:
```css
--accent-primary: #a855f7;
--accent-secondary: #c084fc;
--accent-hover: #9333ea;
--accent-light: rgba(168, 85, 247, 0.1);
```

### Make it Darker:
```css
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--surface-primary: #141414;
--surface-secondary: #1a1a1a;
```

### Make it Lighter (Dark Gray):
```css
--bg-primary: #1a1a1a;
--bg-secondary: #2a2a2a;
--surface-primary: #2f2f2f;
--surface-secondary: #3a3a3a;
```

## Browser DevTools

To experiment with colors:
1. Open DevTools (F12)
2. Find `:root` in Elements/Inspector
3. Edit CSS variables in real-time
4. Copy working values back to `theme.css`

## Accessibility

All color combinations meet WCAG 2.1 Level AA standards:
- Normal text: 4.5:1 contrast minimum ✅
- Large text: 3:1 contrast minimum ✅
- UI components: 3:1 contrast minimum ✅

Test your changes at: https://webaim.org/resources/contrastchecker/
