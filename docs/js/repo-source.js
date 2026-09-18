/*
 * Keep the header/drawer source link pointing at the right repository, and
 * show that repo's GitHub stats, after each instant-navigation swap.
 *
 * Material's instant-nav inject() only replaces a fixed whitelist of
 * [data-md-component] elements (announce, container, header-topic, outdated,
 * logo, skip, tabs) -- "source" isn't among them, so the link/stats from the
 * first-loaded page would otherwise persist across every later navigation.
 * Material's own fact-fetching is also a session-wide singleton keyed by a
 * single sessionStorage entry, not scoped per repo, so it can't be reused
 * for a monorepo where each tab points at a different GitHub repository.
 *
 * The route->repo mapping is read from a data-repo-map attribute on the
 * source link element, populated by the server via
 * overrides/partials/source.html and hooks/merge_subproject_configs.py.
 * Adding a new sub-project to the monorepo automatically makes its repo
 * available here -- no duplicate config to hand-edit.
 *
 * That partial marks the link with data-repo-source instead of Material's own
 * data-md-component="source", so Material never mounts its fact-fetching over
 * the same element. Both writers appending to one element is what rendered the
 * stats twice on a cold load: Material's mount runs once at bundle-eval time
 * and appends without clearing, and this script appended a second list. The
 * duplicate disappeared on the first navigation only because the repaint below
 * rewrites the element's text, dropping every child it had.
 *
 * The partial is rendered TWICE per page -- once in the header, once in the
 * navigation drawer (the copy actually shown below 960px) -- so everything here
 * works over both copies. The drawer copy lives inside
 * [data-md-component=container], which instant navigation replaces wholesale,
 * so its element is a brand new node after every swap while the header's
 * survives. Element references are therefore re-queried on each repaint rather
 * than captured once, the same way nav-persistence.js and glightbox-instant.js
 * re-query on each document$ emission. Caching them would leave the drawer
 * facts painted onto a detached node and the live one empty.
 *
 * Uses window.document$ -- Material's own public observable, exposed for
 * exactly this kind of post-navigation patch.
 */

(() => {
  const ORG_URL  = "https://github.com/workfloworchestrator"
  const ORG_NAME = "workfloworchestrator"

  /* Re-queried on every repaint, never cached -- see the header comment. */
  function sources() {
    return [...document.querySelectorAll("[data-repo-source]")]
  }

  /* Both copies carry the same server-rendered map, and it's identical on
     every page of a given build, so reading it once at startup is safe. */
  let repoMap = {}
  const first = document.querySelector("[data-repo-source]")
  if (first) {
    try {
      repoMap = JSON.parse(first.getAttribute("data-repo-map") || "{}")
    } catch (_) {
      /* Keep the root fallback if malformed data ever reaches the page. */
    }
  }

  /* Same markup Material's own renderSourceFacts produces, so its CSS applies. */
  function renderFacts(facts) {
    const items = Object.entries(facts)
      .map(([key, value]) => `<li class="md-source__fact md-source__fact--${key}">${value}</li>`)
      .join("")
    return `<ul class="md-source__facts">${items}</ul>`
  }

  /* Point every copy at one repo and, when its facts are already known, render
     them in the same pass. Setting textContent drops whatever the element held,
     so the facts list is always rebuilt rather than appended to -- that is what
     keeps a second list from ever accumulating. */
  function paint(url, name, facts) {
    for (const el of sources()) {
      el.href = url

      const textEl = el.querySelector(".md-source__repository")
      if (!textEl) continue

      textEl.textContent = name
      if (facts && Object.keys(facts).length) {
        textEl.insertAdjacentHTML("beforeend", renderFacts(facts))
        textEl.classList.add("md-source__repository--active")
      } else {
        textEl.classList.remove("md-source__repository--active")
      }
    }
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

  /* Resolved facts per route prefix. The drawer element is rebuilt on every
     navigation, so repainting is frequent while the answer almost never
     changes; memoising what was resolved lets a repaint render synchronously,
     with no flash of a bare link and no extra API call. Failures memoise their
     empty result too -- without that, a repo whose request failed (or a 404 on
     releases/latest) would be retried on every single navigation and drain the
     hourly budget. */
  const factsByPrefix = new Map()

  function factsFor(prefix, repo) {
    if (factsByPrefix.has(prefix)) return factsByPrefix.get(prefix)

    let pending
    if (repo) {
      const api = apiURL(repo.url)
      if (!api) {
        pending = Promise.resolve({})
      } else {
        /* Stats and the latest release are independent facts: a repo without
           any releases (404 on releases/latest) must still show stars/forks,
           so each request degrades on its own rather than sharing one catch. */
        const stats = cachedFetchJSON(api)
          .then(info => ({ stars: info.stargazers_count, forks: info.forks_count }))
          .catch(() => ({}))
        const release = cachedFetchJSON(`${api}/releases/latest`)
          .then(info => ({ version: formatVersion(info.tag_name) }))
          .catch(() => ({}))

        pending = Promise.all([stats, release]).then(([s, r]) => ({ ...s, ...r }))
      }
    } else {
      pending = cachedFetchJSON(`https://api.github.com/users/${ORG_NAME}`)
        .then(info => ({ repositories: info.public_repos }))
        .catch(() => ({}))
    }

    /* Swap the promise for its resolved value so later repaints are synchronous. */
    const entry = pending.then(facts => {
      factsByPrefix.set(prefix, facts)
      return facts
    })
    factsByPrefix.set(prefix, entry)
    return entry
  }

  /* Guards against a slow response for a route the reader has already left:
     only the newest prefix is allowed to paint. */
  let currentPrefix = null

  function update() {
    const prefix = location.pathname.split("/", 2)[1] || ""
    currentPrefix = prefix

    const repo = repoMap[prefix]
    const url  = repo ? repo.url  : ORG_URL
    const name = repo ? repo.name : ORG_NAME

    /* Paint the link immediately; facts follow, synchronously when memoised. */
    const facts = factsFor(prefix, repo)
    if (typeof facts.then !== "function") {
      paint(url, name, facts)
      return
    }

    paint(url, name, null)
    facts.then(resolved => {
      if (currentPrefix === prefix) paint(url, name, resolved)
    })
  }

  update()
  if (window.document$) {
    /* document$ replays the current document; skip that event because update()
       already ran above, then react only to later instant-navigation swaps. */
    let replayed = false
    window.document$.subscribe(() => {
      if (!replayed) { replayed = true; return }
      update()
    })
  }
})()
