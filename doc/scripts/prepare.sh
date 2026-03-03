#!/bin/bash
# Install husky git hooks at repo root
# (package.json lives in doc/, but .git/ is at repo root)
cd "$(dirname "$0")/../.." && ./doc/node_modules/.bin/husky
