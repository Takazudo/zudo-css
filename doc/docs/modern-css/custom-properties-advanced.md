---
sidebar_position: 5
---

# Advanced Custom Properties

## The Problem

CSS custom properties (variables) are widely used, but most developers and AI agents only scratch the surface — defining simple color or size tokens on `:root` and referencing them with `var()`. Advanced patterns like the space-toggling trick, fallback chains, and computed property relationships are rarely leveraged, leading to unnecessary JavaScript for conditional styling, rigid theming systems, and duplicated declarations.

## The Solution

CSS custom properties are far more powerful than simple variable substitution. They participate in the cascade, can be scoped to any element, support multi-level fallback chains, and can be combined with the space-toggling trick to create boolean-like conditional logic — all in pure CSS with zero JavaScript.

## Code Examples

### The Space-Toggling Trick

The space toggle exploits how `var()` fallbacks work. A custom property set to a single space (` `) is valid and "passes through," while a property set to `initial` triggers the fallback value.

```css
/* The toggle: space = ON, initial = OFF */
.card {
  --is-featured: initial; /* OFF by default */

  /* When ON, value becomes " blue"; when OFF, fallback "gray" is used */
  background: var(--is-featured) blue, gray;
  color: var(--is-featured) white, #333;
  border-width: var(--is-featured) 3px, 1px;
}

.card.featured {
  --is-featured: ; /* ON (single space) */
}
```

### Space Toggle for Dark Mode

```css
:root {
  --dark: initial; /* Light mode by default */
}

@media (prefers-color-scheme: dark) {
  :root {
    --dark: ; /* Enable dark mode */
  }
}

body {
  background: var(--dark) #1a1a2e, #ffffff;
  color: var(--dark) #e0e0e0, #1a1a2e;
}

.card {
  background: var(--dark) #2d2d44, #f5f5f5;
  border-color: var(--dark) #444, #ddd;
}
```

### Fallback Chains for Theming

Create layered configuration systems where a component checks for progressively broader defaults.

```css
.button {
  /* Check component-specific → theme-level → hardcoded default */
  background: var(--button-bg, var(--accent-color, #2563eb));
  color: var(--button-color, var(--accent-contrast, white));
  padding: var(--button-padding, var(--spacing-sm, 0.5rem 1rem));
  border-radius: var(--button-radius, var(--radius, 4px));
}

/* Theme-level override: changes all components using --accent-color */
.theme-warm {
  --accent-color: #ea580c;
  --accent-contrast: white;
}

/* Component-specific override: changes only buttons */
.cta-section {
  --button-bg: #16a34a;
  --button-color: white;
}
```

### Scoped Custom Properties for Component Variants

Instead of creating separate classes for every variant, use custom properties as a styling API.

```css
.badge {
  --_bg: var(--badge-bg, #e5e7eb);
  --_color: var(--badge-color, #374151);
  --_size: var(--badge-size, 0.75rem);

  background: var(--_bg);
  color: var(--_color);
  font-size: var(--_size);
  padding: 0.25em 0.75em;
  border-radius: 999px;
  font-weight: 600;
}

/* Variants set only the custom properties */
.badge-success {
  --badge-bg: #dcfce7;
  --badge-color: #166534;
}

.badge-error {
  --badge-bg: #fee2e2;
  --badge-color: #991b1b;
}
```

### Computed Relationships with `calc()`

```css
.fluid-type {
  --min-size: 1;
  --max-size: 1.5;
  --min-width: 320;
  --max-width: 1200;

  font-size: calc(
    (var(--min-size) * 1rem) +
    (var(--max-size) - var(--min-size)) *
    (100vw - var(--min-width) * 1px) /
    (var(--max-width) - var(--min-width))
  );
}

h1 { --min-size: 1.5; --max-size: 3; }
h2 { --min-size: 1.25; --max-size: 2; }
```

### Sharing State Between CSS and JavaScript

```css
.progress-bar {
  --progress: 0;

  width: calc(var(--progress) * 1%);
  background: hsl(calc(var(--progress) * 1.2) 70% 50%);
  transition: width 0.3s, background 0.3s;
}
```

```html
<div class="progress-bar" style="--progress: 75"></div>

<script>
  // Update from JavaScript — CSS handles the visual mapping
  element.style.setProperty('--progress', newValue);
</script>
```

### Private Custom Properties Convention

Use a leading underscore after `--` to indicate "internal" properties that should not be set by consumers.

```css
.tooltip {
  /* Public API */
  --tooltip-bg: var(--surface-inverse, #1f2937);
  --tooltip-color: var(--text-inverse, white);

  /* Private (internal computation) */
  --_arrow-size: 6px;
  --_offset: calc(100% + var(--_arrow-size) + 4px);

  background: var(--tooltip-bg);
  color: var(--tooltip-color);
  transform: translateY(calc(-1 * var(--_offset)));
}
```

## Browser Support

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

Custom properties have near-universal support (98%+). The `initial` keyword behavior used in the space-toggling trick works across all browsers that support custom properties. For best performance, avoid fallback chains deeper than 3 levels, and scope `setProperty()` calls to the most specific element rather than `:root`.

## Common AI Mistakes

- Using JavaScript to toggle visual states that could be handled with the space-toggling trick
- Only defining custom properties on `:root` instead of scoping them to components
- Not leveraging fallback chains for themeable component APIs
- Creating separate CSS classes for every variant instead of using custom property-based variants
- Using raw values in `calc()` without custom properties, making the relationship between values opaque
- Deeply nesting fallback chains (4+ levels) which adds resolution overhead
- Not using a naming convention (like `--_` prefix) to distinguish public vs private custom properties

## When to Use

- Theming systems with component-level overrides via fallback chains
- Boolean-like conditional styling with the space-toggling trick (dark mode, feature flags)
- Component variant APIs where consumers set properties to customize appearance
- Computed relationships between values (responsive sizing, color palettes)
- Bridging CSS and JavaScript state without class toggling

## References

- [Using CSS custom properties (variables) - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)
- [The CSS Custom Property Toggle Trick - CSS-Tricks](https://css-tricks.com/the-css-custom-property-toggle-trick/)
- [The --var: ; hack to toggle multiple values with one custom property - Lea Verou](https://lea.verou.me/blog/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/)
- [A Complete Guide to Custom Properties - CSS-Tricks](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Cyclic Dependency Space Toggles - kizu.dev](https://kizu.dev/cyclic-toggles/)
