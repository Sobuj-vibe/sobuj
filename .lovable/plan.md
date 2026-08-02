## Phase 3 — Polish, discoverability, performance

Phases 1 (public site) and 2 (admin CMS) are in place. Phase 3 finishes the plan's remaining items.

### 1. Feeds and machine-readable routes
- `/sitemap.xml` — a public server route that lists static pages plus every published portfolio item, note, and custom page, pulled live from the database.
- `/rss.xml` — Atom/RSS 2.0 feed of published notes (title, excerpt, link, publish date).
- Add `Sitemap:` line to `public/robots.txt`.

### 2. SEO completion
- Canonical `<link>` per route using the real domain (sobuj.top).
- JSON-LD: `Person` on the home page, `Article` on note detail, `CreativeWork` on project detail, `BreadcrumbList` on detail pages.
- Verify each route's title/description/OG text is unique, and that project/note detail pages emit `og:image` from the item's cover when it is an absolute URL.

### 3. Reading and engagement details
- View counter on notes: increments once per view, displayed on the note page and in the admin list.
- Note detail extras: reading progress bar, prev/next note links, tag filtering on the notes index.
- Related projects strip at the bottom of a project case study (same category).

### 4. Not-found and error states
- Styled catch-all 404 route matching the blueprint aesthetic, with `noindex`.
- Route-level error components so a failed data load shows a designed panel instead of a blank screen.

### 5. Performance and accessibility pass
- Lazy/async image loading with explicit dimensions to remove layout shift.
- Respect `prefers-reduced-motion` across GSAP reveals, headline splits, and the page-transition curtain.
- Keyboard and focus audit: visible focus rings, skip-to-content link, aria labels on icon-only buttons, contrast check in both day and night themes.
- Playwright verification pass over every route in both themes at mobile and desktop widths.

### Technical notes
- Sitemap and RSS live under `src/routes/api/public/` style server routes returning raw XML `Response` objects with correct content types, reading through the existing public (anon-key) server client so RLS still applies.
- View counts need a small database change: a `views` column on notes plus a security-definer increment function callable by anonymous visitors, so a counter bump never requires broader write access. Called from a server function on the note route.
- JSON-LD injected via each route's `head()` `scripts` option — no extra dependency.
- Reduced-motion handling centralized in `src/lib/animations.ts` so every animation entry point honors it.

### Deliverables
Working `/sitemap.xml` and `/rss.xml`, structured data on all content routes, note view counts, tag filtering, prev/next and related-content links, a designed 404 and error states, and a verified accessibility/performance pass in both themes.
