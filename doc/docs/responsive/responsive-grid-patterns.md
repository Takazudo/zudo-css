---
sidebar_position: 5
---

# Responsive Grid Patterns

## The Problem

Creating responsive grid layouts traditionally requires multiple media queries with different `grid-template-columns` values at each breakpoint. AI agents almost always hard-code column counts (e.g., `grid-template-columns: repeat(3, 1fr)`) and then add breakpoints to switch to 2 columns and then 1 column. This produces brittle layouts that break when the container width changes unexpectedly. CSS Grid has built-in features that make grids inherently responsive without any media queries.

## The Solution

Use `repeat()` with `auto-fill` or `auto-fit` combined with `minmax()` to create grids that automatically adjust their column count based on available space. This is sometimes called the **RAM pattern** (Repeat, Auto, Minmax).

### auto-fill vs. auto-fit

- **`auto-fill`**: Creates as many tracks as will fit in the container. Empty tracks remain and take up space.
- **`auto-fit`**: Creates as many tracks as will fit, but collapses empty tracks to zero width, allowing filled tracks to stretch.

When the grid has fewer items than columns, the difference becomes visible:

- `auto-fill` preserves the empty column slots (useful for consistent column widths).
- `auto-fit` collapses empty slots and stretches existing items to fill the row.

## Code Examples

### Basic Responsive Grid (RAM Pattern)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

This single line creates a grid where:

- Each column is at least `250px` wide.
- Columns grow equally to fill remaining space (`1fr`).
- As the container shrinks, columns automatically wrap to fewer per row.
- No media queries needed.

### auto-fill: Consistent Column Slots

```css
.grid-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
```

```html
<div class="grid-fill">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <!-- Only 2 items, but empty column slots are preserved -->
</div>
```

Use `auto-fill` when you want consistent column sizing even with fewer items than available slots.

### auto-fit: Items Stretch to Fill

```css
.grid-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
```

```html
<div class="grid-fit">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <!-- 2 items stretch to fill the entire row -->
</div>
```

Use `auto-fit` when you want items to expand and fill the available space regardless of item count.

### Preventing Overflow with min()

A common issue with `minmax(250px, 1fr)` is that on viewports narrower than `250px`, the grid overflows. Use `min()` to fix this:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));
  gap: 1.5rem;
}
```

`min(250px, 100%)` ensures columns never exceed the container width, even on very narrow screens.

### Card Grid with Consistent Heights

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface, #f5f5f5);
  border-radius: 0.5rem;
  overflow: hidden;
}

.card__body {
  flex: 1;
  padding: 1.5rem;
}

.card__footer {
  padding: 1rem 1.5rem;
  margin-block-start: auto;
}
```

### Responsive Grid with Minimum Column Count

Sometimes you want at least 2 columns even on narrow screens. Combine the RAM pattern with a media query only for the smallest size:

```css
.grid-min-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 40rem) {
  .grid-min-2 {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
```

### Asymmetric Responsive Layout

For layouts where one column should be wider (e.g., main content + sidebar):

```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 50rem) {
  .layout {
    grid-template-columns: 1fr 20rem;
  }
}
```

### Dense Packing for Varied-Size Items

When grid items have different spans, use `grid-auto-flow: dense` to fill gaps:

```css
.masonry-like {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-flow: dense;
  gap: 1rem;
}

.masonry-like .wide {
  grid-column: span 2;
}

.masonry-like .tall {
  grid-row: span 2;
}
```

### Responsive Grid with Subgrid for Aligned Content

When card content (title, text, footer) needs to align across a row:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 1.5rem;
}

@supports (grid-template-rows: subgrid) {
  .card-grid {
    grid-template-rows: auto;
  }

  .card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3; /* title, body, footer */
  }
}
```

## Common AI Mistakes

- **Hard-coding column counts**: Writing `grid-template-columns: repeat(3, 1fr)` and then adding media queries to change to 2 and 1 columns, instead of using `auto-fill`/`auto-fit` with `minmax()`.
- **Confusing `auto-fill` and `auto-fit`**: Using them interchangeably. When the grid has fewer items than columns, they behave differently.
- **Not preventing overflow**: Using `minmax(250px, 1fr)` without `min(250px, 100%)`, causing horizontal overflow on narrow viewports.
- **Using Flexbox for grid layouts**: Reaching for `display: flex; flex-wrap: wrap` with percentage widths and gap hacks when CSS Grid provides a cleaner solution with `auto-fill`.
- **Overusing media queries**: Adding breakpoints for every column count change instead of letting `auto-fill`/`auto-fit` handle it automatically.
- **Ignoring `grid-auto-flow: dense`**: Leaving gaps in the grid when items have different sizes, instead of using dense packing.

## When to Use

- **Card grids**: Product listings, blog post grids, image galleries — any uniform-item grid.
- **Dashboard layouts**: Widgets or panels that should fill available space.
- **`auto-fill`**: When you want consistent column widths even with fewer items (e.g., a product grid that should keep its structure).
- **`auto-fit`**: When you want items to stretch and fill the row (e.g., a hero section with 1-3 feature cards).
- **Not for complex asymmetric layouts**: Use explicit `grid-template-columns` and `grid-template-areas` for layouts with sidebars, headers, and footers.

## References

- [Auto-Sizing Columns in CSS Grid: auto-fill vs auto-fit — CSS-Tricks](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)
- [minmax() — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/minmax)
- [Auto-placement in Grid Layout — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Auto-placement)
- [Responsive CSS Grid Layouts — Harshal V. Ladhe](https://harshal-ladhe.netlify.app/post/responsive-css-grid-layouts)
