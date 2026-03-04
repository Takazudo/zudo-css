const { execFileSync } = require('child_process');
const path = require('path');

// Module-level cache: relativePath -> unix timestamp (seconds).
// Populated once per process. In dev mode (docusaurus start),
// restart the dev server to pick up creation dates for newly committed files.
let creationDateCache = null;
let cachedGitRoot = null;

function getGitRoot(filePath) {
  if (cachedGitRoot) return cachedGitRoot;
  cachedGitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: path.dirname(filePath),
    encoding: 'utf8',
  }).trim();
  return cachedGitRoot;
}

// Build cache with a single git log call for all files
function buildCreationDateCache(gitRoot) {
  if (creationDateCache) return;
  creationDateCache = new Map();

  try {
    // --diff-filter=A: only "Added" entries (file creation)
    // --reverse: oldest commits first, so the first occurrence is the true creation
    // --all: search across all branches (supports worktrees and feature branches)
    const output = execFileSync(
      'git',
      ['log', '--all', '--diff-filter=A', '--format=%at', '--name-only', '--reverse'],
      { cwd: gitRoot, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    );

    let currentTimestamp = null;
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Timestamp lines are purely numeric
      if (/^\d+$/.test(trimmed)) {
        currentTimestamp = trimmed;
      } else if (currentTimestamp) {
        // File path line — only store the first (earliest) occurrence
        if (!creationDateCache.has(trimmed)) {
          creationDateCache.set(trimmed, currentTimestamp);
        }
      }
    }
  } catch (error) {
    console.warn(`Could not build creation date cache: ${error.message}`);
    creationDateCache = new Map();
  }
}

// Per-file fallback with --follow for rename tracking
function getCreationDateWithFollow(gitRoot, relativePath) {
  try {
    const output = execFileSync(
      'git',
      ['log', '--all', '--follow', '--format=%at', '--reverse', '-n', '1', '--', relativePath],
      { cwd: gitRoot, encoding: 'utf8' },
    ).trim();

    const timestamp = output.split('\n')[0];
    return timestamp || null;
  } catch {
    return null;
  }
}

function formatTimestamp(unixSeconds) {
  const date = new Date(parseInt(unixSeconds, 10) * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return {
    formatted: `${year}/${month}/${day}`,
    timestamp: date.getTime(),
  };
}

function getGitCreationDate(filePath) {
  try {
    const gitRoot = getGitRoot(filePath);
    // Normalize to forward slashes — git outputs forward slashes on all
    // platforms, but path.relative uses backslashes on Windows.
    const relativePath = path.relative(gitRoot, filePath).split(path.sep).join('/');

    // Build the cache on first call
    buildCreationDateCache(gitRoot);

    // Look up in batch cache first
    let unixSeconds = creationDateCache.get(relativePath);

    // Fallback: per-file --follow for renamed files not found in batch
    if (!unixSeconds) {
      unixSeconds = getCreationDateWithFollow(gitRoot, relativePath);
    }

    if (!unixSeconds) {
      return null;
    }

    return formatTimestamp(unixSeconds);
  } catch (error) {
    console.warn(`Could not extract creation date for ${filePath}: ${error.message}`);
    return null;
  }
}

// Remark plugin to inject creation date into frontmatter
function remarkCreationDate() {
  return async (tree, vfile) => {
    const filePath = vfile.history[0];
    if (!filePath) return;

    const creationDate = getGitCreationDate(filePath);
    if (creationDate) {
      vfile.data = vfile.data || {};
      vfile.data.frontMatter = vfile.data.frontMatter || {};
      vfile.data.frontMatter.custom_creation_date = creationDate.formatted;
      vfile.data.frontMatter.custom_creation_timestamp = creationDate.timestamp;
    }
  };
}

module.exports = remarkCreationDate;
