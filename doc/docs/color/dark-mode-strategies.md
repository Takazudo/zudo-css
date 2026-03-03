---
sidebar_position: 4
---

# Dark Mode Strategies

## The Problem

AI agents frequently implement dark mode by duplicating entire stylesheets or by using JavaScript to toggle classes that override every color declaration. The resulting code is verbose, fragile, and difficult to maintain. Common mistakes include inverting colors naively (white becomes black, brand colors stay the same), not adjusting perceived brightness of text and surfaces, and creating harsh contrast that causes eye strain in dark mode.

## The Solution

Modern CSS provides a layered approach to dark mode:

1. **`color-scheme`** — Tells the browser to adjust UA-styled elements (form controls, scrollbars) to light or dark
2. **`prefers-color-scheme`** — A media query that detects the user's OS-level theme preference
3. **`light-dark()`** — A CSS function (Baseline 2024) that returns one of two color values depending on the active color scheme
4. **CSS custom properties** — The backbone for theming, allowing a single set of property declarations to swap color tokens

## Code Examples

### color-scheme: Opt Into Browser Dark Mode

```css
/* Tell the browser this page supports both light and dark */
:root {
  color-scheme: light dark;
}
```

This single line makes form controls, scrollbars, and other browser-styled elements automatically adapt. Without it, `<input>`, `<select>`, and `<textarea>` remain light-themed even when the page background is dark.

### prefers-color-scheme Media Query

```css
:root {
  --color-bg: oklch(99% 0.005 264);
  --color-surface: oklch(97% 0.01 264);
  --color-text: oklch(20% 0.02 264);
  --color-text-muted: oklch(40% 0.02 264);
  --color-border: oklch(85% 0.01 264);
  --color-primary: oklch(55% 0.22 264);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: oklch(15% 0.01 264);
    --color-surface: oklch(20% 0.015 264);
    --color-text: oklch(90% 0.01 264);
    --color-text-muted: oklch(65% 0.01 264);
    --color-border: oklch(30% 0.015 264);
    --color-primary: oklch(70% 0.18 264); /* Lighter primary for dark bg */
  }
}
```

### The light-dark() Function

`light-dark()` simplifies dark mode by inlining both color values in a single declaration. It requires `color-scheme` to be set.

```css
:root {
  color-scheme: light dark;

  --color-bg: light-dark(oklch(99% 0.005 264), oklch(15% 0.01 264));
  --color-surface: light-dark(oklch(97% 0.01 264), oklch(20% 0.015 264));
  --color-text: light-dark(oklch(20% 0.02 264), oklch(90% 0.01 264));
  --color-text-muted: light-dark(oklch(40% 0.02 264), oklch(65% 0.01 264));
  --color-border: light-dark(oklch(85% 0.01 264), oklch(30% 0.015 264));
  --color-primary: light-dark(oklch(55% 0.22 264), oklch(70% 0.18 264));
}
```

The first argument is used in light mode, the second in dark mode. No media query needed.

### JavaScript Theme Toggle

For user-controlled theme switching (overriding OS preference):

```html
<button id="theme-toggle" aria-label="Toggle theme">Toggle theme</button>
```

```css
:root {
  color-scheme: light dark;
}

:root[data-theme="light"] {
  color-scheme: light;
}

:root[data-theme="dark"] {
  color-scheme: dark;
}

/* Custom properties using light-dark() respond to color-scheme */
:root {
  --color-bg: light-dark(oklch(99% 0.005 264), oklch(15% 0.01 264));
  --color-text: light-dark(oklch(20% 0.02 264), oklch(90% 0.01 264));
}
```

```html
<script>
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  // Check for saved preference, fallback to OS preference
  const saved = localStorage.getItem("theme");
  if (saved) {
    root.dataset.theme = saved;
  }

  toggle.addEventListener("click", () => {
    const current = root.dataset.theme;
    const next =
      current === "dark"
        ? "light"
        : current === "light"
          ? "dark"
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "light"
            : "dark";

    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
</script>
```

### Complete Dark Mode Token System

```css
:root {
  color-scheme: light dark;

  /* Surfaces */
  --surface-0: light-dark(oklch(100% 0 0), oklch(13% 0.01 264));
  --surface-1: light-dark(oklch(97% 0.005 264), oklch(18% 0.012 264));
  --surface-2: light-dark(oklch(94% 0.008 264), oklch(22% 0.015 264));
  --surface-3: light-dark(oklch(90% 0.01 264), oklch(27% 0.018 264));

  /* Text */
  --text-primary: light-dark(oklch(20% 0.02 264), oklch(92% 0.01 264));
  --text-secondary: light-dark(oklch(40% 0.015 264), oklch(70% 0.01 264));
  --text-disabled: light-dark(oklch(60% 0.01 264), oklch(45% 0.01 264));

  /* Borders */
  --border-default: light-dark(oklch(85% 0.01 264), oklch(30% 0.015 264));
  --border-strong: light-dark(oklch(70% 0.015 264), oklch(45% 0.02 264));

  /* Brand */
  --brand: light-dark(oklch(55% 0.22 264), oklch(72% 0.17 264));
  --brand-hover: light-dark(oklch(48% 0.22 264), oklch(78% 0.15 264));

  /* Feedback */
  --success: light-dark(oklch(48% 0.15 145), oklch(70% 0.15 145));
  --warning: light-dark(oklch(58% 0.18 85), oklch(75% 0.15 85));
  --danger: light-dark(oklch(52% 0.2 25), oklch(70% 0.18 25));
}
```

### Dark Mode for Images and Media

```css
/* Reduce brightness and increase contrast for images in dark mode */
@media (prefers-color-scheme: dark) {
  img:not([src*=".svg"]) {
    filter: brightness(0.9) contrast(1.05);
  }

  /* Invert dark-on-light diagrams and illustrations */
  img.invertible {
    filter: invert(1) hue-rotate(180deg);
  }
}
```

### Preventing Flash of Wrong Theme (FOWT)

```html
<head>
  <!-- Inline script to apply theme before any render -->
  <script>
    (function () {
      const saved = localStorage.getItem("theme");
      if (saved) {
        document.documentElement.dataset.theme = saved;
      }
    })();
  </script>
</head>
```

## Common AI Mistakes

- Not setting `color-scheme: light dark` on `:root`, causing form controls and scrollbars to remain in light mode even when the page is dark
- Duplicating entire stylesheets for dark mode instead of swapping CSS custom properties
- Using `light-dark()` without declaring `color-scheme` — the function returns the first (light) value by default if `color-scheme` is not set
- Inverting colors naively (`white` ↔ `black`) instead of adjusting lightness levels — dark mode backgrounds should be dark gray (not pure black) and text should be off-white (not pure white)
- Keeping the same brand color in both modes — saturated colors on dark backgrounds appear overly vibrant and need reduced chroma and increased lightness
- Not reducing font weight in dark mode — text on dark backgrounds appears perceptually heavier, so reducing `font-weight` by 30–50 units improves readability
- Applying `filter: invert(1)` to the entire page as a "dark mode" — this breaks images, videos, and any element with intentional colors
- Storing theme preference in JavaScript state instead of `localStorage`, causing a flash of wrong theme on page reload
- Using JavaScript to toggle `.dark-mode` classes on individual elements instead of leveraging custom properties on `:root`

## When to Use

### prefers-color-scheme

- The simplest approach when the site should respect OS preferences with no manual toggle
- Static sites, blogs, documentation

### light-dark()

- When you want both color values co-located in the same declaration for readability
- When using `color-scheme` (on `:root` or specific elements) to control mode

### Custom properties + data attribute

- When users need a manual theme toggle
- When the app supports more than two themes (light, dark, high-contrast, etc.)
- SPAs and web applications

### color-scheme alone

- For pages that only need browser-native element theming (forms, scrollbars) without custom color changes

## References

- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme)
- [MDN: light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark)
- [MDN: color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme)
- [CSS color-scheme-dependent colors with light-dark() — web.dev](https://web.dev/articles/light-dark)
- [Dark Mode in CSS Guide — CSS-Tricks](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/)
- [The ultimate guide to coding dark mode layouts in 2025 — Bootcamp](https://medium.com/design-bootcamp/the-ultimate-guide-to-implementing-dark-mode-in-2025-bbf2938d2526)
