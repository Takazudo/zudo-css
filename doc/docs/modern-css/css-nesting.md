---
sidebar_position: 1
---

# CSS Nesting

## The Problem

CSS has historically required flat selector declarations, forcing developers to repeat parent selectors when styling nested elements. This leads to verbose, hard-to-maintain stylesheets where related styles are scattered across the file. AI agents frequently generate flat CSS even when nesting would be cleaner and more maintainable, or they produce Sass-style nesting syntax that is not valid native CSS.

## The Solution

Native CSS nesting allows you to write child selectors inside parent rule blocks, eliminating repetition and keeping related styles grouped together. Since the relaxed nesting syntax update (late 2023), the `&` nesting selector is optional for simple descendant selectors. All major browsers support CSS nesting as of late 2023.

## Code Examples

### Basic Nesting

```css
/* Without nesting (what AI often generates) */
.card {
  padding: 1rem;
  border-radius: 8px;
}
.card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.card p {
  color: #666;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* With native CSS nesting */
.card {
  padding: 1rem;
  border-radius: 8px;

  h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
```

### When `&` Is Required

The `&` selector is required when appending to the parent selector (pseudo-classes, compound selectors) or placing the parent in a non-default position.

```css
.button {
  background: blue;
  color: white;

  /* & is required: appending a pseudo-class */
  &:hover {
    background: darkblue;
  }

  /* & is required: compound selector */
  &.primary {
    background: green;
  }

  /* & is required: parent in non-first position */
  .dark-theme & {
    background: navy;
  }
}
```

### Nesting `@media` Inside Rules

One of the most useful patterns is nesting media queries directly inside the component they affect.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (width <= 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width <= 480px) {
    grid-template-columns: 1fr;
  }
}
```

### Nesting `@media` with Hover Detection

```css
.interactive-card {
  padding: 1rem;
  transition: transform 0.2s;

  @media (hover: hover) {
    &:hover {
      transform: scale(1.02);
    }
  }
}
```

### Nesting Multiple At-Rules

```css
.sidebar {
  width: 100%;

  @media (width >= 768px) {
    width: 300px;
  }

  @container main (width >= 600px) {
    width: 250px;
  }

  @supports (position: sticky) {
    position: sticky;
    top: 1rem;
  }
}
```

## Specificity Behavior

When the parent is a selector list, the browser desugars nested selectors using `:is()`. This can unexpectedly increase specificity.

```css
/* This nesting: */
.card, #featured {
  .title {
    color: blue;
  }
}

/* Desugars to: */
:is(.card, #featured) .title {
  color: blue;
}
/* Specificity is (1,0,1) because :is() takes
   the highest specificity from its arguments (#featured = 1,0,0) */
```

When the parent is a single selector, no `:is()` wrapping occurs and specificity is calculated normally.

## Browser Support

- Chrome 120+
- Firefox 117+
- Safari 17.2+
- Edge 120+

Global support exceeds 90%. For older browser fallbacks, use the `postcss-nesting` PostCSS plugin as a build step.

## Common AI Mistakes

- Generating flat CSS with repeated parent selectors instead of using nesting
- Using Sass-style syntax like `$variable` or `@extend` inside native CSS nesting
- Forgetting `&` for pseudo-classes and compound selectors (`&:hover`, `&.active`)
- Not grouping `@media` queries inside the rule block they modify
- Nesting too deeply (more than 3 levels), reducing readability
- Not accounting for the `:is()` specificity increase when parent is a selector list

## When to Use

- Group related styles for a component (element, pseudo-classes, media queries) in one block
- Reduce repetition of parent selectors
- Keep responsive breakpoints co-located with the component they affect
- Limit nesting to 2-3 levels to maintain readability

## References

- [CSS nesting - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting)
- [Using CSS nesting - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using)
- [CSS nesting at-rules - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/At-rules)
- [CSS Nesting - Can I Use](https://caniuse.com/css-nesting)
