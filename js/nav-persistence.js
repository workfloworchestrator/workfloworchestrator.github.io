/*
 * Keep manually collapsed/expanded sidebar sections that way across
 * navigation, for the current tab only.
 *
 * overrides/partials/nav-item.html marks every inactive level-2 section
 * "md-toggle--indeterminate" so it starts expanded. Material's own
 * patchIndeterminate re-applies indeterminate=true/checked=false to any
 * element with that class on every `document$` emission (initial load and
 * every instant-navigation swap alike), and instant navigation replaces
 * [data-md-component=container] -- which the sidebar lives inside --
 * wholesale with the newly fetched page's server-rendered markup. Both
 * effects discard whatever the user just clicked, so a collapsed section
 * pops back open the moment you navigate to a page in a different section.
 *
 * There's no supported/build-in way to keep a toggle's state (see
 * https://github.com/squidfunk/mkdocs-material/discussions/2173 and
 * https://github.com/squidfunk/mkdocs-material/issues/3623), so this
 * remembers each toggle's checked state in memory and restores it after
 * each navigation.
 *
 * Uses window.document$ -- Material's own public observable for exactly
 * this kind of post-navigation patch -- same pattern as repo-source.js.
 */

(() => {
  /* Checkbox id -> last user-set checked state. Ids are positional paths
     through the nav tree (e.g. "__nav_1_2"), stable across pages for a
     given build, so the same section keys to the same id everywhere. */
  const state = new Map()

  function isNavToggle(el) {
    return el instanceof HTMLInputElement &&
      el.matches(".md-nav__toggle") &&
      el.id.startsWith("__nav_")
  }

  /* The toggle's <nav> lives alongside it in the DOM, addressed via
     aria-labelledby -> "<id>_label" (see overrides/partials/nav-item.html). */
  function navFor(toggle) {
    return document.querySelector(`nav[aria-labelledby="${toggle.id}_label"]`)
  }

  function isActiveSection(nav) {
    return !!nav && !!nav.querySelector(".md-nav__item--active")
  }

  /* Record the user's choice whenever they click a toggle. */
  document.addEventListener("change", ev => {
    const toggle = ev.target
    if (!isNavToggle(toggle)) return
    state.set(toggle.id, toggle.checked)
  })

  /* Re-apply remembered choices to the freshly rendered sidebar. Skips the
     section containing the active page, so navigating into a collapsed
     section still reveals where you are.

     Material gives ".md-toggle--indeterminate ~ .md-nav" transition:none,
     so the auto-expand on first render is instant -- but restoring a
     *collapsed* choice means removing that class, which hands the section
     back to the normal animated open/close rule and makes our correction
     itself play the collapse animation. Suppressing transitions on the
     sidebar for the one tick it takes to apply corrections avoids that
     flash without touching how a user's own clicks animate afterwards. */
  function restore() {
    const sidebar = document.querySelector(".md-sidebar--primary")
    if (sidebar) sidebar.classList.add("md-nav--no-transition")

    for (const toggle of document.querySelectorAll(".md-nav__toggle")) {
      if (!isNavToggle(toggle)) continue
      if (!state.has(toggle.id)) continue

      const nav = navFor(toggle)
      if (isActiveSection(nav)) continue

      const checked = state.get(toggle.id)

      /* Stop Material's indeterminate patch from overriding this toggle on
         the next document$ tick -- it only acts on elements still carrying
         this class. */
      toggle.classList.remove("md-toggle--indeterminate")
      toggle.indeterminate = false
      toggle.checked = checked
      if (nav) nav.setAttribute("aria-expanded", `${checked}`)
    }

    if (sidebar) {
      /* Force a style flush so "no transition" is actually observed before
         re-enabling, then hand transitions back on the next frame. */
      void sidebar.offsetHeight
      requestAnimationFrame(() => sidebar.classList.remove("md-nav--no-transition"))
    }
  }

  if (window.document$) {
    window.document$.subscribe(restore)
  } else {
    document.addEventListener("DOMContentLoaded", restore)
  }
})()
