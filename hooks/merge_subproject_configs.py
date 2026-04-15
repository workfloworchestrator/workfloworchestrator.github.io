"""MkDocs hook to merge sub-project configurations into the parent.

The monorepo plugin only merges nav and docs from !include'd sub-projects.
This hook merges theme features, markdown_extensions, extra_css, and
extra_javascript from sub-project mkdocs.yml files into the parent config
at build time.

Note: plugins cannot be loaded dynamically (they're initialized before hooks
run), so they must still be listed in the parent mkdocs.yml.
"""

import logging
from pathlib import Path

import yaml

log = logging.getLogger("mkdocs.hooks.merge_subproject_configs")

# Paths relative to the repo root (where parent mkdocs.yml lives)
SUB_PROJECTS = [
    "orchestrator-core/mkdocs.yml",
    "orchestrator-ui-library/mkdocs/mkdocs.yml",
]


def on_config(config):
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

    return config


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
