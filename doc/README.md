# doc

Docusaurus documentation site.

## Prerequisites

- Node.js >= 20
- pnpm

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm start
```

Starts a local dev server at `http://mydoc.localhost:8811/`. Most changes are reflected live without restarting.

## Build

```bash
pnpm build
```

Generates static content into the `build` directory.

## Project Structure

```
docs/           # Markdown documentation files
src/
  components/   # React components (CategoryNav, DocsSitemap)
  css/          # Custom styles
  pages/        # Landing page
  theme/        # Swizzled Docusaurus theme components
  data/         # Generated JSON data (gitignored)
scripts/        # Build-time generation scripts
plugins/        # Docusaurus plugins (remark-creation-date)
static/         # Static assets (images, favicon)
```
