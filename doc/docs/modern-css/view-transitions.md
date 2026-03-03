---
sidebar_position: 9
---

# View Transitions

## The Problem

Creating smooth animated transitions between page states or during navigation has traditionally required complex JavaScript animation libraries, manual DOM manipulation, or framework-specific solutions like React Transition Group. Page navigations (both SPA and MPA) result in abrupt content swaps with no visual continuity. AI agents default to JavaScript-heavy animation approaches and almost never suggest the View Transitions API.

## The Solution

The View Transitions API provides a native mechanism for creating animated transitions between DOM states. The browser captures a snapshot of the old state, applies the DOM update, then animates between old and new snapshots using CSS. For same-document (SPA) transitions, use `document.startViewTransition()`. For cross-document (MPA) transitions, use the `@view-transition` CSS at-rule to opt both pages in.

## Code Examples

### Same-Document View Transition (SPA)

```css
/* Default crossfade animation — works with no extra CSS */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

```html
<script>
  function updateContent(newHTML) {
    if (!document.startViewTransition) {
      // Fallback: just update directly
      document.getElementById('content').innerHTML = newHTML;
      return;
    }

    document.startViewTransition(() => {
      document.getElementById('content').innerHTML = newHTML;
    });
  }
</script>
```

### Named View Transitions for Element-Level Animation

Give specific elements their own transition by assigning a `view-transition-name`.

```css
.product-image {
  view-transition-name: product-image;
}

.product-title {
  view-transition-name: product-title;
}

/* Customize the animation for the product image */
::view-transition-old(product-image) {
  animation: scale-down 0.4s ease-in;
}

::view-transition-new(product-image) {
  animation: scale-up 0.4s ease-out;
}

@keyframes scale-down {
  from { transform: scale(1); }
  to { transform: scale(0.8); opacity: 0; }
}

@keyframes scale-up {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); }
}
```

### Cross-Document View Transitions (MPA)

Opt both pages into the transition with the `@view-transition` at-rule.

```css
/* Include this in BOTH the source and destination pages */
@view-transition {
  navigation: auto;
}

/* Shared element transitions across pages */
.hero-image {
  view-transition-name: hero;
}

/* Customize the cross-document transition */
::view-transition-old(hero) {
  animation-duration: 0.4s;
}

::view-transition-new(hero) {
  animation-duration: 0.4s;
}
```

### Slide Transition Between Pages

```css
@view-transition {
  navigation: auto;
}

@keyframes slide-from-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slide-to-left {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

::view-transition-old(root) {
  animation: slide-to-left 0.4s ease-in-out;
}

::view-transition-new(root) {
  animation: slide-from-right 0.4s ease-in-out;
}
```

### Using `view-transition-class` for Grouped Animations

Apply the same animation to multiple named transitions without repeating CSS.

```css
.card-1 { view-transition-name: card-1; }
.card-2 { view-transition-name: card-2; }
.card-3 { view-transition-name: card-3; }

/* Apply the same animation class to all cards */
.card-1, .card-2, .card-3 {
  view-transition-class: card;
}

/* One rule animates all card transitions */
::view-transition-group(*.card) {
  animation-duration: 0.35s;
  animation-timing-function: ease-in-out;
}
```

### Conditional Transitions with View Transition Types

```html
<script>
  function navigateForward(updateFn) {
    const transition = document.startViewTransition({
      update: updateFn,
      types: ['slide-forward'],
    });
  }

  function navigateBack(updateFn) {
    const transition = document.startViewTransition({
      update: updateFn,
      types: ['slide-back'],
    });
  }
</script>
```

```css
/* Forward navigation */
:active-view-transition-type(slide-forward) {
  &::view-transition-old(root) {
    animation: slide-to-left 0.3s ease-in-out;
  }
  &::view-transition-new(root) {
    animation: slide-from-right 0.3s ease-in-out;
  }
}

/* Back navigation */
:active-view-transition-type(slide-back) {
  &::view-transition-old(root) {
    animation: slide-to-right 0.3s ease-in-out;
  }
  &::view-transition-new(root) {
    animation: slide-from-left 0.3s ease-in-out;
  }
}
```

### Respecting User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.01ms;
  }
}
```

## Browser Support

### Same-Document View Transitions

- Chrome 111+
- Edge 111+
- Safari 18+
- Firefox 144+ (shipping October 2025 — part of Interop 2025)

### Cross-Document View Transitions

- Chrome 126+
- Edge 126+
- Safari 18.2+
- Firefox: not yet supported

Same-document transitions have broad support. Cross-document transitions are supported in Chromium and Safari but not yet in Firefox. Always provide a fallback by checking for `document.startViewTransition` before calling it.

## Common AI Mistakes

- Using JavaScript animation libraries (GSAP, Framer Motion) for transitions that the View Transitions API handles natively
- Not checking for `document.startViewTransition` support before calling it
- Forgetting to add `@view-transition { navigation: auto; }` to **both** pages for cross-document transitions
- Not assigning `view-transition-name` to shared elements that should animate independently from the page
- Making `view-transition-name` values non-unique on the same page (each name must be unique at transition time)
- Not respecting `prefers-reduced-motion` by disabling or shortening animations for users who prefer reduced motion
- Over-animating: using view transitions for every small UI update instead of meaningful state changes

## When to Use

- Page-to-page navigation transitions (both SPA and MPA)
- Content updates within a page (tab switches, list filtering, detail views)
- Shared element transitions between list and detail views (e.g., product thumbnails)
- Any state change where visual continuity helps the user understand what changed
- Replacing complex JavaScript animation setups with native browser capabilities

## References

- [View Transition API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Smooth transitions with the View Transition API - Chrome for Developers](https://developer.chrome.com/docs/web-platform/view-transitions)
- [What's new in view transitions (2025 update) - Chrome for Developers](https://developer.chrome.com/blog/view-transitions-in-2025)
- [@view-transition - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition)
- [A Practical Guide to the CSS View Transition API - Cyd Stumpel](https://cydstumpel.nl/a-practical-guide-to-the-css-view-transition-api/)
