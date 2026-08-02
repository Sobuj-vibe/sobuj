## Sobuj Hossen — Animated Portfolio + CMS

**Brand**: Amber on Ink (`#0d0d0f` canvas, `#1a1a1d` surfaces, `#f5a623` amber accent, `#ffd08a` highlight), Instrument Serif headings + Work Sans body. Day/Night toggle with AA-contrast tokens in both modes. Assets: your logo (nav + favicon), sketch portrait (hero/about), signature (about + footer), 6 project screenshots (portfolio gallery).

### One stack correction
This project already runs on **React 19 + TypeScript + Vite 7 + TanStack Start** (file-based TanStack Router, server functions, SSR). That satisfies your "React + TS, Vite-based, no Next.js" requirement and gives better SEO for blog/portfolio pages than plain SPA React Router — so I'll build on it rather than scaffolding a new Vite SPA. Backend is **Lovable Cloud** (managed Postgres + Auth + Storage, Supabase under the hood), so no external Supabase account or key wrangling is needed. Hosting is Lovable's Publish (Vercel/GitHub export stays available via the GitHub sync).

### Architecture

```text
src/
  routes/
    __root.tsx            theme provider, GSAP transition shell, nav, footer
    index.tsx             Home: Hero, stats, About teaser, tabbed gallery, Services, CTA
    about.tsx             Long-form About + signature
    portfolio.index.tsx   PortfolioGrid (filter by tag)
    portfolio.$slug.tsx   PortfolioDetail
    blog.index.tsx        BlogList
    blog.$slug.tsx        BlogPost (markdown render)
    p.$slug.tsx           Custom pages (HTML/Markdown builder output)
    contact.tsx           ContactForm (+ optional map embed)
    auth.tsx              Admin login (public route)
    _authenticated/_admin/…  dashboard, portfolio editor, blog editor, page editor
  components/{layout,sections,portfolio,blog,admin,ui}
  lib/*.functions.ts      server functions (public reads + admin writes)
```

Data flow: public pages read via public server functions (anon-safe SELECT policies) → TanStack Query; admin writes go through auth-gated server functions that verify the `admin` role server-side. No keys in client code beyond the publishable key.

### Data models
- **portfolio_items**: id, slug, title, summary, description(md), cover_url, gallery[], category, tech[], client, year, live_url, repo_url, featured, status(draft/published), sort_order, timestamps
- **blog_posts**: id, slug, title, excerpt, cover_url, body(md), tags[], status, published_at, reading_minutes
- **pages**: id, slug, title, format(html|markdown), body, status, seo_title, seo_description
- **profiles**: id→auth.users, display_name, avatar_url
- **user_roles**: id, user_id, role enum(admin|editor|user) — separate table + `has_role()` security-definer function (never a role column on profiles)
- **contact_messages**: id, name, email, subject, message, created_at (insert-only for anon, admin-read)

RLS: public `SELECT` for `status='published'` rows only; owner/admin policies for everything else; explicit GRANTs per table.

### Auth plan
Email + password admin login at `/auth` (no public signup exposed — your account is seeded, and role granted via migration). Admin subtree lives under `_authenticated/_admin` with an RBAC `beforeLoad` gate checking `admin` role; every write server function re-verifies the role server-side, so hiding UI is never the security boundary.

### Animation system
- **GSAP**: route transition curtain/mask, scroll-triggered section reveals (ScrollTrigger), hero headline character stagger, portfolio grid staggered entrance, magnetic amber cursor accent.
- **Framer Motion**: card hover lift/tilt, tab underline `layoutId`, theme-toggle icon morph, mobile menu spring, form field focus states, `AnimatePresence` on modals/toasts.
- Respect `prefers-reduced-motion` throughout; motion is restrained and purposeful (21st.dev/reactbits feel: sharp typographic contrast, thin rules, blueprint hairlines nodding to your sketch portrait).

### Phased plan

**Phase 1 — MVP (public site, real content)**
1. Design tokens, fonts, theme toggle, layout shell (Header/Footer/nav), favicon from your logo, asset pointers for portrait/signature/6 projects.
2. Home page: Hero (portrait + name + role + amber CTA), quick stats, About teaser, tabbed portfolio gallery, Services, CTA.
3. Portfolio grid + detail, About, Contact form (writes to `contact_messages`).
4. GSAP page transitions + scroll reveals, Framer Motion micro-interactions.
5. Per-route SEO `head()` metadata, sitemap-friendly routes, responsive + a11y pass.

**Phase 2 — CMS in MVP scope (as you chose)**
6. Enable Cloud, migrations for all tables + roles + RLS + GRANTs, seed your 6 projects as published rows.
7. `/auth` login, admin gate, admin dashboard shell.
8. Portfolio editor (CRUD, image upload to Storage, draft/publish, reorder), Blog editor with Markdown editor + live preview, Blog list/post public pages.
9. PageEditor: HTML **or** Markdown custom pages rendered at `/p/:slug`, with sanitized HTML output.

**Phase 3 — Enhancements**
Contact-message inbox in admin, tag/search filtering, view counts, RSS feed, OG image per post, optional map on contact, dark/light preview in editor, testimonials, resume/CV download, Lighthouse + reduced-motion audit.

### Deliverables
Working multi-page site; admin CMS; migrations with RLS; the component set you listed (Header, Hero, PortfolioGrid, PortfolioDetail, BlogList, BlogPost, MarkdownEditor, PageEditor, ThemeToggle, AdminPanel); this architecture map; and run instructions (`bun install`, `bun run dev`, Publish for production; GitHub sync for Vercel self-host).

### Notes / technical details
- Markdown: `react-markdown` + `remark-gfm`; raw HTML pages sanitized with `dompurify` before render.
- Images: uploaded files go to Cloud Storage; the assets you sent become CDN asset pointers.
- I'll ask you for admin email/password (or you set it at first login) when Phase 2 starts.
