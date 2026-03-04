---
name: css-wisdom
description: >-
  Reference CSS best practices documentation when working on CSS, styling, or front-end layout
  tasks. Use when: (1) Writing or reviewing CSS code, (2) Choosing between CSS approaches (e.g.,
  flexbox vs grid, gap vs margin), (3) Implementing visual effects, responsive layouts, or modern
  CSS features, (4) User asks about CSS best practices or patterns.
user-invocable: true
argument-hint: "[topic keyword, e.g., 'flexbox', 'dark mode', 'centering']"
---

# CSS Best Practices Reference

Look up CSS best practices from the documentation articles in this project.
Base path: `doc/docs/` (relative to repo root).

If this skill was loaded via symlink, resolve the symlink target to find the repo:
`readlink ~/.claude/skills/css-wisdom/SKILL.md`

## How to Use

1. Find the relevant article(s) from the topic index below based on the CSS task at hand
2. Read ONLY the specific article(s) you need — do NOT load all articles at once
3. Apply the patterns and recommendations from the article when writing CSS
4. Mention the source article path so the user can find it for further reading

## Topic Index

Each entry: `file path` — brief description.

### Layout

- `layout/flexbox-patterns.mdx` — Flex axis, min-width: 0, sticky footers, common misuses
- `layout/grid-patterns.mdx` — auto-fill vs auto-fit, minmax(), grid-template-areas
- `layout/centering-techniques.mdx` — Flexbox/grid centering, avoiding overcomplicated solutions
- `layout/positioning-guide.mdx` — When to use relative/absolute/fixed/sticky correctly
- `layout/stacking-context.mdx` — z-index wars, stacking context creation and debugging
- `layout/object-fit-and-position.mdx` — object-fit values, object-position focal point, vs background-image
- `layout/multi-column-layout.mdx` — CSS columns, break-inside, masonry-style layouts without JS
- `layout/table-cell-width-control.mdx` — table-layout fixed, controlling column widths, overflow in cells

### Typography

- `typography/fluid-font-sizing.mdx` — clamp() for responsive font sizes without breakpoints
- `typography/line-height-best-practices.mdx` — Unitless line-height, inheritance pitfalls
- `typography/text-overflow-and-clamping.mdx` — Single-line truncation, multi-line -webkit-line-clamp
- `typography/vertical-rhythm.mdx` — Consistent spacing with a baseline unit
- `typography/font-loading-strategies.mdx` — FOIT/FOUT, font-display, preload, fallback metrics
- `typography/variable-fonts.mdx` — Single file for all weights/widths, font-variation-settings
- `typography/text-wrap-balance-pretty.mdx` — text-wrap: balance for headings, pretty for orphan prevention
- `typography/japanese-font-family.mdx` — Japanese font stack, Noto Sans JP, system fonts for CJK
- `typography/noto-sans-webfont-guide.mdx` — Loading Noto Sans JP as webfont, subsetting, performance

### Spacing & Sizing

- `spacing-sizing/fit-content.mdx` — fit-content, max-content, min-content for intrinsic sizing
- `spacing-sizing/aspect-ratio.mdx` — Modern aspect-ratio property vs padding-top hack
- `spacing-sizing/logical-properties.mdx` — margin-inline, padding-block for i18n/RTL support
- `spacing-sizing/clamp-for-sizing.mdx` — Fluid sizing with clamp() for padding, widths, etc.
- `spacing-sizing/gap-vs-margin.mdx` — Use gap in flex/grid, avoid margin collapse issues

### Color

- `color/oklch-color-space.mdx` — Perceptually uniform colors, consistent palettes
- `color/color-mix.mdx` — Native tints/shades/alpha variants with color-mix()
- `color/currentcolor-patterns.mdx` — Inherit text color for borders, shadows, SVG fills
- `color/dark-mode-strategies.mdx` — Custom properties, prefers-color-scheme, perceived brightness
- `color/color-contrast-accessibility.mdx` — WCAG contrast ratios, checking and fixing violations
- `color/color-palette-strategy.mdx` — Systematic palette generation, semantic color naming

### Visual Effects

- `visual-effects/layered-natural-shadows.mdx` — Multi-layer box-shadow for realistic depth
- `visual-effects/gradient-techniques/index.mdx` — Layered gradients, hard stops, gradient text
  - `visual-effects/gradient-techniques/css-pattern-library.mdx` — CSS-only patterns: stripes, dots, checkerboard, carbon fiber
- `visual-effects/border-techniques.mdx` — Gradient borders, outline tricks, border-image caveats
- `visual-effects/backdrop-filter-and-glassmorphism.mdx` — Frosted glass, -webkit- prefix, pitfalls
- `visual-effects/clip-path-and-mask.mdx` — Non-rectangular shapes, circular reveals, faded edges
- `visual-effects/smooth-shadow-transitions.mdx` — Performant shadow hover with pseudo-elements
- `visual-effects/blend-modes.mdx` — mix-blend-mode, background-blend-mode, isolation
- `visual-effects/filter-effects.mdx` — drop-shadow vs box-shadow, chained filters, backdrop-filter
- `visual-effects/css-3d-transforms.mdx` — perspective, transform-style, backface-visibility, card flips

### Responsive

- `responsive/container-queries.mdx` — Component-level responsiveness with @container
- `responsive/fluid-design-with-clamp.mdx` — Fluid scaling for all properties with clamp()
- `responsive/responsive-images.mdx` — srcset, sizes, picture, object-fit, aspect-ratio
- `responsive/media-query-best-practices.mdx` — Mobile-first, preference queries, @supports
- `responsive/responsive-grid-patterns.mdx` — Auto-responsive grids without media queries

### Interactive

- `interactive/hover-focus-active-states.mdx` — Touch-safe hover, focus-visible, distinct states
- `interactive/transition-best-practices.mdx` — Compositor-friendly properties, allow-discrete
- `interactive/scroll-snap.mdx` — Native snap-to-slide carousels without JS
- `interactive/scroll-driven-animations.mdx` — CSS-native scroll-linked animations, zero JS
- `interactive/touch-target-sizing.mdx` — WCAG minimum target sizes, accessible tap areas
- `interactive/prefers-reduced-motion.mdx` — Respecting motion preferences without removing all motion
- `interactive/form-control-styling.mdx` — appearance, accent-color, field-sizing, caret-color
- `interactive/overscroll-behavior.mdx` — Prevent scroll chaining in modals, sidebars, chat panels
- `interactive/parent-state-child-styling.mdx` — Parent hover/focus/checked → child styling (Tailwind group pattern)

### Modern CSS

- `modern-css/css-nesting.mdx` — Native nesting syntax, & selector, differences from Sass
- `modern-css/has-selector.mdx` — Parent selection based on children, form validation styling
- `modern-css/cascade-layers.mdx` — @layer for specificity management, third-party CSS control
- `modern-css/css-scope.mdx` — @scope for component-level style isolation
- `modern-css/custom-properties-advanced/index.mdx` — Space toggle trick, fallback chains, computed vars
  - `modern-css/custom-properties-advanced/pattern-catalog.mdx` — Responsive vars, calc spacing, HSL color system
  - `modern-css/custom-properties-advanced/theming-recipes.mdx` — Light/dark theme, brand override, component API
- `modern-css/at-property.mdx` — Typed custom properties, animatable gradients
- `modern-css/subgrid.mdx` — Align nested content across sibling grid items
- `modern-css/is-where-selectors.mdx` — :is() for grouping, :where() for zero-specificity resets
- `modern-css/view-transitions.mdx` — Animated page/state transitions with View Transitions API
- `modern-css/anchor-positioning.mdx` — Pure CSS tooltips/popovers positioned to other elements

### Inbox (Strategy Guides)

- `inbox/bem-strategy.mdx` — BEM naming convention for scalable, collision-free CSS
- `inbox/tight-token-strategy/index.mdx` — Constraining Tailwind's token set for design consistency
  - `inbox/tight-token-strategy/color-tokens.mdx` — Semantic color token patterns, palette growth naming
  - `inbox/tight-token-strategy/typography-tokens.mdx` — Typography token strategy for Tailwind v4
  - `inbox/tight-token-strategy/token-preview.mdx` — Visual reference of all available tokens
  - `inbox/tight-token-strategy/component-tokens.mdx` — System tokens vs arbitrary values decision framework
- `inbox/utility-class-strategy.mdx` — Utility-first CSS approach, when and how to apply it
- `inbox/css-modules-strategy.mdx` — CSS Modules approach for component-scoped styles
- `inbox/screen-width-based-font-size.mdx` — Segmented clamp() per breakpoint for piecewise fluid typography
