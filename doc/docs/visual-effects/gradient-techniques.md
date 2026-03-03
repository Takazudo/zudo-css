---
sidebar_position: 2
---

# Gradient Techniques

## The Problem

AI agents tend to reach for flat solid colors when backgrounds, text fills, or decorative elements would look significantly more polished with gradients. When AI does use gradients, they often pick harsh color pairings, fail to use perceptual color spaces for smooth transitions, and miss advanced techniques like layered gradients, hard-stop patterns, or gradient text.

## The Solution

CSS provides three gradient functions — `linear-gradient()`, `radial-gradient()`, and `conic-gradient()` — each with a repeating variant. These can be layered, combined with hard stops for patterns, applied to text, and interpolated in perceptual color spaces like `oklch` for smooth, vibrant results.

## Code Examples

### Linear Gradient Basics

```css
/* Top-to-bottom (default) */
.gradient-basic {
  background: linear-gradient(#3b82f6, #8b5cf6);
}

/* Angled */
.gradient-angled {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

/* Multi-stop with explicit positions */
.gradient-multi {
  background: linear-gradient(
    to right,
    #3b82f6 0%,
    #8b5cf6 50%,
    #ec4899 100%
  );
}
```

### Smooth Gradients with oklch

Standard RGB interpolation can produce muddy mid-tones. Using `oklch` produces smoother, more vibrant transitions.

```css
/* Muddy middle in sRGB */
.gradient-srgb {
  background: linear-gradient(in srgb, #3b82f6, #ef4444);
}

/* Vibrant, smooth transition in oklch */
.gradient-oklch {
  background: linear-gradient(in oklch, #3b82f6, #ef4444);
}

/* oklch with explicit hue interpolation */
.gradient-oklch-longer {
  background: linear-gradient(in oklch longer hue, #3b82f6, #ef4444);
}
```

### Radial Gradients

```css
/* Centered circle */
.radial-circle {
  background: radial-gradient(circle, #3b82f6, #1e3a5f);
}

/* Ellipse from top-left */
.radial-positioned {
  background: radial-gradient(ellipse at 20% 30%, #8b5cf6, #1e1b4b);
}

/* Spotlight effect */
.radial-spotlight {
  background: radial-gradient(
    circle at 50% 0%,
    hsl(220deg 80% 60%) 0%,
    hsl(220deg 80% 10%) 70%
  );
}
```

### Conic Gradients

```css
/* Color wheel */
.conic-wheel {
  background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
  border-radius: 50%;
}

/* Pie chart segment */
.conic-pie {
  background: conic-gradient(
    #3b82f6 0deg 120deg,
    #8b5cf6 120deg 210deg,
    #e2e8f0 210deg 360deg
  );
  border-radius: 50%;
}
```

### Hard-Stop Gradients for Patterns

Hard stops occur when two color stops share the same position, creating an instant transition rather than a smooth blend.

```css
/* Striped background */
.stripes {
  background: repeating-linear-gradient(
    45deg,
    #3b82f6 0px,
    #3b82f6 10px,
    #2563eb 10px,
    #2563eb 20px
  );
}

/* Checkerboard with conic-gradient */
.checkerboard {
  background:
    conic-gradient(
      #e2e8f0 25%,
      #fff 25% 50%,
      #e2e8f0 50% 75%,
      #fff 75%
    );
  background-size: 40px 40px;
}

/* Progress bar with hard stop */
.progress-bar {
  background: linear-gradient(
    to right,
    #3b82f6 0%,
    #3b82f6 65%,
    #e2e8f0 65%,
    #e2e8f0 100%
  );
}
```

### Layered Gradients for Complex Backgrounds

Multiple gradients can be stacked using comma-separated `background` values. Later values render behind earlier ones, so use transparency to let lower layers show through.

```css
/* Mesh-like layered gradient */
.layered-gradient {
  background:
    radial-gradient(
      circle at 20% 80%,
      hsl(220deg 80% 60% / 0.6),
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      hsl(330deg 80% 60% / 0.6),
      transparent 50%
    ),
    radial-gradient(
      circle at 50% 50%,
      hsl(270deg 80% 60% / 0.4),
      transparent 60%
    ),
    hsl(220deg 40% 10%);
}

/* Noise-like texture using layered gradients */
.texture-gradient {
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      hsl(0deg 0% 100% / 0.03) 2px,
      hsl(0deg 0% 100% / 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      hsl(0deg 0% 100% / 0.03) 2px,
      hsl(0deg 0% 100% / 0.03) 4px
    ),
    linear-gradient(135deg, #1a1a2e, #16213e);
}
```

### Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent; /* fallback for non-webkit */
}
```

```html
<h1 class="gradient-text">Gradient Heading</h1>
```

### Gradient Border via Background-Clip

```css
.gradient-border {
  border: 3px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #3b82f6, #8b5cf6) border-box;
}
```

## Common AI Mistakes

- **Flat solid colors everywhere** — Using `background: #3b82f6` when a subtle gradient like `linear-gradient(#3b82f6, #2563eb)` would add depth and polish.
- **Harsh color pairings** — Picking two unrelated colors that produce muddy mid-tones in sRGB interpolation. Using `in oklch` resolves this.
- **Ignoring repeating-gradient for patterns** — Manually creating stripe or pattern effects with pseudo-elements when `repeating-linear-gradient()` handles it natively.
- **Forgetting the -webkit- prefix for gradient text** — `background-clip: text` still requires `-webkit-background-clip: text` in many browsers.
- **Using only one gradient when layered gradients create richer effects** — A single linear-gradient is fine, but layering radial gradients over a base creates mesh-gradient-like complexity.
- **Not setting background-size for repeating patterns** — `conic-gradient` patterns require explicit `background-size` to tile correctly.

## When to Use

- **Subtle depth** — A near-identical two-color gradient on cards, buttons, or headers adds dimension without being flashy
- **Hero sections and backgrounds** — Layered gradients create visually rich backgrounds without image downloads
- **Text highlights** — Gradient text draws attention to headings or CTAs
- **Decorative patterns** — Hard-stop repeating gradients for stripes, dots, and geometric backgrounds
- **Data visualization** — Conic gradients for simple pie/donut charts without JavaScript
- **Borders** — Gradient borders via `background-clip` for elements that need rounded corners

## References

- [Using CSS Gradients — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Images/Using_gradients)
- [A Complete Guide to CSS Gradients — CSS-Tricks](https://css-tricks.com/a-complete-guide-to-css-gradients/)
- [Make Beautiful Gradients in CSS — Josh W. Comeau](https://www.joshwcomeau.com/css/make-beautiful-gradients/)
- [A Deep CSS Dive Into Radial and Conic Gradients — Smashing Magazine](https://www.smashingmagazine.com/2022/01/css-radial-conic-gradient/)
