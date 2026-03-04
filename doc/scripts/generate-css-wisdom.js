/**
 * generate-css-wisdom.js
 *
 * Scans doc/docs/ for all .mdx articles, reads curated descriptions from
 * .claude/skills/css-wisdom/descriptions.json, and generates the SKILL.md
 * topic index automatically.
 *
 * New articles without a description entry get their H1 title as fallback.
 * The script warns about missing descriptions so they can be added.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DOCS_DIR = path.resolve(REPO_ROOT, 'doc', 'docs');
const SKILL_DIR = path.resolve(REPO_ROOT, '.claude', 'skills', 'css-wisdom');
const DESCRIPTIONS_FILE = path.join(SKILL_DIR, 'descriptions.json');
const OUTPUT_FILE = path.join(SKILL_DIR, 'SKILL.md');

// Categories to skip in the topic index (not CSS articles)
const SKIP_CATEGORIES = new Set(['overview']);

// Custom category labels for the topic index heading
const CATEGORY_LABEL_OVERRIDES = {
  inbox: 'Inbox (Strategy Guides)',
};

/**
 * Read _category_.json from a directory if it exists.
 */
function readCategoryMeta(dirPath) {
  const categoryFile = path.join(dirPath, '_category_.json');
  try {
    return JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Extract H1 heading from a markdown file.
 */
function extractH1(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { content: body } = matter(content);
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].replace(/\*\*/g, '').replace(/\*/g, '').trim() : null;
}

/**
 * Read sidebar_position from an .mdx file's frontmatter.
 */
function readSidebarPosition(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter } = matter(content);
  return frontmatter.sidebar_position != null
    ? Number(frontmatter.sidebar_position)
    : 999;
}

/**
 * Process a top-level category directory.
 *
 * Returns an array of "items" where each item is either:
 *   - { type: 'article', relativePath, fullPath, position }
 *   - { type: 'group', indexFile: {...}, children: [...], position }
 *
 * Items are sorted by position for correct ordering.
 */
function processCategory(categoryDir) {
  const categoryPath = path.join(DOCS_DIR, categoryDir);
  const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    const fullPath = path.join(categoryPath, entry.name);

    if (entry.name === '_category_.json' || entry.name === 'img') continue;

    if (entry.isDirectory()) {
      // This is a deep article group (subcategory)
      const subMeta = readCategoryMeta(fullPath);
      const groupPosition = subMeta?.position ?? 999;
      const subEntries = fs.readdirSync(fullPath, { withFileTypes: true });

      let indexFile = null;
      const children = [];

      for (const subEntry of subEntries) {
        if (subEntry.name === '_category_.json' || subEntry.isDirectory()) continue;
        if (path.extname(subEntry.name).toLowerCase() !== '.mdx') continue;

        const subFullPath = path.join(fullPath, subEntry.name);
        const subRelPath = `${categoryDir}/${entry.name}/${subEntry.name}`;
        const subPosition = readSidebarPosition(subFullPath);

        if (subEntry.name.replace(/\.mdx?$/, '') === 'index') {
          indexFile = { relativePath: subRelPath, fullPath: subFullPath, position: subPosition };
        } else {
          children.push({ relativePath: subRelPath, fullPath: subFullPath, position: subPosition });
        }
      }

      // Sort children by sidebar_position
      children.sort((a, b) => a.position - b.position);

      if (indexFile || children.length > 0) {
        items.push({ type: 'group', indexFile, children, position: groupPosition });
      }
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.mdx') {
      const relativePath = `${categoryDir}/${entry.name}`;

      // Skip category index pages (e.g., layout/index.mdx)
      if (entry.name.replace(/\.mdx?$/, '') === 'index') continue;

      const position = readSidebarPosition(fullPath);
      items.push({ type: 'article', relativePath, fullPath, position });
    }
  }

  // Sort all items by position
  items.sort((a, b) => a.position - b.position);

  return items;
}

function main() {
  // Load curated descriptions
  let descriptions = {};
  if (fs.existsSync(DESCRIPTIONS_FILE)) {
    descriptions = JSON.parse(fs.readFileSync(DESCRIPTIONS_FILE, 'utf-8'));
  }

  // Discover and sort categories
  const topEntries = fs.readdirSync(DOCS_DIR, { withFileTypes: true });
  const categories = [];

  for (const entry of topEntries) {
    if (!entry.isDirectory()) continue;
    if (SKIP_CATEGORIES.has(entry.name)) continue;

    const meta = readCategoryMeta(path.join(DOCS_DIR, entry.name));
    const position = meta?.position ?? 999;
    const label = CATEGORY_LABEL_OVERRIDES[entry.name]
      || meta?.label
      || entry.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    categories.push({ dir: entry.name, position, label });
  }

  categories.sort((a, b) => a.position - b.position);

  // Track missing descriptions and total count
  const missing = [];
  let totalArticles = 0;

  // Helper to format a single file entry
  function formatEntry(file, indent = '') {
    const desc = descriptions[file.relativePath];
    if (!desc) {
      const h1 = extractH1(file.fullPath);
      const fallback = h1 || file.relativePath;
      missing.push(file.relativePath);
      return `${indent}- \`${file.relativePath}\` — ${fallback}`;
    }
    return `${indent}- \`${file.relativePath}\` — ${desc}`;
  }

  // Build topic index
  const indexLines = [];
  for (const category of categories) {
    const items = processCategory(category.dir);

    indexLines.push(`### ${category.label}`);
    indexLines.push('');

    for (const item of items) {
      if (item.type === 'article') {
        indexLines.push(formatEntry(item));
        totalArticles++;
      } else {
        // Deep article group: index first, then indented children
        if (item.indexFile) {
          indexLines.push(formatEntry(item.indexFile));
          totalArticles++;
        }
        for (const child of item.children) {
          indexLines.push(formatEntry(child, '  '));
          totalArticles++;
        }
      }
    }

    indexLines.push('');
  }

  // Build the full SKILL.md
  const skillContent = `---
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
Base path: \`doc/docs/\` (relative to repo root).

If this skill was loaded via symlink, resolve the symlink target to find the repo:
\`readlink ~/.claude/skills/css-wisdom/SKILL.md\`

## How to Use

1. Find the relevant article(s) from the topic index below based on the CSS task at hand
2. Read ONLY the specific article(s) you need — do NOT load all articles at once
3. Apply the patterns and recommendations from the article when writing CSS
4. Mention the source article path so the user can find it for further reading

## Topic Index

Each entry: \`file path\` — brief description.

${indexLines.join('\n').trimEnd()}
`;

  fs.writeFileSync(OUTPUT_FILE, skillContent, 'utf-8');

  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`  ${totalArticles} articles across ${categories.length} categories`);

  if (missing.length > 0) {
    console.log(`\n  ⚠ ${missing.length} article(s) missing descriptions in descriptions.json:`);
    for (const m of missing) {
      console.log(`    - ${m}`);
    }
    console.log(`\n  Add descriptions to: ${DESCRIPTIONS_FILE}`);
  }
}

main();
