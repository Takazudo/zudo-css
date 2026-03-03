---
sidebar_position: 1
---

# Container Queries

## The Problem

Media queries respond to the viewport width, not the width of the component's container. When a component is placed in a sidebar, a modal, or any constrained layout, viewport-based media queries cannot adapt the component's layout to its actual available space. AI agents almost always reach for `@media` queries for component-level responsiveness, ignoring container queries entirely.

## The Solution

CSS Container Queries (`@container`) allow components to respond to the size of their parent container rather than the viewport. This makes components truly reusable across different layout contexts.

### Setting Up a Container

A parent element must be declared as a containment context using `container-type`. The most common value is `inline-size`, which enables queries based on the container's inline (horizontal) dimension.

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}
```

### Querying the Container

```css
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
```

## Code Examples

### Responsive Card Component

```html
<div class="card-container">
  <article class="card">
    <img class="card__image" src="photo.jpg" alt="Description" />
    <div class="card__body">
      <h3 class="card__title">Card Title</h3>
      <p class="card__text">Card description text goes here.</p>
    </div>
  </article>
</div>
```

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Base: stacked layout */
.card {
  display: flex;
  flex-direction: column;
}

.card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

/* When container is wide enough: horizontal layout */
@container card (min-width: 500px) {
  .card {
    flex-direction: row;
  }

  .card__image {
    width: 200px;
    aspect-ratio: 1;
  }
}

/* When container is very wide: add extra spacing */
@container card (min-width: 800px) {
  .card {
    gap: 2rem;
    padding: 2rem;
  }

  .card__image {
    width: 300px;
  }
}
```

### Navigation That Adapts to Its Container

```css
.nav-wrapper {
  container-type: inline-size;
  container-name: nav;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Horizontal layout when container allows */
@container nav (min-width: 600px) {
  .nav-list {
    flex-direction: row;
    gap: 1rem;
  }
}
```

### Container Query Units

Container query units are relative to the dimensions of the query container. These are useful for fluid sizing within a component.

```css
.card-container {
  container-type: inline-size;
}

.card__title {
  /* 5% of the container's inline size, clamped */
  font-size: clamp(1rem, 5cqi, 2rem);
}

.card__body {
  /* Padding relative to container width */
  padding: 2cqi;
}
```

Available container query units:

- `cqw` — 1% of the container's width
- `cqh` — 1% of the container's height
- `cqi` — 1% of the container's inline size
- `cqb` — 1% of the container's block size
- `cqmin` — the smaller of `cqi` or `cqb`
- `cqmax` — the larger of `cqi` or `cqb`

## Common AI Mistakes

- **Using media queries for component layouts**: AI agents default to `@media` queries even when the component needs to adapt to its container, not the viewport.
- **Forgetting `container-type`**: Writing `@container` rules without setting `container-type` on the parent element. The container must be explicitly declared.
- **Using `container-type: size` unnecessarily**: Height-based containment (`size`) can cause layout loops. Use `inline-size` for the vast majority of cases.
- **Not naming containers**: Omitting `container-name` leads to ambiguity when containers are nested. Always name containers for clarity and predictable behavior.
- **Querying the element itself**: The `@container` query targets the nearest ancestor with `container-type` set, not the element you are styling. The container and the styled element must be different elements.

## When to Use

- **Component-level responsiveness**: Any reusable component that may appear in different layout widths (cards, navigation, form groups).
- **Sidebar vs. main content**: When the same component appears in both wide and narrow contexts on the same page.
- **Design system components**: Components built for reuse across different applications and layouts.
- **Not for page-level layout**: Continue using `@media` queries for macro layout concerns like switching between single-column and multi-column page layouts.

## References

- [CSS Container Queries — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [@container — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container)
- [Container Queries Unleashed — Josh W. Comeau](https://www.joshwcomeau.com/css/container-queries-unleashed/)
- [CSS Container Queries — CSS-Tricks](https://css-tricks.com/css-container-queries/)
- [Container Queries in 2026 — LogRocket](https://blog.logrocket.com/container-queries-2026/)
