#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MKDOCS_YML="$SCRIPT_DIR/mkdocs.yml"

# Clone included repositories (skip if already present)
grep INCLUDED_REPO "$MKDOCS_YML" | awk '{print $3}' | while read -r repo_url; do
    dir=$(basename "$repo_url" .git)
    if [ -d "$SCRIPT_DIR/$dir" ]; then
        echo "Skipping $dir (already exists)"
    else
        git clone "$repo_url" "$SCRIPT_DIR/$dir"
    fi
done

# Install included repositories as packages (no-deps to avoid conflicts)
grep 'include ./' "$MKDOCS_YML" \
    | sed 's/.*include //;s|/[^/]*"$||' \
    | while read -r path; do
        echo "Installing $path"
        uv pip install --no-deps "$SCRIPT_DIR/$path"
    done
