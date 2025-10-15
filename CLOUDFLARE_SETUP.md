# Cloudflare Pages Setup for Remix

## IMPORTANT: Configure in Cloudflare Dashboard

Remix v2 for Cloudflare Pages works best when configured directly in the Cloudflare Dashboard, NOT via wrangler.toml.

## Build Settings

Go to your Cloudflare Pages project → Settings → Builds & deployments

**Framework preset**: Remix

**Build command**: `npm run build`

**Build output directory**: `public`

**Root directory**: (leave empty)

**Environment variables**:
- Node version will be detected from `.nvmrc` (20)

## How Remix + Cloudflare Pages Works

1. Remix builds to two locations:
   - `build/index.js` - Server code
   - `public/build/` - Client assets (JS, CSS)

2. Cloudflare Pages automatically:
   - Detects Remix from `package.json` dependencies
   - Creates a Worker to run `build/index.js`
   - Serves static assets from `public/`
   - Handles routing automatically

3. No custom `_worker.js` or `wrangler.toml` needed!

## Environment Variables

Add these in Settings → Environment Variables:

```
OPENROUTER_API_KEY=<your-key>
VIBESDK_URL=https://vibesdk-production1.gogs1998.workers.dev
```

## Troubleshooting

If you see "Cannot convert undefined or null to object":
- Make sure you deleted any custom `_worker.js` file
- Make sure `wrangler.toml` is NOT in the repository
- Let Cloudflare auto-detect Remix configuration
