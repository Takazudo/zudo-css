# zcss — CSS Best Practices for AI

Docusaurus documentation site teaching CSS best practices to AI agents.

## Project Structure

```
zcss/
  doc/                    # Docusaurus site (all dev happens here)
    docs/                 # MDX documentation by category
    src/components/       # CssPreview, CategoryNav, DocsSitemap
    src/theme/            # Swizzled Docusaurus theme components
    src/css/              # Custom styles
    src/data/             # Generated JSON (gitignored)
    scripts/              # Build-time generation scripts
    plugins/              # Docusaurus plugins (remark-creation-date)
    static/               # Static assets
  .husky/                 # Git hooks (pre-commit: lint-staged)
```

## Development

Package manager: **pnpm** (Node.js >= 20)

```bash
cd doc
pnpm install            # Install dependencies
pnpm start              # Dev server → http://css-bp.localhost:8811
pnpm build              # Production build
pnpm check              # Typecheck + format check
pnpm check:fix          # Auto-fix formatting
```

Data generation (`pnpm generate`) runs automatically before `start` and `build`.

## Documentation Files

- Format: MDX with YAML frontmatter (`sidebar_position`)
- Location: `doc/docs/<category>/`
- File naming: **kebab-case** (e.g., `centering-techniques.mdx`)
- CssPreview component: renders live CSS demos in iframes with viewport switching
- CategoryNav component: category navigation on index pages
- Categories: layout, typography, spacing-sizing, color, visual-effects, responsive, interactive, modern-css, inbox

## Writing Documentation Articles

- **Always include CssPreview demos** — working, interactive demos are the most valuable part of each article. Every CSS concept explained should have a corresponding CssPreview demo that readers can see and interact with. Prefer more demos over more prose.
- Article structure: `## The Problem` → `## The Solution` → inline CssPreview demos → `## When to Use`
- Use `hsl()` colors, not hex
- Use descriptive BEM-ish CSS class names in demos
- CssPreview demos are iframes with no JavaScript — all interactions must be CSS-only (`:hover`, `:focus`, `:checked`, etc.)
- For topics with enough depth, use the "deep article" pattern: convert a flat `.mdx` into a folder with `index.mdx` + sub-pages (see `/l-handle-deep-article` skill)

## Pre-commit Hooks

husky + lint-staged runs on commit:

- `*.{js,jsx,ts,tsx,mjs}` → prettier
- `*.{md,mdx}` → mdx-formatter
- `*.{json,css,yml,yaml}` → prettier

## Safety Rules

- `rm -rf`: relative paths only (`./path`), never absolute
- No force push, no `--amend` unless explicitly permitted
- Temp files go to `__inbox/` (gitignored)
