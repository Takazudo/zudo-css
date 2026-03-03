---
sidebar_position: 2
---

# The :has() Selector

## The Problem

CSS has never had a way to select a parent element based on its children. Developers have relied on JavaScript to toggle classes for parent-child state relationships, such as highlighting a form group when its input is invalid, or changing a card layout based on whether it contains an image. AI agents almost never use `:has()` and instead suggest JavaScript-based solutions for these patterns.

## The Solution

The `:has()` relational pseudo-class selects elements that contain at least one element matching the given selector list. It acts as a "parent selector" but is far more powerful: it can look at any relative position (children, siblings, descendants) to conditionally apply styles.

## Code Examples

### Basic Parent Selection

```css
/* Style a card differently when it contains an image */
.card:has(img) {
  grid-template-rows: 200px 1fr;
}

.card:has(img) .card-body {
  padding-top: 0;
}
```

### Form Validation Styling

Style form groups based on input validity without JavaScript.

```css
/* Highlight the entire field group when input is invalid */
.field-group:has(:user-invalid) {
  border-left: 3px solid red;
  background: #fff5f5;
}

.field-group:has(:user-invalid) .error-message {
  display: block;
}

/* Style label when its sibling input is focused */
.field-group:has(input:focus) label {
  color: blue;
  font-weight: bold;
}
```

```html
<div class="field-group">
  <label for="email">Email</label>
  <input type="email" id="email" required />
  <span class="error-message">Please enter a valid email</span>
</div>
```

### Quantity Queries

Adapt layout based on the number of children, with no JavaScript required.

```css
/* Switch to grid layout when a list has 5 or more items */
.item-list:has(> :nth-child(5)) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* Single-column layout for fewer items */
.item-list:not(:has(> :nth-child(5))) {
  display: flex;
  flex-direction: column;
}
```

```css
/* Style based on even/odd number of children */
.grid:has(> :last-child:nth-child(even)) {
  /* Even number of children */
  grid-template-columns: repeat(2, 1fr);
}

.grid:has(> :last-child:nth-child(odd)) {
  /* Odd number of children */
  grid-template-columns: repeat(3, 1fr);
}
```

### Styling Based on Sibling State

```css
/* Change page layout when a sidebar checkbox is checked */
body:has(#sidebar-toggle:checked) .main-content {
  margin-left: 0;
}

body:has(#sidebar-toggle:checked) .sidebar {
  transform: translateX(-100%);
}
```

### Combining with Other Selectors

```css
/* Style a navigation item that contains the current page link */
nav li:has(> a[aria-current="page"]) {
  background: #e0e7ff;
  border-radius: 4px;
}

/* Style a table row that has an empty cell */
tr:has(td:empty) {
  opacity: 0.6;
}
```

### Using `:has()` with Direct Child Combinator

Use the direct child combinator `>` for better performance. It limits the browser's search to immediate children instead of all descendants.

```css
/* Preferred: direct child (faster) */
.container:has(> .alert) {
  border: 2px solid red;
}

/* Avoid when possible: descendant (slower on large DOMs) */
.container:has(.alert) {
  border: 2px solid red;
}
```

## Browser Support

- Chrome 105+
- Safari 15.4+
- Firefox 121+
- Edge 105+

Global support exceeds 96%. Feature detection is available with `@supports selector(:has(*))`.

## Common AI Mistakes

- Suggesting JavaScript class toggling when `:has()` solves the problem in pure CSS
- Not knowing `:has()` exists and recommending workarounds
- Using descendant selectors inside `:has()` when direct child `>` would be more performant
- Not combining `:has()` with `:not()` for inverse logic (e.g., `.card:not(:has(img))`)
- Forgetting that `:has()` can look at siblings, not just descendants (e.g., `h2:has(+ p)`)
- Attempting to polyfill `:has()` — it requires real-time DOM awareness and cannot be efficiently polyfilled

## When to Use

- Parent styling based on child state (form validation, content-aware layouts)
- Quantity queries to adapt layout based on number of children
- State-driven styling without JavaScript (checkbox hacks, focus management)
- Conditional component styling based on content presence

## References

- [:has() - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has)
- [:has() CSS relational pseudo-class - Can I Use](https://caniuse.com/css-has)
- [CSS :has() Parent Selector - Ahmad Shadeed](https://ishadeed.com/article/css-has-parent-selector/)
- [The CSS :has Selector - CSS-Tricks](https://css-tricks.com/the-css-has-selector/)
- [Quantity Queries with CSS :has() - Frontend Masters](https://frontendmasters.com/blog/quantity-queries-are-very-easy-with-css-has/)
