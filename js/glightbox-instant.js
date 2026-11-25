/*
 * Re-apply the lightbox image links after an instant navigation.
 *
 * With the privacy plugin enabled, mkdocs-glightbox emits the image anchors
 * without an href and fills it in from the img afterwards, using a one-shot
 * inline script. navigation.instant (inherited from orchestrator-core) swaps
 * in a new page without re-running that script, leaving the anchors empty:
 * the lightbox then opens on nothing and shows a spinner forever.
 *
 * Loaded via extra_javascript, so this subscriber is registered before the
 * lightbox.reload() one that mkdocs-glightbox appends to the body, and thus
 * runs first on every page load.
 */
document$.subscribe(function () {
  document.querySelectorAll("a.glightbox:not([href])").forEach(function (el) {
    const img = el.querySelector("img")
    if (img && img.src) {
      el.setAttribute("href", img.src)
    }
  })
})
