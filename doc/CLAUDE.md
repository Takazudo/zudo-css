# doc/ — Docusaurus Site

All development happens in this directory. Docusaurus v3 site with v4 future flags enabled.

## Commands

```bash
pnpm install            # Install dependencies
pnpm start              # Dev server → http://css-bp.localhost:8811
pnpm start:ja           # Dev server (Japanese locale)
pnpm build              # Production build
pnpm check              # Typecheck + format check
pnpm check:fix          # Auto-fix formatting
```

Data generation (`pnpm generate`) runs automatically before `start` and `build`.
It generates `src/data/doc-titles.json` and `src/data/category-nav.json` from frontmatter.

## Article Files

- Format: MDX with YAML frontmatter (`sidebar_position`)
- Location: `docs/<category>/`
- File naming: **kebab-case** (e.g., `centering-techniques.mdx`)
- Categories: layout, typography, spacing-sizing, color, visual-effects, responsive, interactive, methodology, overview

### Article Structure

Follow this pattern for all articles:

1. `## The Problem` — what goes wrong, common mistakes
2. `## The Solution` — recommended approach with CssPreview demos
3. More sections with demos as needed
4. `## When to Use` — summary of when this technique applies

### CssPreview Demos

**Always include CssPreview demos** — they are the most valuable part of each article. Every CSS concept should have a corresponding demo. Prefer more demos over more prose.

```mdx
import CssPreview from '@site/src/components/CssPreview';

<CssPreview
  title="Description of demo"
  html={`<div class="example">Content</div>`}
  css={`.example { color: hsl(220 50% 50%); }`}
  height={300} />
```

Key details:

- Renders inside an **iframe** — all CSS is fully isolated
- Viewport buttons: Mobile (320px), Tablet (768px), Full (~900-1100px)
- No JavaScript — interactions must be CSS-only (`:hover`, `:focus`, `:checked`, etc.)
- Media queries evaluate against the **iframe width**, not the browser window
- If article uses production breakpoints (1024px+), remap to smaller values in demos so scaling is visible

### CSS Conventions in Demos

- Use `hsl()` colors, not hex
- Use descriptive BEM-ish class names (e.g., `.card-demo__header`)
- Use `font-family: system-ui, sans-serif` for body text
- Minimum font size: 0.75rem / 12px for labels
- Use `color: hsl(0 0% 40%)` or darker for small text (contrast)

### Deep Articles

For topics with enough depth, use the "deep article" pattern: convert a flat `.mdx` into a folder with `index.mdx` + sub-pages. See the `/l-handle-deep-article` skill for the full process.

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| CssPreview | `src/components/CssPreview/` | Live CSS demos in iframes with viewport switching |
| TailwindPreview | `src/components/TailwindPreview/` | Tailwind-specific demos (uses CDN) |
| PreviewBase | `src/components/PreviewBase/` | Shared base for preview components |
| CategoryNav | `src/components/CategoryNav/` | Category navigation on index pages |
| DocsSitemap | `src/components/DocsSitemap/` | Full documentation sitemap |

## Pre-commit Hooks

husky + lint-staged runs on commit:

- `*.{js,jsx,ts,tsx,mjs}` → prettier
- `*.{md,mdx}` → `@takazudo/mdx-formatter` (via `scripts/mdx-format.sh`)
- `*.{json,css,yml,yaml}` → prettier

## Other

- Custom Docusaurus plugin: `plugins/remark-creation-date.js` — adds creation date metadata
- Swizzled theme component: `src/theme/DocItem/` — customized doc page layout
- i18n: Japanese translations go to `i18n/ja/docusaurus-plugin-content-docs/current/`
