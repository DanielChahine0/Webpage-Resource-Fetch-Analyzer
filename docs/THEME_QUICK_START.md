# Quick Start Guide - Using the Theme System

## 🚀 Getting Started

Your website now uses a centralized theme system. Everything is controlled through CSS variables in `src/css/theme.css`.

## 📋 Common Tasks

### 1️⃣ Change the Accent Color

Open `src/css/theme.css` and modify:

```css
/* From Indigo to Purple */
--accent-primary: #a855f7;
--accent-secondary: #c084fc;
--accent-hover: #9333ea;
--accent-light: rgba(168, 85, 247, 0.1);
```

**Result**: All buttons, links, and accents change to purple!

### 2️⃣ Make It Darker/Lighter

```css
/* Darker (Black) */
--bg-primary: #000000;
--bg-secondary: #0a0a0a;

/* Lighter (Gray) */
--bg-primary: #1a1a1a;
--bg-secondary: #2a2a2a;
```

### 3️⃣ Adjust Spacing

```css
/* More spacing */
--spacing-md: 1.25rem;  /* was 1rem */
--spacing-lg: 2rem;     /* was 1.5rem */

/* Less spacing */
--spacing-md: 0.75rem;  /* was 1rem */
--spacing-lg: 1.25rem;  /* was 1.5rem */
```

### 4️⃣ Change Border Radius

```css
/* More rounded */
--radius-md: 15px;  /* was 10px */
--radius-lg: 20px;  /* was 15px */

/* Less rounded */
--radius-md: 6px;   /* was 10px */
--radius-lg: 10px;  /* was 15px */
```

## 🎨 Creating New Components

### Basic Card

```css
.my-card {
    /* Background and structure */
    background: var(--surface-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-xl);
    
    /* Border */
    border: 1px solid var(--surface-border);
    
    /* Shadow */
    box-shadow: var(--shadow-md);
    
    /* Animation */
    transition: all var(--transition-base);
}

/* Hover effect */
.my-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
}
```

### Primary Button

```css
.my-button {
    /* Colors */
    background: var(--accent-primary);
    color: var(--text-primary);
    
    /* Structure */
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: var(--radius-md);
    
    /* Typography */
    font-size: var(--font-size-base);
    font-weight: 600;
    
    /* Interaction */
    cursor: pointer;
    transition: all var(--transition-base);
}

/* Hover effect */
.my-button:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}
```

### Input Field

```css
.my-input {
    /* Colors */
    background: var(--surface-secondary);
    color: var(--text-primary);
    border: 2px solid var(--surface-border);
    
    /* Structure */
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    
    /* Typography */
    font-size: var(--font-size-base);
    
    /* Animation */
    transition: all var(--transition-base);
}

/* Focus state */
.my-input:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: var(--surface-hover);
}
```

### Text Elements

```css
/* Heading */
.my-heading {
    color: var(--text-primary);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-md);
}

/* Body text */
.my-text {
    color: var(--text-secondary);
    font-size: var(--font-size-base);
    line-height: 1.6;
}

/* Small text / metadata */
.my-caption {
    color: var(--text-tertiary);
    font-size: var(--font-size-sm);
}
```

### Status Messages

```css
/* Success message */
.success-message {
    background: var(--success-light);
    color: var(--success);
    border: 1px solid var(--success);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
}

/* Error message */
.error-message {
    background: var(--error-light);
    color: var(--error);
    border: 1px solid var(--error);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
}

/* Info message */
.info-message {
    background: var(--info-light);
    color: var(--info);
    border: 1px solid var(--info);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
}
```

## 🎯 Design Patterns

### Card with Header

```css
.card {
    background: var(--surface-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-xl);
    border: 1px solid var(--surface-border);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--surface-border);
}

.card-title {
    color: var(--text-primary);
    font-size: var(--font-size-xl);
    font-weight: 600;
}

.card-content {
    color: var(--text-secondary);
    font-size: var(--font-size-base);
}
```

### Grid Layout

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
}

.grid-item {
    background: var(--surface-primary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--surface-border);
}
```

### List Items

```css
.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--surface-border);
}

.list-item:last-child {
    border-bottom: none;
}

.list-label {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
}

.list-value {
    color: var(--text-primary);
    font-size: var(--font-size-base);
    font-weight: 600;
}
```

## 🎨 Color Usage Rules

### ✅ DO:
- Use `var(--text-primary)` for headings and important text
- Use `var(--text-secondary)` for body text and labels
- Use `var(--accent-primary)` for interactive elements
- Use status colors (`--success`, `--error`, etc.) for feedback
- Use spacing variables for consistent margins and padding

### ❌ DON'T:
- Don't use hardcoded colors (e.g., `#fff`, `#000`)
- Don't use hardcoded spacing (e.g., `20px`, `1.5rem`)
- Don't mix theme and non-theme styles
- Don't create custom colors without adding them to the theme

## 📱 Responsive Design

All theme variables work with responsive design:

```css
/* Mobile */
@media (max-width: 768px) {
    .my-card {
        padding: var(--spacing-md);  /* Less padding on mobile */
    }
    
    .my-heading {
        font-size: var(--font-size-xl);  /* Smaller heading */
    }
}
```

## 🔍 Testing Your Changes

### 1. Browser DevTools
- Press F12
- Find `:root` in the Elements/Inspector tab
- Edit CSS variables live
- See changes instantly

### 2. Color Contrast
Test your color combinations:
- Visit: https://webaim.org/resources/contrastchecker/
- Input your colors
- Ensure 4.5:1 ratio for text

### 3. Different Screens
- Test on desktop
- Test on tablet
- Test on mobile
- Check all components

## 💡 Tips & Tricks

### Tip 1: Use Browser DevTools
Edit theme variables in real-time to experiment before saving.

### Tip 2: Start Small
Change one color at a time to see the impact.

### Tip 3: Check Contrast
Always verify text is readable on backgrounds.

### Tip 4: Be Consistent
If you add a new color, add it to the theme file, don't hardcode it.

### Tip 5: Document Changes
If you modify the theme, note it for future reference.

## 🚨 Common Mistakes

### Mistake 1: Hardcoding Colors
```css
/* ❌ Bad */
.element { color: #e2e8f0; }

/* ✅ Good */
.element { color: var(--text-primary); }
```

### Mistake 2: Inconsistent Spacing
```css
/* ❌ Bad */
.element { padding: 25px; }

/* ✅ Good */
.element { padding: var(--spacing-xl); }
```

### Mistake 3: Skipping Hover States
```css
/* ❌ Bad */
.button { background: var(--accent-primary); }

/* ✅ Good */
.button {
    background: var(--accent-primary);
    transition: all var(--transition-base);
}
.button:hover {
    background: var(--accent-hover);
}
```

## 📚 Variable Reference

### Most Used Variables

**Colors:**
- `var(--text-primary)` - Main text
- `var(--text-secondary)` - Secondary text
- `var(--accent-primary)` - Buttons, links
- `var(--surface-primary)` - Cards
- `var(--surface-border)` - Borders

**Spacing:**
- `var(--spacing-sm)` - Small (12px)
- `var(--spacing-md)` - Medium (16px)
- `var(--spacing-lg)` - Large (24px)
- `var(--spacing-xl)` - Extra large (32px)

**Effects:**
- `var(--radius-md)` - Border radius (10px)
- `var(--shadow-md)` - Box shadow
- `var(--transition-base)` - Transitions (250ms)

**Typography:**
- `var(--font-size-sm)` - Small (0.875rem)
- `var(--font-size-base)` - Normal (1rem)
- `var(--font-size-xl)` - Large (1.25rem)

## 🎓 Learning Resources

1. **Read the docs:**
   - `THEME_SYSTEM.md` - Complete documentation
   - `THEME_COLOR_REFERENCE.md` - Color guide

2. **Study existing components:**
   - Look at `load-time.css` for card patterns
   - Check `input-form.css` for form elements
   - Review `results.css` for grid layouts

3. **Experiment:**
   - Use browser DevTools
   - Try different values
   - See what works

---

## 🎉 You're Ready!

You now know how to:
- ✅ Use theme variables
- ✅ Create new components
- ✅ Customize the theme
- ✅ Follow best practices

**Start building!** 🚀
