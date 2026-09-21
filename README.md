# Sobuj's Dynamic Studio

You're building a React + TypeScript personal multi-page portfolio with full animations (GSAP and Framer Motion) and a day/night theme, inspired by 21st.dev and reactbits.dev aesthetics. Provide a detailed, actionable plan including architecture, technology choices, MVP-first phased plan, and clear deliverables.

Assumptions and requirements to follow:
- Frontend: React + TypeScript; no Next.js unless requested; Vite-based setup acceptable.
- Animations: GSAP for page transitions; Framer Motion for micro-interactions.
- Theme: Accessible Day/Night toggle with proper contrast; responsive design.
- Pages and structure (multipage feel):
  - Home: Header, Hero, Quick stats, About, Portfolio gallery (tabbed), Services, CTA, Footer
  - Portfolio: Grid of items; each item links to a detail page
  - Blog: List with individual posts
  - Custom page: HTML & Markdown builder
  - Contact: Form (with optional map)
  - About
  - Admin (separate): Admin panel for creating/editing portfolio items and blog posts; role-based access
- Backend: Supabase for data (portfolio items, blog posts, pages, user auth for admin)
- Deployment: Vercel; code in GitHub; Supabase project for backend
- Data flow: Secure API access to Supabase; environment variables for keys
- Deliverables:
  - Project scaffolding with package.json and scripts
  - System architecture diagram (components, pages, data models)
  - MVP feature list with phased plan: MVP first, then enhancements
  - Core components: Header, Hero, PortfolioGrid, PortfolioDetail, BlogList, BlogPost, MarkdownEditor, PageEditor (HTML/Markdown builder), ThemeToggle, AdminPanel
  - Data models: PortfolioItem, BlogPost, PageContent, User
  - Auth plan: Admin login and roles
  - Build/run instructions for local and production
- Branding and UI/UX resources: incorporate frontend skills and branding guidelines, motion design references, UX psychology considerations
- Please tailor stack choices, confirm authentication approach, and provide phased implementation plan with MVP first, followed by enhancements.

do you need any more information from me?
my name is sobuj
i have attached my logo and a photo and my signature and some photo for the portfolio gallery 
if you need any other information ask me before making the plan

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sobuj.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a495bf49-c0f0-4903-aa87-a0c99580616a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
