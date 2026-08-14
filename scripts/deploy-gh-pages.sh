#!/bin/bash
# deploy-gh-pages.sh — Deploy static site to GitHub Pages
# Usage: bash scripts/deploy-gh-pages.sh
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=== Step 1: Build ==="
npm run build

echo "=== Step 2: Prepare temp copy of out/ ==="
TMPDIR=$(mktemp -d)
cp -r out/* "$TMPDIR/"
trap "rm -rf '$TMPDIR'" EXIT

echo "=== Step 3: Checkout gh-pages ==="
git fetch origin gh-pages
git checkout gh-pages

echo "=== Step 4: Replace gh-pages contents ==="
# Remove all files except .git
find . -maxdepth 1 ! -name '.' ! -name '.git' -exec rm -rf {} + 2>/dev/null || true

# Copy fresh build
cp -r "$TMPDIR/"* .

echo "=== Step 5: Commit and push ==="
git add -A
git commit -m "deploy: static site update $(date '+%Y-%m-%d %H:%M')"
git push origin gh-pages --force

echo "=== Step 6: Return to main ==="
git checkout main

echo "✓ Deployed to gh-pages successfully"
echo "  Live at: https://liloolight.github.io/mis-altera/"
