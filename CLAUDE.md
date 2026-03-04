# zcss — zudo-css

Docusaurus documentation site teaching CSS best practices.

## Project Structure

```
zcss/
  doc/                    # Docusaurus site (all dev happens here)
    docs/                 # MDX articles by category
    src/components/       # CssPreview, CategoryNav, DocsSitemap, etc.
    src/theme/            # Swizzled Docusaurus theme components
    src/css/              # Custom styles
    src/data/             # Generated JSON (gitignored)
    scripts/              # Build-time generation scripts
    plugins/              # Docusaurus plugins (remark-creation-date)
    static/               # Static assets
  .husky/                 # Git hooks (pre-commit: lint-staged)
  .claude/skills/         # Claude Code skills managed in this repo
```

## Development

Package manager: **pnpm** (Node.js >= 20). All commands run inside `doc/`:

```bash
cd doc
pnpm install && pnpm start    # Dev server → http://css-bp.localhost:8811
pnpm build                    # Production build
pnpm check                    # Typecheck + format check
```

See `doc/CLAUDE.md` for detailed article-writing guidelines, component reference, and conventions.

## Claude Code Skills

This repo manages zcss-specific Claude Code skills in `.claude/skills/`:

- **`css-wisdom`** — Topic index of all CSS articles. Symlinked to `~/.claude/skills/css-wisdom` so it's available globally. **When adding or removing articles, update the topic index in `.claude/skills/css-wisdom/SKILL.md`.**
- **`l-handle-deep-article`** — Guide for converting flat articles into deep articles with sub-pages. Local to this repo.
- **`l-demo-component`** — Guide for CssPreview component usage and `defaultOpen` prop conventions. Local to this repo.

## Safety Rules

- `rm -rf`: relative paths only (`./path`), never absolute
- No force push, no `--amend` unless explicitly permitted
- Temp files go to `__inbox/` (gitignored)
