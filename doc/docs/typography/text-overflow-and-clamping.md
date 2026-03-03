---
sidebar_position: 3
---

# Text Overflow and Line Clamping

## The Problem

Truncating text to fit constrained UI areas — cards, list items, navigation — is a common requirement. AI agents often reach for JavaScript-based solutions or generate incomplete CSS that only handles single-line truncation. Multi-line clamping, in particular, requires specific property combinations that are easy to get wrong. The legacy `-webkit-line-clamp` approach has three required co-dependent properties, and omitting any one of them causes silent failure.

## The Solution

CSS provides two main truncation patterns: single-line ellipsis using `text-overflow` and multi-line clamping using `-webkit-line-clamp` (with the standard `line-clamp` property arriving for broader adoption).

## Code Examples

### Single-Line Ellipsis

```css
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

All three properties are required:

- `white-space: nowrap` prevents line wrapping
- `overflow: hidden` clips the overflowing content
- `text-overflow: ellipsis` displays the `...` indicator

```html
<p class="truncate">
  This is a very long text that will be truncated with an ellipsis at the end
</p>
```

### Multi-Line Clamping (Legacy Syntax)

```css
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

All four properties are required for this pattern to work. This syntax, despite using `-webkit-` prefixes, is supported across all major browsers (Chrome, Firefox, Safari, Edge) and is a fully specified behavior.

```html
<div class="card">
  <h3>Card Title</h3>
  <p class="line-clamp-3">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris.
  </p>
</div>
```

### Modern `line-clamp` Property

The standard `line-clamp` property simplifies the syntax. As of 2025, Chromium-based browsers support this.

```css
.line-clamp-modern {
  line-clamp: 3;
  overflow: hidden;
}
```

### Cross-Browser Safe Pattern

For maximum compatibility, combine both approaches:

```css
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
```

### Practical Card Component

```css
.card {
  max-width: 320px;
  padding: 1rem;
}

.card__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

```html
<article class="card">
  <h3 class="card__title">A very long card title that might overflow</h3>
  <p class="card__description">
    Card description text that can span multiple lines but will be clamped to
    exactly three lines with an ellipsis at the end of the third line.
  </p>
</article>
```

### Expandable Clamped Text

```css
.expandable {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expandable.is-expanded {
  -webkit-line-clamp: unset;
}
```

### Handling Clamped Text Accessibility

```html
<p class="line-clamp-3" title="Full text content goes here for tooltip access">
  Truncated visible content...
</p>
```

## Common AI Mistakes

- Forgetting one of the three required properties for single-line truncation — all of `white-space`, `overflow`, and `text-overflow` must be set
- Missing `display: -webkit-box` or `-webkit-box-orient: vertical` in multi-line clamping, causing the clamp to silently fail
- Using JavaScript to truncate text by character count instead of CSS, which breaks at different font sizes and screen widths
- Not setting a width constraint on the container — `text-overflow: ellipsis` requires the element to have a bounded width (either explicit or from a flex/grid parent)
- Using `overflow: hidden` without `text-overflow: ellipsis`, which clips text mid-character without any visual indicator
- Applying `-webkit-line-clamp` to inline elements — it requires a block-level box with the `-webkit-box` display model
- Not considering that clamped text hides content from screen readers — the full text is still in the DOM, but visual-only users lose context about how much is hidden

## When to Use

### Single-line truncation

- Navigation items with dynamic labels
- Table cells with variable-width content
- Tags and badges with constrained widths
- Breadcrumb links

### Multi-line clamping

- Card descriptions in grid layouts
- Comment previews in social interfaces
- Product descriptions in listing pages
- Article excerpts or teasers

### When NOT to truncate

- Primary content that users need to read in full
- Error messages and validation text
- Accessibility-critical labels and instructions
- Content where the truncated portion changes meaning (e.g., prices, dates)

## References

- [MDN: text-overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)
- [MDN: -webkit-line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp)
- [MDN: line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-clamp)
- [CSS-Tricks: line-clamp](https://css-tricks.com/almanac/properties/l/line-clamp/)
- [How to use CSS line-clamp — LogRocket](https://blog.logrocket.com/css-line-clamp/)
