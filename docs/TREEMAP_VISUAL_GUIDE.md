# Treemap Visualization - Visual Guide

## What is a Treemap?

A treemap is a data visualization technique that displays hierarchical data using nested rectangles. The size of each rectangle corresponds to a quantitative value - in our case, the file size of webpage resources.

## Example Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    TREEMAP VISUALIZATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                    [Toggle View] │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │ JS               │  │ IMAGE        │  │ CSS            │   │
│  │ 450 KB          │  │ 320 KB       │  │ 180 KB         │   │
│  │ 8 files         │  │ 15 files     │  │ 5 files        │   │
│  ├─────────┬────────┤  ├──────┬───────┤  ├────┬───────────┤   │
│  │         │        │  │      │       │  │    │           │   │
│  │ 200 KB  │ 120 KB │  │ 80KB │  70KB │  │60KB│   45 KB   │   │
│  │         │        │  │      │       │  │    │           │   │
│  │         ├────────┤  ├──────┼───────┤  ├────┼───────────┤   │
│  │         │  80KB  │  │ 50KB │  40KB │  │45KB│   30 KB   │   │
│  │         │        │  │      │       │  │    │           │   │
│  └─────────┴────────┘  └──────┴───────┘  └────┴───────────┘   │
│                                                                   │
│  ┌─────────┐  ┌──────┐  ┌────┐                                 │
│  │ HTML    │  │ FONT │  │ etc│                                 │
│  │ 85 KB   │  │ 60KB │  │    │                                 │
│  │ 2 files │  │ 3    │  │    │                                 │
│  └─────────┘  └──────┘  └────┘                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Color Scheme Visual Reference

### Resource Type Colors

```
┌────────────────────────────────────────────────────────┐
│ HTML    │ ████████████ │ Purple Gradient             │
│         │ ████████████ │ #667eea → #764ba2           │
├─────────┼──────────────┼─────────────────────────────┤
│ CSS     │ ████████████ │ Pink Gradient               │
│         │ ████████████ │ #f093fb → #f5576c           │
├─────────┼──────────────┼─────────────────────────────┤
│ JS      │ ████████████ │ Orange Gradient             │
│         │ ████████████ │ #ffd89b → #f7971e           │
├─────────┼──────────────┼─────────────────────────────┤
│ IMAGE   │ ████████████ │ Green Gradient              │
│         │ ████████████ │ #43e97b → #38f9d7           │
├─────────┼──────────────┼─────────────────────────────┤
│ FONT    │ ████████████ │ Yellow-Pink Gradient        │
│         │ ████████████ │ #fa709a → #fee140           │
├─────────┼──────────────┼─────────────────────────────┤
│ VIDEO   │ ████████████ │ Blue Gradient               │
│         │ ████████████ │ #30cfd0 → #330867           │
├─────────┼──────────────┼─────────────────────────────┤
│ AUDIO   │ ████████████ │ Teal-Pink Gradient          │
│         │ ████████████ │ #a8edea → #fed6e3           │
├─────────┼──────────────┼─────────────────────────────┤
│ OTHER   │ ████████████ │ Purple-Yellow Gradient      │
│         │ ████████████ │ #d299c2 → #fef9d7           │
└─────────┴──────────────┴─────────────────────────────┘
```

## Interactive Elements

### Hover State
```
Before Hover:              After Hover:
┌──────────┐              ┌────────────┐
│          │              │            │
│  120 KB  │   ───────>   │   120 KB   │ (scaled up)
│          │              │            │ (with shadow)
└──────────┘              └────────────┘
                          + Tooltip appears
```

### Click Action
```
┌──────────┐                      ┌─────────────────────┐
│          │                      │  Resource Details   │
│  120 KB  │   Click ───────>    │ ─────────────────── │
│          │                      │ Name: script.js     │
└──────────┘                      │ Type: JS            │
                                  │ Size: 120 KB        │
                                  │ URL: https://...    │
                                  └─────────────────────┘
```

## View Modes

### Grouped View (Default)
Resources are grouped by type in separate containers:
```
┌────────────────┐  ┌────────────┐  ┌──────────┐
│ JS Group       │  │ CSS Group  │  │ Images   │
│ ┌──┐ ┌───┐    │  │ ┌───┐ ┌──┐ │  │ ┌──┐ ┌──┐│
│ │  │ │   │    │  │ │   │ │  │ │  │ │  │ │  ││
│ └──┘ └───┘    │  │ └───┘ └──┘ │  │ └──┘ └──┘│
└────────────────┘  └────────────┘  └──────────┘
```

### Flat View
All groups displayed in a single column:
```
┌─────────────────────────────────┐
│ JS Group                         │
│ ┌──┐ ┌───┐ ┌──┐                 │
│ │  │ │   │ │  │                 │
│ └──┘ └───┘ └──┘                 │
├─────────────────────────────────┤
│ CSS Group                        │
│ ┌───┐ ┌──┐ ┌───┐                │
│ │   │ │  │ │   │                │
│ └───┘ └──┘ └───┘                │
├─────────────────────────────────┤
│ Images                           │
│ ┌──┐ ┌──┐ ┌───┐ ┌──┐            │
│ │  │ │  │ │   │ │  │            │
│ └──┘ └──┘ └───┘ └──┘            │
└─────────────────────────────────┘
```

## Size Interpretation

The rectangle sizes are **proportional** to file sizes:

```
Small File (10 KB):        Medium File (100 KB):     Large File (500 KB):
┌──┐                       ┌─────────┐               ┌──────────────────┐
│  │                       │         │               │                  │
└──┘                       │         │               │                  │
                           │         │               │                  │
                           └─────────┘               │     500 KB       │
                                                     │                  │
                                                     │                  │
                                                     └──────────────────┘
```

## Real-World Example

Analyzing a typical website might show:

```
Total Resources: 45 files, 1.2 MB

┌───────────────────────────────────────────────────────────┐
│                                                            │
│  ┌──────────────────────────┐  ┌────────────────────┐    │
│  │ JAVASCRIPT (JS)          │  │ IMAGES             │    │
│  │ Total: 450 KB            │  │ Total: 380 KB      │    │
│  │ Files: 12                │  │ Files: 18          │    │
│  │                          │  │                    │    │
│  │  ┌─────────┐  ┌───────┐ │  │ ┌────┐ ┌────┐     │    │
│  │  │ 180 KB  │  │ 120KB │ │  │ │80KB│ │70KB│     │    │
│  │  │ main.js │  │vendor │ │  │ │logo│ │hero│     │    │
│  │  └─────────┘  └───────┘ │  │ └────┘ └────┘     │    │
│  │  [smaller resources...]  │  │ [more images...]  │    │
│  └──────────────────────────┘  └────────────────────┘    │
│                                                            │
│  ┌────────────┐  ┌──────────┐  ┌──────┐  ┌────┐         │
│  │ CSS        │  │ HTML     │  │ FONTS│  │etc.│         │
│  │ 180 KB     │  │ 85 KB    │  │ 75 KB│  │ .. │         │
│  │ 6 files    │  │ 2 files  │  │ 3    │  │    │         │
│  └────────────┘  └──────────┘  └──────┘  └────�┘         │
│                                                            │
└───────────────────────────────────────────────────────────┘

Key Insights:
✓ JavaScript takes up 37.5% of total page weight
✓ Images account for 31.7% - consider optimization
✓ Largest single resource: main.js (180 KB)
✓ Consider code-splitting for JavaScript files
```

## Use Cases

### 1. Finding Optimization Opportunities
Look for disproportionately large rectangles - these are prime candidates for optimization.

### 2. Understanding Resource Distribution
See at a glance which types of resources dominate your page weight.

### 3. Before/After Comparison
Compare treemaps before and after optimization to visualize improvements.

### 4. Quick Audits
Instantly spot if you have too many resources of a particular type.

## Tips for Interpretation

1. **Larger rectangles = larger files**: Focus optimization efforts here
2. **Many small rectangles**: May indicate too many HTTP requests
3. **One type dominates**: Check if that resource type can be optimized
4. **Balanced distribution**: Generally indicates good resource management
5. **Grouped view**: Best for comparing resource types
6. **Flat view**: Best for seeing all groups in sequence

---

**Note**: The actual treemap in the application uses beautiful gradient colors and smooth animations. The ASCII diagrams above are simplified representations for documentation purposes.
