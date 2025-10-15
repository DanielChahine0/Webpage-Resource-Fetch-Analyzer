# Theme System Documentation

## Overview

The Webpage Resource Fetch Analyzer now uses a unified, clean dark theme with a modern blue accent color scheme. The theme is built on CSS custom properties (CSS variables) for easy customization and consistency across all components.

## Theme Colors

### Background Colors
- **Primary Background** (`--bg-primary: #0a0e27`): Main page background
- **Secondary Background** (`--bg-secondary: #141937`): Alternative background for containers
- **Tertiary Background** (`--bg-tertiary: #1a1f3a`): Third-level backgrounds
- **Elevated Background** (`--bg-elevated: #1f2541`): Elevated components

### Surface Colors
- **Primary Surface** (`--surface-primary: #1a1f3a`): Cards and containers
- **Secondary Surface** (`--surface-secondary: #1f2541`): Nested elements
- **Surface Hover** (`--surface-hover: #252b4a`): Hover states
- **Surface Border** (`--surface-border: rgba(99, 102, 241, 0.15)`): Border color with transparency

### Text Colors
- **Primary Text** (`--text-primary: #e2e8f0`): Main text content
- **Secondary Text** (`--text-secondary: #94a3b8`): Labels and secondary information
- **Tertiary Text** (`--text-tertiary: #64748b`): Tertiary information
- **Muted Text** (`--text-muted: #475569`): Least important text

### Accent Colors
- **Primary Accent** (`--accent-primary: #6366f1`): Main accent color (indigo)
- **Secondary Accent** (`--accent-secondary: #818cf8`): Lighter accent
- **Accent Hover** (`--accent-hover: #4f46e5`): Hover state for accent
- **Accent Light** (`--accent-light: rgba(99, 102, 241, 0.1)`): Transparent accent

### Status Colors
- **Success** (`--success: #10b981`): Success states
- **Warning** (`--warning: #f59e0b`): Warning states
- **Error** (`--error: #ef4444`): Error states
- **Info** (`--info: #3b82f6`): Informational states

Each status color has a corresponding light variant for backgrounds:
- `--success-light`, `--warning-light`, `--error-light`, `--info-light`

## Design Tokens

### Border Radius
- `--radius-sm: 6px` - Small elements
- `--radius-md: 10px` - Medium elements
- `--radius-lg: 15px` - Large containers
- `--radius-xl: 20px` - Extra large elements
- `--radius-full: 9999px` - Circular elements

### Spacing
- `--spacing-xs: 0.5rem` (8px)
- `--spacing-sm: 0.75rem` (12px)
- `--spacing-md: 1rem` (16px)
- `--spacing-lg: 1.5rem` (24px)
- `--spacing-xl: 2rem` (32px)
- `--spacing-2xl: 3rem` (48px)

### Typography
- Font sizes range from `--font-size-xs` (0.75rem) to `--font-size-4xl` (2.25rem)
- Default font family: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`

### Shadows
- `--shadow-sm`: Small shadow for subtle elevation
- `--shadow-md`: Medium shadow for cards
- `--shadow-lg`: Large shadow for modals
- `--shadow-xl`: Extra large shadow for major elevation

### Transitions
- `--transition-fast: 150ms ease`
- `--transition-base: 250ms ease`
- `--transition-slow: 350ms ease`

## Component Styling

### Cards
All cards follow a consistent pattern:
```css
background: var(--surface-primary);
border-radius: var(--radius-md);
padding: var(--spacing-xl);
border: 1px solid var(--surface-border);
box-shadow: var(--shadow-md);
```

### Buttons
Primary buttons use the accent color:
```css
background: var(--accent-primary);
color: var(--text-primary);
border-radius: var(--radius-md);
transition: all var(--transition-base);
```

On hover:
```css
background: var(--accent-hover);
transform: translateY(-2px);
box-shadow: var(--shadow-md);
```

### Input Fields
```css
background: var(--surface-secondary);
border: 2px solid var(--surface-border);
color: var(--text-primary);
border-radius: var(--radius-md);
```

Focus state:
```css
border-color: var(--accent-primary);
background: var(--surface-hover);
```

## File Structure

The theme system is organized into modular CSS files:

```
src/css/
├── theme.css              # Theme variables (imported first)
├── base.css              # Global resets and base styles
├── layout.css            # Header, main, footer layouts
├── input-form.css        # Input and button styles
├── progress.css          # Progress bar styles
├── performance-score.css # Performance score display
├── load-time.css         # Load time estimates display
├── results.css           # Results section and stats cards
├── table.css             # Resources table styles
├── error.css             # Error message styles
├── responsive.css        # Media queries
└── main.css              # Imports all modules
```

## Customization Guide

To customize the theme, modify the CSS variables in `src/css/theme.css`:

### Changing the Accent Color
Replace the accent color values:
```css
--accent-primary: #your-color;
--accent-secondary: #your-lighter-color;
--accent-hover: #your-darker-color;
```

### Adjusting Darkness
Modify the background variables to make the theme lighter or darker:
```css
--bg-primary: #your-background;
--surface-primary: #your-surface-color;
```

### Modifying Spacing
Change the spacing scale:
```css
--spacing-md: 1.25rem; /* Default is 1rem */
```

## Best Practices for Adding New Components

When adding new components, follow these guidelines:

1. **Use Theme Variables**: Always use CSS variables instead of hardcoded colors
   ```css
   /* ✅ Good */
   color: var(--text-primary);
   
   /* ❌ Bad */
   color: #e2e8f0;
   ```

2. **Maintain Consistency**: Use existing spacing and radius variables
   ```css
   padding: var(--spacing-lg);
   border-radius: var(--radius-md);
   ```

3. **Follow the Card Pattern**: New cards should match existing styles
   ```css
   .new-card {
       background: var(--surface-primary);
       border-radius: var(--radius-md);
       padding: var(--spacing-xl);
       border: 1px solid var(--surface-border);
       box-shadow: var(--shadow-md);
   }
   ```

4. **Add Hover Effects**: Make interactive elements responsive
   ```css
   .interactive-element:hover {
       transform: translateY(-2px);
       box-shadow: var(--shadow-lg);
   }
   ```

5. **Use Transitions**: Smooth transitions for better UX
   ```css
   transition: all var(--transition-base);
   ```

## Accessibility

The theme maintains good contrast ratios for accessibility:
- Primary text on primary background: ~13:1
- Secondary text on primary background: ~7:1
- Accent color on primary background: ~8:1

All interactive elements have clear focus and hover states.

## Browser Support

The theme uses modern CSS features but maintains broad compatibility:
- CSS Custom Properties (CSS Variables)
- CSS Grid and Flexbox
- Modern color functions

Supported browsers:
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Performance

The theme system is optimized for performance:
- Minimal CSS file size
- No external dependencies
- Efficient use of CSS variables
- Hardware-accelerated transitions

## Future Enhancements

Planned improvements:
1. Light theme variant
2. Custom theme builder
3. Theme presets (blue, purple, green, etc.)
4. Reduced motion support for accessibility
5. High contrast mode

## Support

For issues or questions about the theme system:
- Check the documentation first
- Review existing component styles for patterns
- Test changes in multiple browsers
- Ensure accessibility standards are maintained
