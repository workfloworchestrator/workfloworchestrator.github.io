# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The workfloworchestrator.org website: a MkDocs (Material theme) site that is also a **monorepo docs hub**. Besides
the programme pages in `docs/`, it pulls in the documentation of four sub-projects (orchestrator-core,
orchestrator-ui-library, lso, pydantic-forms) via `mkdocs-monorepo-plugin` `!include` entries in `mkdocs.yml`.

## Commands

Tooling is `uv` + `just`.

```shell
just sync                 # uv sync --all-groups --all-extras
just setup-subprojects    # clone/pull sub-project repos and `uv pip install --no-deps` them
just docs-preview         # mkdocs serve --livereload
just pre-commit           # run all pre-commit hooks (check-yaml, whitespace, prettier for YAML, yamllint)
uv run --no-sync mkdocs build --strict   # what CI runs on PRs; deploy also uses --strict
```

- The build **fails without the sub-project checkouts** (`orchestrator-core/`, `orchestrator-ui-library/`, `lso/`,
  `pydantic-forms/` at the repo root, all gitignored). Run `just setup-subprojects` first.
- CI builds with `--strict`, so any warning (broken link, missing nav target) fails the PR.
- yamllint caps lines at 120 chars (except `mkdocs.yml`).

## Architecture

- **Sub-project wiring.** Each sub-project appears in `mkdocs.yml` as a `"!include ./<dir>/mkdocs.yml"` nav entry
  followed by a `# INCLUDED_REPO: <git url>` comment. `setup_subprojects.sh` greps those comments to know what to
  clone, so keep the comment when adding/moving a sub-project.
- **`hooks/merge_subproject_configs.py`.** The monorepo plugin only merges nav and docs. This hook merges each
  sub-project's `markdown_extensions`, `extra_css`, `extra_javascript` and theme features into the parent config,
  and sets per-page `repo_url`/`repo_name` so "view source" points at the right repo. Its `SUB_PROJECTS` list must
  stay in sync with the `!include`s in `mkdocs.yml`.
- **Plugins can't be merged dynamically.** Any plugin a sub-project needs must be listed in the parent `mkdocs.yml`
  and in `pyproject.toml` (see the "Keep in sync with orchestrator-core/mkdocs.yml" note). Plugin order matters:
  `glightbox` comes after the HTML-injecting plugins, and `macros` must come after `awesome-pages`.
- **mkdocstrings** reads Python sources from the sub-project checkouts (`paths:` in `mkdocs.yml`), not from the
  installed packages, so API docs track their main branches.
- **Theme overrides** in `overrides/partials/` are vendored copies of mkdocs-material templates, each with a
  `CUSTOMIZED:` header explaining the change. Re-diff them against upstream when upgrading mkdocs-material.
  `source.html` works together with `docs/js/repo-source.js` to fix the repo link/stats under instant navigation.
- **Dependency pins** in `pyproject.toml` carry comments explaining why (e.g. `mkdocs-redirects==1.2.2`,
  `override-dependencies` for orchestrator-lso conflicts). Read them before bumping.

## Conventions

- When moving or renaming a page, add an entry to the `redirects` plugin's `redirect_maps` in `mkdocs.yml`, under a
  dated `# YYYY-MM-DD:` comment.
- Meeting material lives in `docs/meetings/` (an `index.md` overview plus one page per meeting, each listed in the
  nav). Slide PDFs are in `docs/presentations/` and linked as `../presentations/<file>.pdf`.
- Pages may carry a `description:` front-matter field (quoted) for the meta description; the site-wide fallback is
  `site_description` in `mkdocs.yml`.

## Publishing

`.github/workflows/gh-pages.yml` deploys to GitHub Pages on every push to `main` (and on a `docs-update`
`repository_dispatch` from sub-project repos) via `mkdocs gh-deploy --force --strict`.
