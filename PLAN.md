# victorem.me - Site Development Plan

## Overview
Personal portfolio website using Astro, hosted on Cloudflare Pages.

## Tech Stack
- **Framework:** Astro
- **Styling:** Tailwind CSS v4
- **Content:** Markdown/MDX with Astro Content Collections
- **Hosting:** Cloudflare Pages (free)
- **Domain:** victorem.me (transfer from Squarespace)

## Site Structure
```
/                    # Home - hero, featured work, recent posts
/about               # Bio, background
/work                # Portfolio grid
/work/[slug]         # Individual project pages
/blog                # Blog post list
/blog/[slug]         # Individual blog posts
/contact             # Contact info & links
```

## Current Progress

### Completed
- [x] Initialize Astro + Tailwind project
- [x] Set up content collections (work, blog)
- [x] Create base layout with header/footer
- [x] Build home page with hero
- [x] Create about page (template)
- [x] Build contact page
- [x] Create portfolio section (grid + dynamic pages)
- [x] Create blog section (list + dynamic pages)
- [x] Add sample content

### Remaining
- [ ] Initialize git repo and push to GitHub
- [ ] Test local dev server
- [ ] Fix any build issues
- [ ] Deploy to Cloudflare Pages
- [ ] Configure custom domain

## Content To-Do
- [ ] Replace placeholder About page content with real bio
- [ ] Add real portfolio projects
- [ ] Write first real blog post
- [ ] Update social links in Footer and Contact
- [ ] Add professional headshot/photo

## Domain Migration
1. Create Cloudflare account
2. Add site to Cloudflare (get nameservers)
3. In Squarespace: Domains → victorem.me → Update nameservers to Cloudflare
   - OR transfer domain entirely to Cloudflare Registrar
4. Wait for DNS propagation (up to 48 hours)
5. Connect Cloudflare Pages project to custom domain

## Squarespace Content Export
Since Squarespace export is limited:
- Manually copy page content into markdown files
- Download images via right-click or browser DevTools
- Consider using Wayback Machine if needed

## Future Enhancements
- [ ] Cloudflare Access for admin routes
- [ ] Dark mode toggle
- [ ] RSS feed
- [ ] Contact form via Cloudflare Workers
- [ ] Cloudflare Web Analytics

## Local Development
```bash
cd victorem-site
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment
Cloudflare Pages auto-deploys from GitHub on push to main.

Build settings:
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+
