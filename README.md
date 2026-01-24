# Victorem Site

Personal site built with Astro and deployed to Cloudflare Workers.

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
just deploy
```

## Deployment

This project deploys a static build to Cloudflare Workers.

Requirements:
- `CLOUDFLARE_API_TOKEN` set in your environment
- `wrangler` available via `npx wrangler`

Deploy:

```bash
export CLOUDFLARE_API_TOKEN="<token>"
just deploy
```

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
- **Tokens**: never commit or paste Cloudflare tokens. Store them in 1Password and export locally.
- **Dates**: if a new post is not showing on the home page, check its `date` value and `draft: false`.
