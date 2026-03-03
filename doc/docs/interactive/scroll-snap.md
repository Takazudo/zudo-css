---
sidebar_position: 3
---

# Scroll Snap

## The Problem

Carousels, slideshows, and horizontally scrolling content sections are extremely common UI patterns. AI agents almost always reach for JavaScript libraries or custom scroll event handlers to implement snap-to-slide behavior. CSS Scroll Snap provides this functionality natively with a few lines of CSS, delivering better performance and touch device compatibility than JavaScript solutions. AI rarely suggests it.

## The Solution

CSS Scroll Snap lets you define snap points on a scroll container so that scrolling naturally locks to specific positions. The browser handles all the physics — momentum, deceleration, and snapping — resulting in smooth, native-feeling scroll behavior on all devices.

### Key Properties

- **`scroll-snap-type`** (on the scroll container): Defines the snapping axis (`x`, `y`, or `both`) and strictness (`mandatory` or `proximity`).
- **`scroll-snap-align`** (on child items): Defines where each item should snap (`start`, `center`, or `end`).
- **`scroll-snap-stop`** (on child items): Controls whether scrolling can skip past items (`normal`) or must stop at each one (`always`).

### mandatory vs. proximity

- **`mandatory`**: The scroll container **always** snaps to a snap point when scrolling stops. Even if the user scrolls only slightly, it snaps to the nearest point. Best for carousels and paginated content.
- **`proximity`**: The scroll container only snaps when near a snap point. If the user scrolls past snap points, it behaves like normal scrolling. Best for long content where snapping is helpful but not required.

## Code Examples

### Horizontal Carousel

```css
.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.carousel__slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
```

```html
<div class="carousel">
  <div class="carousel__slide">Slide 1</div>
  <div class="carousel__slide">Slide 2</div>
  <div class="carousel__slide">Slide 3</div>
</div>
```

### Multi-Item Carousel (Peek Next Item)

```css
.carousel-peek {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 1rem;
  padding-inline: 1rem;
}

.carousel-peek__item {
  flex: 0 0 calc(80% - 0.5rem);
  scroll-snap-align: start;
  border-radius: 0.5rem;
  background: var(--color-surface, #f5f5f5);
  padding: 1.5rem;
}
```

`scroll-padding-inline` on the container ensures the snapped item is offset from the edge, revealing a peek of the next item.

### Vertical Full-Page Sections

```css
.page-sections {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

```html
<div class="page-sections">
  <section class="section">Section 1</section>
  <section class="section">Section 2</section>
  <section class="section">Section 3</section>
</div>
```

### Image Gallery with Center Snapping

```css
.gallery {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding-block: 1rem;
}

.gallery__image {
  flex: 0 0 auto;
  width: min(300px, 80vw);
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 0.5rem;
  scroll-snap-align: center;
}
```

Using `proximity` here allows free-form browsing with gentle snap-to-center behavior.

### Preventing Fast-Scroll Skipping

```css
.carousel-strict {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel-strict__slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always; /* Must stop at every slide */
}
```

`scroll-snap-stop: always` prevents users from swiping past multiple slides at once.

### Responsive Carousel to Grid

```css
.card-scroller {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 1rem;
}

.card-scroller__item {
  flex: 0 0 min(280px, 85vw);
  scroll-snap-align: start;
}

/* On wider screens, switch to a grid layout */
@media (min-width: 48rem) {
  .card-scroller {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    overflow-x: visible;
    scroll-snap-type: none;
  }

  .card-scroller__item {
    scroll-snap-align: unset;
  }
}
```

## Common AI Mistakes

- **Not suggesting scroll snap at all**: Defaulting to JavaScript carousel libraries for scroll-snap behavior that CSS handles natively.
- **Forgetting `scroll-snap-type` on the container**: Setting `scroll-snap-align` on children but not enabling snapping on the parent.
- **Always using `mandatory`**: Using `mandatory` for long scrolling content where `proximity` is more appropriate. `mandatory` on tall content can trap users.
- **Not using `scroll-padding`**: Forgetting to add `scroll-padding` when the page has a fixed header, causing snapped content to be hidden behind it.
- **Hiding scrollbars without maintaining accessibility**: Removing scrollbars with CSS but not providing alternative navigation (arrows, dots).
- **Not using `scroll-snap-stop`**: For step-by-step content (like onboarding flows), not using `scroll-snap-stop: always` to prevent skipping.
- **Fixed-pixel widths for slide items**: Using `flex: 0 0 350px` instead of responsive sizing like `min(300px, 85vw)`.

## When to Use

- **Carousels and slideshows**: Full-width image carousels, testimonial sliders, product showcases.
- **Horizontal scrolling sections**: Card scrollers, category navigation, image galleries.
- **Full-page section scrolling**: Landing pages with distinct sections that snap vertically.
- **Onboarding flows**: Step-by-step screens where each step should snap into view.
- **Not for complex carousel logic**: If you need autoplay, infinite looping, or API-driven slide management, you may still need JavaScript — but the scroll-snap behavior itself should remain CSS-driven.

## References

- [scroll-snap-type — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-type)
- [Basic Concepts of Scroll Snap — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Basic_concepts)
- [Well-Controlled Scrolling with CSS Scroll Snap — web.dev](https://web.dev/articles/css-scroll-snap)
- [Practical CSS Scroll Snapping — CSS-Tricks](https://css-tricks.com/practical-css-scroll-snapping/)
- [CSS Scroll Snap — Ahmad Shadeed](https://ishadeed.com/article/css-scroll-snap/)
