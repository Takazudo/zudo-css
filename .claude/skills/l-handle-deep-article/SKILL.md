---
name: l-handle-deep-article
description: >-
  Create or convert CSS best-practices articles into "deep articles" with sub-pages in the zcss
  Docusaurus site. Use when: (1) An article topic has enough depth to warrant "see more" reference
  sub-pages, (2) Converting a flat .mdx article into a category with index + child pages, (3) Adding
  deep reference content to an existing article, (4) User says 'deep article', 'add sub-pages',
  'expand article', or 'add reference pages'.
user-invocable: true
argument-hint: "[article path or topic name]"
---

# Deep Article Handler

Create or convert articles in the zcss Docusaurus site to the "deep article" pattern: a main article
with additional reference sub-pages shown as sidebar children.

## When to Use Deep Articles

A topic qualifies for deep treatment when it has:

- **Reference tables or catalogs** too large for inline (e.g., full token tables, property value catalogs)
- **Multiple distinct sub-patterns** that each deserve their own focused demo collection
- **Cheat sheet material** that users would want to browse independently
- **Real-world recipe collections** (e.g., 10+ card patterns, form patterns, animation recipes)

Do NOT use deep articles for topics that fit comfortably in a single page with 4-5 demos.

## Directory Structure

### Before (flat article)

```
docs/<category>/
  my-topic.mdx              → single page
```

### After (deep article)

```
docs/<category>/
  my-topic/
    _category_.json          → sidebar config
    index.mdx                → main article (same URL as before)
    <sub-page-1>.mdx         → reference sub-page
    <sub-page-2>.mdx         → reference sub-page
```

## Step-by-Step Process

### Step 1: Create the folder and move the main article

```bash
# In doc/docs/<category>/
mkdir my-topic
mv my-topic.mdx my-topic/index.mdx
```

### Step 2: Create _category_.json

```json
{
  "label": "My Topic Title",
  "position": <same sidebar_position as the original article>,
  "link": {
    "type": "doc",
    "id": "<category>/my-topic/index"
  }
}
```

Important: The `position` in `_category_.json` replaces `sidebar_position` in the frontmatter.
Remove `sidebar_position` from `index.mdx` frontmatter after creating `_category_.json`.

### Step 3: Update index.mdx frontmatter

Remove `sidebar_position` (now handled by `_category_.json`). Keep all other frontmatter.
Add a "Deep Dive" section at the bottom of the article linking to the sub-pages:

```mdx
## Deep Dive

For more detailed reference material on specific aspects of this topic:

- [Sub-page Title 1](./sub-page-1) - Brief description
- [Sub-page Title 2](./sub-page-2) - Brief description
```

### Step 4: Create sub-pages

Each sub-page is a standalone .mdx file with:

```mdx
---
sidebar_position: 1
---

import CssPreview from '@site/src/components/CssPreview';

# Sub-page Title

Brief intro connecting this to the parent article.

(CssPreview demos and detailed content)
```

Sub-pages should:

- Import and use `CssPreview` for interactive demos
- Have `sidebar_position` for ordering within the category
- Be focused on one specific aspect (a reference table, a pattern catalog, a recipe collection)
- Use descriptive kebab-case filenames

## Conventions

- Main article (`index.mdx`): keeps the Problem/Solution/Demo structure
- Sub-pages: can be more reference-oriented (tables, catalogs, recipe collections)
- Use `hsl()` colors, not hex
- Use `CssPreview` component for all demos (not TailwindPreview)
- File naming: kebab-case
- CSS class names: descriptive BEM-ish

## Identifying Deep Article Candidates

When reviewing articles, flag topics for deep treatment if:

1. The article already has 6+ demos and could have more
2. Comments like "for more patterns, see..." or "there are many more values..." appear
3. The CSS property has 10+ values or combinations worth demonstrating
4. The topic spans multiple real-world use cases that each need 3+ demos
5. A "cheat sheet" or "reference table" would be valuable alongside the tutorial content
