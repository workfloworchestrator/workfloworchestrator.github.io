/*
 * Update the header source link after each instant-navigation swap.
 *
 * Material's instant-nav inject() only replaces a fixed whitelist of
 * [data-md-component] elements (announce, container, header-topic, outdated,
 * logo, skip, tabs) -- "source" isn't among them, so the link/stats from the
 * first-loaded page would otherwise persist across every later navigation.
 * Material's own fact-fetching is also a session-wide singleton keyed by a
 * single sessionStorage entry, not scoped per repo, so it can't be reused
 * for a monorepo where each tab points at a different GitHub repository.
 * The update below is intentionally limited to top-level route changes:
 * moving between pages within one project cannot change its repository.
 *
 * The route->repo mapping is read from a data-repo-map attribute on the
 * source link element, populated by the server via
 * overrides/partials/source.html and hooks/merge_subproject_configs.py.
 * Adding a new sub-project to the monorepo automatically makes its repo
 * available here -- no duplicate config to hand-edit.
 *
 * Uses window.document$ -- Material's own public observable, exposed for
 * exactly this kind of post-navigation patch -- to re-sync the link and
 * fetch stars/forks from the public GitHub API.
 */

(() => {
  const SRC = document.querySelector("[data-md-component=source]")
  if (!SRC) return

  const textEl = SRC.querySelector(".md-source__repository")
  const ORG_URL  = "https://github.com/workfloworchestrator"
  const ORG_NAME = "workfloworchestrator"

  /* Built from the server-sent data-repo-map attribute. */
  let repoMap = {}
  try {
    repoMap = JSON.parse(SRC.getAttribute("data-repo-map") || "{}")
  } catch (_) {
    /* Keep the root fallback if malformed data ever reaches the page. */
  }

  let lastPrefix = null

  /* Same markup Material's own renderSourceFacts produces, so its CSS applies. */
  function renderFacts(facts) {
    const items = Object.entries(facts)
      .map(([key, value]) => `<li class="md-source__fact md-source__fact--${key}">${value}</li>`)
      .join("")
    return `<ul class="md-source__facts">${items}</ul>`
  }

  function clearFacts() {
    const facts = SRC.querySelector(".md-source__facts")
    if (facts) facts.remove()
    if (textEl) textEl.classList.remove("md-source__repository--active")
  }

  function showFacts(facts) {
    if (!textEl || !facts || !Object.keys(facts).length) return
    textEl.insertAdjacentHTML("beforeend", renderFacts(facts))
    textEl.classList.add("md-source__repository--active")
  }

  async function fetchJSON(url) {
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return resp.json()
  }

  /* Unauthenticated GitHub API requests are capped at 60/hour per IP, shared
     across every visitor behind it. Caching each response for an hour under
     its own URL as the key keeps tab-hopping between projects from re-fetching
     the same data and tripping that limit, while still refreshing periodically. */
  const CACHE_TTL_MS = 60 * 60 * 1000
  const CACHE_PREFIX = "repo-source:"

  function cachedFetchJSON(url) {
    const key = CACHE_PREFIX + url
    try {
      const cached = JSON.parse(sessionStorage.getItem(key))
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return Promise.resolve(cached.data)
      }
    } catch (_) {
      /* Corrupt or missing cache entry -- fall through to a live fetch. */
    }

    return fetchJSON(url).then(data => {
      try {
        sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
      } catch (_) {
        /* Storage full or unavailable (e.g. private browsing) -- still return the data. */
      }
      return data
    })
  }

  /* Stats/releases come from api.github.com; github.com itself sends no CORS
     headers, so the repo_url can only be used as a link target, never fetched. */
  function apiURL(repoURL) {
    const match = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/*$/.exec(repoURL)
    return match ? `https://api.github.com/repos/${match[1]}/${match[2]}` : null
  }

  /* npm-published repos (e.g. orchestrator-ui-library, releasing via
     changesets) tag releases as "@scope/package@1.2.3" rather than a bare
     "v1.2.3" -- the full tag is too long to show next to stars/forks and the
     scope/package name is redundant with the repo name already shown next to
     it. Take just the version after the last "@"; a bare tag has no "@" and
     passes through unchanged.
     */
  function formatVersion(tagName) {
    const at = tagName.lastIndexOf("@")
    return at > 0 ? tagName.slice(at + 1) : tagName
  }

  function update() {
    const prefix = location.pathname.split("/", 2)[1] || ""
    if (prefix === lastPrefix) return
    lastPrefix = prefix

    clearFacts()
    const repo = repoMap[prefix]

    if (repo) {
      SRC.href = repo.url
      if (textEl) textEl.textContent = repo.name

      const api = apiURL(repo.url)
      if (api) {
        /* Stats and the latest release are independent facts: a repo without
           any releases (404 on releases/latest) must still show stars/forks,
           so each request degrades on its own rather than sharing one catch. */
        const stats = cachedFetchJSON(api)
          .then(info => ({ stars: info.stargazers_count, forks: info.forks_count }))
          .catch(() => ({}))
        const release = cachedFetchJSON(`${api}/releases/latest`)
          .then(info => ({ version: formatVersion(info.tag_name) }))
          .catch(() => ({}))

        Promise.all([stats, release])
          .then(([statsFacts, releaseFacts]) => showFacts({ ...statsFacts, ...releaseFacts }))
      }
    } else {
      SRC.href = ORG_URL
      if (textEl) textEl.textContent = ORG_NAME

      cachedFetchJSON(`https://api.github.com/users/${ORG_NAME}`)
        .then(info => showFacts({ repositories: info.public_repos }))
        .catch(() => {})
    }
  }

  update()
  if (window.document$) {
    /* document$ replays the current document; skip that event because update()
       already ran above, then react only to later instant-navigation swaps. */
    let first = true
    window.document$.subscribe(() => {
      if (first) { first = false; return }
      update()
    })
  }
})()
