# victoremnm.github.io

Personal technical log built with Astro, deployed to GitHub Pages.

## Quickstart

```bash
npm install
npm run dev
```

Local dev runs at:

```
http://localhost:4321
```

## Common Tasks (Justfile)

If you have `just` installed:

```bash
just list
just dev
just build
just preview
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages
on every push to `main`. No manual deploy step is needed.

## Content

Blog and resource content live here:
- `src/content/blog/`
- `src/content/resources/`

Drafts are excluded from build by frontmatter:

```yaml
draft: true
```

The home page shows the 3 most recent non-draft blog posts by date.

## Gotchas

- **Preview server permissions**: in some environments, `npm run preview` may need a non-default host or elevated permissions. Use `just preview`.
- **Dates**: if a new post is not showing on the home page, check its `date` value and `draft: false`.
