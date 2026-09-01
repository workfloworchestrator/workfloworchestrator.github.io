"""MkDocs hook to merge sub-project configurations into the parent.

The monorepo plugin only merges nav and docs from !include'd sub-projects.

This hook merges theme features, markdown_extensions, extra_css, and
extra_javascript from sub-project mkdocs.yml files into the parent config
at build time.

This hook also records each sub-project's own repo_url/repo_name so
that on_page_context (below) can point every page's "view source" link at
the repository.

Note: plugins cannot be loaded dynamically (they're initialized before hooks
run), so they must still be listed in the parent mkdocs.yml.
"""

import logging
import re
from pathlib import Path

import yaml
from slugify import slugify

log = logging.getLogger("mkdocs.hooks.merge_subproject_configs")

# Paths relative to the repo root (where parent mkdocs.yml lives). Keep in sync with the
# !include'd sub-projects under "Projects" in mkdocs.yml: a sub-project missing here silently
# builds without its own markdown_extensions, so syntax that works in its standalone build
# renders as literal text on workfloworchestrator.org.
SUB_PROJECTS = [
    "orchestrator-core/mkdocs.yml",
    "orchestrator-ui-library/mkdocs/mkdocs.yml",
    "lso/mkdocs.yml",
    "pydantic-forms/mkdocs.yml",
]

# Populated by on_config, keyed by the sub-project's published route prefix (see
# _monorepo_alias), read by on_page_context to pick each page's repo_url/repo_name.
_REPO_BY_PREFIX = {}

_ALIAS_RE = re.compile(r"^[a-zA-Z0-9_.\-/]+$")

_REPO_URL_RE = re.compile(r"^https?://github\.com/[^/]+/([^/]+?)(?:\.git)?/*$")


def _repo_short_name(repo_url):
    """Return just the repo name from a GitHub URL, omitting the "owner/" prefix.

    Sub-projects' own repo_name fields are inconsistent -- some are already
    "owner/repo" (orchestrator-core, lso, pydantic-forms), one is just "repo"
    (orchestrator-ui-library) -- so using them directly made the org prefix
    show up on some header links but not others, and get truncated with an
    ellipsis on the longer ones. Deriving the name from repo_url instead
    keeps it uniform everywhere.
    """
    match = _REPO_URL_RE.match(repo_url)
    return match.group(1) if match else repo_url


def _monorepo_alias(sub_config):
    """Mirror mkdocs_monorepo_plugin.parser.Parser.getAlias().

    The monorepo plugin prefixes each !include'd sub-project's pages with an
    alias derived from its site_name -- slugified only if site_name contains
    characters the alias regex disallows. Those two usually match, but not
    always: lso/mkdocs.yml has site_name "Lightweight Service Orchestrator",
    which publishes under /lightweight-service-orchestrator/. Re-deriving
    the alias the same way the plugin does keeps this correct even when a
    checkout folder name and site_name diverge.
    """
    site_name = sub_config.get("site_name", "")
    if _ALIAS_RE.match(site_name):
        return site_name
    return slugify(site_name)


def on_config(config):
    _REPO_BY_PREFIX.clear()

    for sub_path_str in SUB_PROJECTS:
        sub_path = Path(sub_path_str)
        if not sub_path.exists():
            log.warning("Sub-project config not found: %s", sub_path)
            continue

        with open(sub_path) as f:
            sub_config = yaml.load(f, Loader=yaml.FullLoader)

        # Derive docs prefix from the !include path used by monorepo
        # e.g. "orchestrator-core/mkdocs.yml" -> "orchestrator-core"
        prefix = sub_path.parent.name
        if prefix == ".":
            prefix = ""

        log.info("Merging config from %s (prefix=%s)", sub_path, prefix)
        _merge_theme_features(config, sub_config)
        _merge_markdown_extensions(config, sub_config)
        _merge_extra_css(config, sub_config, prefix)
        _merge_extra_javascript(config, sub_config, prefix)

        repo_url = sub_config.get("repo_url")
        if repo_url:
            alias = _monorepo_alias(sub_config)
            name = _repo_short_name(repo_url)
            _REPO_BY_PREFIX[alias] = (repo_url, name)

    # Expose the same mapping to docs/js/repo-source.js (see
    # overrides/partials/source.html, which serializes this as JSON into the
    # page), so the route->repo table lives in exactly one place. Adding a
    # sub-project to SUB_PROJECTS is then the only change needed for both
    # the server-rendered link and the instant-navigation script to pick it up.
    config["extra"]["repo_by_prefix"] = {
        prefix: {"url": repo_url, "name": repo_name}
        for prefix, (repo_url, repo_name) in _REPO_BY_PREFIX.items()
    }

    return config


def on_page_context(context, page, config, nav):
    """Point each sub-project page's source link at its own repo.

    overrides/partials/source.html reads page.meta.repo_url/repo_name in
    preference to config.repo_url/repo_name when set. Pages that don't
    belong to any sub-project (Learn, Community, etc)
    get no page.meta override and keep falling back to the root config's
    org-level repo_url/repo_name.
    """
    prefix = page.file.src_uri.split("/", 1)[0]
    repo = _REPO_BY_PREFIX.get(prefix)
    if repo:
        page.meta["repo_url"], page.meta["repo_name"] = repo
    return context


# Theme features that affect global navigation layout — these should be set
# explicitly in the parent mkdocs.yml, not auto-merged from sub-projects.
SKIP_THEME_FEATURES = {
    "navigation.tabs",
    "navigation.tabs.sticky",
    "navigation.sections",
    "navigation.expand",
    "navigation.indexes",
}


def _merge_theme_features(config, sub_config):
    sub_features = sub_config.get("theme", {}).get("features", [])
    if not sub_features:
        return
    existing_features = list(config["theme"]["features"])
    existing = set(existing_features)
    for feature in sub_features:
        if feature in SKIP_THEME_FEATURES:
            log.debug("Skipped layout theme feature: %s", feature)
            continue
        if feature not in existing:
            existing_features.append(feature)
            existing.add(feature)
            log.debug("Added theme feature: %s", feature)
    config["theme"]["features"] = existing_features


def _merge_markdown_extensions(config, sub_config):
    existing_names = set(config.get("markdown_extensions", []))
    mdx_configs = config.get("mdx_configs", {})

    for ext in sub_config.get("markdown_extensions", []):
        if isinstance(ext, str):
            name = ext
            ext_config = {}
        elif isinstance(ext, dict):
            name = next(iter(ext))
            ext_config = ext[name] or {}
        else:
            continue

        if name not in existing_names:
            config["markdown_extensions"].append(name)
            existing_names.add(name)
            log.debug("Added markdown extension: %s", name)

        if ext_config:
            mdx_configs[name] = ext_config

    config["mdx_configs"] = mdx_configs


def _merge_extra_css(config, sub_config, prefix):
    for css in sub_config.get("extra_css", []):
        prefixed = f"{prefix}/{css}" if prefix else css
        if prefixed not in config["extra_css"]:
            config["extra_css"].append(prefixed)
            log.debug("Added extra_css: %s", prefixed)


def _merge_extra_javascript(config, sub_config, prefix):
    for js in sub_config.get("extra_javascript", []):
        prefixed = f"{prefix}/{js}" if prefix else js
        if prefixed not in config["extra_javascript"]:
            config["extra_javascript"].append(prefixed)
            log.debug("Added extra_javascript: %s", prefixed)
