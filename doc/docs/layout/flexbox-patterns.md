---
sidebar_position: 1
---

# Flexbox Patterns

## The Problem

Flexbox is the most commonly used CSS layout model, yet AI agents frequently misapply it. Common mistakes include using flexbox when CSS Grid is more appropriate, forgetting to set `min-width: 0` to prevent overflow, using fixed heights instead of flex-grow for sticky footers, and defaulting to `justify-content` and `align-items` without understanding the flex axis.

## The Solution

Flexbox is a one-dimensional layout model. It excels at distributing space along a single axis (row or column). Use it for component-level layouts, navigation bars, toolbars, and any scenario where items flow in one direction.

## Code Examples

### Centering (Horizontal and Vertical)

```css
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

```html
<div class="centered-container">
  <div class="content">Perfectly centered</div>
</div>
```

### Equal-Height Columns

Flex items in a row container stretch to the same height by default via `align-items: stretch`.

```css
.columns {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
  /* No need for align-items or explicit height */
}
```

```html
<div class="columns">
  <div class="column">Short content</div>
  <div class="column">
    <p>Much longer content that determines the height of all columns.</p>
    <p>All siblings will match this height automatically.</p>
  </div>
  <div class="column">Medium content here</div>
</div>
```

### Sticky Footer

The footer sticks to the bottom of the viewport when content is short, and flows naturally below content when it is tall.

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}

main {
  flex: 1;
}

/* header and footer need no special styles */
```

```html
<body>
  <header>Header</header>
  <main>Main content</main>
  <footer>Footer</footer>
</body>
```

### Space-Between with Wrapping

When items wrap, `justify-content: space-between` can leave awkward gaps on the last row. Use `gap` instead for consistent spacing.

```css
/* Problematic: last row items spread apart */
.bad-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Better: consistent gaps between items */
.good-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.good-wrap > * {
  flex: 0 1 calc(33.333% - 1rem);
}
```

### Preventing Overflow with min-width: 0

Flex items have `min-width: auto` by default, which prevents them from shrinking below their content size. This causes text overflow in constrained layouts.

```css
.card {
  display: flex;
  gap: 1rem;
}

.card-content {
  flex: 1;
  min-width: 0; /* Allow content to shrink and enable text-overflow */
}

.card-content h2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Navigation Bar

```css
.navbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-logo {
  margin-right: auto; /* Pushes nav items to the right */
}
```

```html
<nav class="navbar">
  <a class="navbar-logo" href="/">Logo</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

## Common AI Mistakes

- **Using flexbox for two-dimensional layouts.** If items need to align in both rows and columns simultaneously, CSS Grid is the correct choice. Flexbox only controls one axis.
- **Using `height: 100vh` instead of `min-height: 100vh` for sticky footer.** A fixed height causes content overflow on long pages.
- **Forgetting `min-width: 0` on flex items.** Without it, flex items refuse to shrink below their content width, causing horizontal overflow.
- **Using `margin` instead of `gap` for spacing.** Margin on flex items creates double spacing where items meet and requires workarounds for first/last child. `gap` applies only between items.
- **Using `flex-wrap: wrap` with `justify-content: space-between`.** This creates unpredictable gaps on the last row. Use `gap` with calculated flex-basis instead.
- **Writing `flex: 1 1 0` when `flex: 1` suffices.** The shorthand `flex: 1` already sets `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`.
- **Nesting flex containers unnecessarily.** If a simple `margin-right: auto` or `gap` can achieve the spacing, avoid wrapping items in extra containers.

## When to Use

### Flexbox is ideal for

- Single-axis layouts (a row of buttons, a navigation bar, a toolbar)
- Distributing space among items of unknown or varying size
- Vertically centering content within a container
- Component-level layout (card internals, form rows, media objects)
- Sticky footers using `flex-direction: column`

### Use CSS Grid instead when

- You need items to align in both rows and columns (a grid of cards)
- You have a complex page-level layout with named areas
- You want auto-placement of items into a responsive grid
- You need items to span multiple rows or columns

## References

- [A Complete Guide to Flexbox - CSS-Tricks](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Flexbox - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)
- [Solved by Flexbox](https://philipwalton.github.io/solved-by-flexbox/)
- [Flexbox Layout - web.dev](https://web.dev/learn/css/flexbox)
