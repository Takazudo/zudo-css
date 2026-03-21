#!/usr/bin/env bash
set -euo pipefail

VERSION="v22.16.0"
ARCH="arm64"
PLATFORM="darwin"
DEST="src-tauri/binaries"

mkdir -p "$DEST"

if [ -f "$DEST/node" ]; then
  echo "Node binary already exists at $DEST/node"
  exit 0
fi

TARBALL="node-${VERSION}-${PLATFORM}-${ARCH}.tar.gz"
URL="https://nodejs.org/dist/${VERSION}/${TARBALL}"

echo "Downloading Node.js ${VERSION} for ${PLATFORM}-${ARCH}..."
curl -fSL "$URL" -o "/tmp/${TARBALL}"

echo "Extracting..."
tar -xzf "/tmp/${TARBALL}" -C /tmp
cp "/tmp/node-${VERSION}-${PLATFORM}-${ARCH}/bin/node" "$DEST/node"
chmod +x "$DEST/node"
rm -rf "/tmp/${TARBALL}" "/tmp/node-${VERSION}-${PLATFORM}-${ARCH}"

echo "Node binary saved to $DEST/node"
