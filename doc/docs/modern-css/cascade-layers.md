---
sidebar_position: 3
---

# Cascade Layers

## The Problem

CSS specificity wars are one of the most common sources of bugs and frustration. Developers resort to overly specific selectors, `!important`, or naming conventions like BEM to manage specificity conflicts. When integrating third-party CSS (design systems, component libraries, resets), controlling which styles take precedence becomes increasingly difficult. AI agents often generate CSS that creates specificity conflicts or uses `!important` as a fix.

## The Solution

The `@layer` at-rule provides explicit control over the cascade. Layer priority is evaluated *before* selector specificity — a simple selector in a later-declared layer always wins over a complex selector in an earlier layer. This eliminates specificity wars by design.

The full cascade evaluation order is: origin/importance > inline styles > cascade layers > specificity > source order.

## Code Examples

### Declaring Layer Order

The order in which layers are first declared determines their priority. The last layer in the declaration list has the highest priority.

```css
/* Declare layer order upfront — this is the recommended pattern */
@layer reset, base, components, utilities;

/* Now populate layers in any order */
@layer reset {
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

@layer base {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
  }

  a {
    color: #2563eb;
  }
}

@layer components {
  .button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .button-primary {
    background: #2563eb;
    color: white;
  }
}

@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .text-center {
    text-align: center;
  }
}
```

### Importing Third-Party CSS Into a Layer

```css
/* Put third-party styles in a low-priority layer */
@import url("normalize.css") layer(reset);
@import url("some-library.css") layer(vendor);

@layer reset, vendor, base, components, utilities;
```

### Layer Priority Overrides Specificity

```css
@layer base, components;

@layer base {
  /* High specificity: (0, 2, 1) */
  nav ul li.active a.nav-link {
    color: black;
  }
}

@layer components {
  /* Low specificity: (0, 1, 0) — but this WINS because
     'components' is declared after 'base' */
  .nav-link {
    color: blue;
  }
}
```

### Nested Layers

```css
@layer components {
  @layer card {
    .card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
  }

  @layer button {
    .button {
      padding: 0.5rem 1rem;
    }
  }
}

/* Reference nested layers with dot notation */
@layer components.card {
  .card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}
```

### Using `revert-layer`

The `revert-layer` keyword rolls back a property value to whatever was set in the previous layer.

```css
@layer base, theme, overrides;

@layer base {
  a {
    color: blue;
    text-decoration: underline;
  }
}

@layer theme {
  a {
    color: #8b5cf6;
    text-decoration: none;
  }
}

@layer overrides {
  /* Roll back to the base layer value */
  .classic-link {
    color: revert-layer;
    text-decoration: revert-layer;
    /* Result: color is #8b5cf6 from theme?
       No — revert-layer goes to the PREVIOUS layer.
       Actually: color reverts to theme's value first,
       then theme could revert-layer to base's value. */
  }
}
```

A practical use case for `revert-layer`:

```css
@layer defaults, theme;

@layer defaults {
  button {
    background: #e5e7eb;
    color: #1f2937;
  }
}

@layer theme {
  button {
    background: #2563eb;
    color: white;
  }

  /* Opt specific buttons out of theming */
  button.no-theme {
    background: revert-layer; /* Falls back to #e5e7eb */
    color: revert-layer;      /* Falls back to #1f2937 */
  }
}
```

### Unlayered Styles Have Highest Priority

Styles not in any layer always win over layered styles.

```css
@layer base {
  p {
    color: gray;
  }
}

/* Unlayered — this wins */
p {
  color: black;
}
```

## Browser Support

- Chrome 99+
- Firefox 97+
- Safari 15.4+
- Edge 99+

Global support exceeds 96%.

## Common AI Mistakes

- Using `!important` to override styles instead of managing priority with layers
- Not declaring layer order upfront, leading to unpredictable priority based on first-appearance order
- Placing third-party/vendor CSS outside of a layer (giving it the highest unlayered priority)
- Not knowing that unlayered styles beat all layered styles
- Confusing `revert-layer` with `revert` — `revert` rolls back to the user-agent stylesheet, while `revert-layer` rolls back to the previous cascade layer
- Generating overly specific selectors when layer ordering solves the priority problem

## When to Use

- Managing specificity across a large codebase with multiple style sources
- Integrating third-party CSS without specificity conflicts
- Establishing a clear CSS architecture (reset, base, components, utilities, overrides)
- Replacing `!important` usage with structured layer priority
- Building design systems where consumers need to override component styles predictably

## References

- [@layer - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- [Cascade layers - MDN Learn](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
- [Cascade Layers Guide - CSS-Tricks](https://css-tricks.com/css-cascade-layers/)
- [revert-layer - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/revert-layer)
- [Hello, CSS Cascade Layers - Ahmad Shadeed](https://ishadeed.com/article/cascade-layers/)
