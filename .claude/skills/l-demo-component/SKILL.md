---
name: l-demo-component
description: >-
  Guidance for using CssPreview component in zcss documentation articles.
  Use when: (1) Writing or editing CssPreview demos in MDX articles, (2) Deciding whether to use
  defaultOpen={true} or false, (3) User asks about demo component usage patterns.
user-invocable: true
argument-hint: "[question about demo component usage]"
---

# Demo Component Usage Guide

Guidelines for using the CssPreview component in zcss documentation articles.

## CssPreview Component

Located at: `doc/src/components/CssPreview/index.tsx`

### Basic Usage

```mdx
import CssPreview from '@site/src/components/CssPreview';

<CssPreview
  title="Description of demo"
  html={`<div class="example">Content</div>`}
  css={`.example { color: hsl(220 50% 50%); }`}
  height={300} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Description shown above the demo |
| `html` | `string` | required | HTML content rendered in the iframe |
| `css` | `string` | `""` | CSS styles applied in the iframe |
| `height` | `number` | auto | Fixed height for the iframe |
| `defaultOpen` | `boolean` | `false` | Whether code section is expanded initially |

### Rendering Behavior

- Renders inside an `<iframe>` — all CSS is isolated
- Viewport buttons: Mobile (320px), Tablet (768px), Full (100%)
- No JavaScript — all interactions must be CSS-only (`:hover`, `:focus`, `:checked`, etc.)
- Media queries respond to the **iframe width**, not the browser window

### Important: Media Queries in Demos

Since CssPreview renders in an iframe, `@media (min-width: ...)` queries evaluate against the iframe's width:

- Mobile preset: **320px**
- Tablet preset: **768px**
- Full preset: **~900-1100px** (depends on Docusaurus content area)

If your article code examples use production breakpoints (e.g., 1024px, 1280px), remap them to smaller values in the CssPreview demo CSS so the scaling is visible.

## defaultOpen Prop

Controls whether the code section is expanded when the demo first renders.

### defaultOpen={false} (default)

Use when the article is explaining a concept and the demo illustrates it.
The reader focuses on the visual result first; code is available on demand.

```mdx
<CssPreview html={...} css={...} />
```

### defaultOpen={true}

Use when showing code for confirmation — the reader needs to see both
the code and the rendered result together to understand what's happening.

```mdx
<CssPreview html={...} css={...} defaultOpen={true} />
```

### Variety listings

Use default (false) when listing a variety of visual patterns where code is secondary
and visual comparison is the primary goal.

```mdx
<CssPreview html={...} css={...} />
<CssPreview html={...} css={...} />
<CssPreview html={...} css={...} />
```

## Summary

| Situation | defaultOpen |
| --- | --- |
| Explaining a concept, demo illustrates it | false (default) |
| Showing code for confirmation | true |
| Listing variety of visual patterns | false (default) |

## CSS Conventions in Demos

- Use `hsl()` colors, not hex
- Use descriptive BEM-ish class names (e.g., `.card-demo__header`)
- Use `font-family: system-ui, sans-serif` for body text
- Keep font sizes accessible (minimum 0.75rem / 12px for labels)
- Use `color: hsl(0 0% 40%)` or darker for small text (contrast)
