---
sidebar_position: 4
---

# CSS @scope

## The Problem

Scoping styles to a specific section of the DOM has traditionally required either Shadow DOM (heavy, inflexible) or naming conventions like BEM (verbose, error-prone). When building component-based UIs, styles for a parent component often leak into nested child components. AI agents rarely use `@scope` and instead generate global selectors or suggest JavaScript-based scoping solutions.

## The Solution

The `@scope` at-rule lets you define a scoping root (where styles start applying) and an optional scoping limit (where they stop). This creates "donut scoped" styles that target a specific DOM subtree without affecting nested components. `@scope` also introduces proximity-based styling in the cascade, where the nearest scoping root wins when specificity is equal.

## Code Examples

### Basic Scoping

```css
@scope (.card) {
  /* These styles only apply inside .card elements */
  h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #4b5563;
    line-height: 1.6;
  }

  img {
    border-radius: 8px;
    width: 100%;
  }
}
```

```html
<div class="card">
  <h2>Card Title</h2>   <!-- Styled -->
  <p>Card content</p>    <!-- Styled -->
</div>

<h2>Page Title</h2>      <!-- NOT styled -->
<p>Page content</p>       <!-- NOT styled -->
```

### Donut Scope

Define both an upper bound (scoping root) and a lower bound (scoping limit) to create a "donut" — styles apply to the outer region but not the inner region.

```css
/* Style the card chrome but not the nested content area */
@scope (.card) to (.card-content) {
  /* These styles apply to .card's "chrome" only */
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  header {
    font-weight: bold;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }
}
```

```html
<div class="card">
  <!-- Inside scope: styled -->
  <header>Card Header</header>

  <div class="card-content">
    <!-- Outside scope (limit reached): NOT styled -->
    <p>This content is not affected by the scoped styles</p>
    <header>Nested header is also not affected</header>
  </div>
</div>
```

### Preventing Style Leaking into Nested Components

```css
/* Style .tabs but do not leak into nested .tabs components */
@scope (.tabs) to (.tabs) {
  :scope {
    display: flex;
    border-bottom: 2px solid #e5e7eb;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  button[aria-selected="true"] {
    border-bottom: 2px solid #2563eb;
    color: #2563eb;
  }
}
```

```html
<div class="tabs">
  <button aria-selected="true">Tab 1</button>
  <button>Tab 2</button>

  <div class="tab-panel">
    <!-- Nested .tabs has its own scope — parent styles do not leak -->
    <div class="tabs">
      <button aria-selected="true">Sub-Tab A</button>
      <button>Sub-Tab B</button>
    </div>
  </div>
</div>
```

### Proximity-Based Styling

When the same property is set by two `@scope` rules at the same specificity, the one with the nearest scoping root wins.

```css
@scope (.light-theme) {
  p {
    color: #1f2937;
  }
}

@scope (.dark-theme) {
  p {
    color: #f3f4f6;
  }
}
```

```html
<div class="light-theme">
  <p>Dark text (light-theme is nearest scope)</p>

  <div class="dark-theme">
    <p>Light text (dark-theme is nearest scope)</p>
  </div>
</div>
```

### Using `:scope` to Reference the Scoping Root

```css
@scope (.alert) {
  :scope {
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid;
  }

  p {
    margin: 0;
  }
}
```

### Inline `<style>` with `@scope`

`@scope` can be used without a selector when placed in an inline `<style>` element, scoping to the parent element automatically.

```html
<div class="widget">
  <style>
    @scope {
      /* Scoped to .widget, the parent of this <style> */
      p {
        color: green;
      }
    }
  </style>
  <p>This text is green</p>
</div>

<p>This text is NOT green</p>
```

## Browser Support

- Chrome 118+
- Edge 118+
- Safari 17.4+
- Firefox 146+ (added in 2025)

`@scope` reached Baseline compatibility with Firefox 146. Global support exceeds 90%.

## Common AI Mistakes

- Not knowing `@scope` exists and using BEM or complex selectors to avoid style leaking
- Confusing `@scope` with Shadow DOM encapsulation — `@scope` does not prevent external styles from applying to scoped elements
- Forgetting the donut scope pattern (`to` keyword) for preventing styles from leaking into nested components
- Not understanding proximity-based styling and how it interacts with the cascade
- Using JavaScript-based scoping (CSS modules, styled-components) when native `@scope` would suffice for the use case
- Confusing `@scope` with `@layer` — layers manage priority/specificity order; scope manages which DOM subtree styles apply to

## When to Use

- Component-based styling where parent styles should not leak into nested child components
- Donut scope for styling a component's wrapper/chrome without affecting its content slot
- Theme switching with proximity-based cascade resolution
- Inline `<style>` blocks that should only affect their immediate context
- Complementing `@layer` — use layers for priority management and scope for DOM targeting

## References

- [@scope - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope)
- [@scope - CSS-Tricks](https://css-tricks.com/almanac/rules/s/scope/)
- [Limit the reach of your selectors with @scope - Chrome for Developers](https://developer.chrome.com/docs/css-ui/at-scope)
- [CSS @scope - 12 Days of Web](https://12daysofweb.dev/2023/css-scope)
