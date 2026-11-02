# PikaBlog

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/PIKACHUIM/Rin)
[![Live Site](https://img.shields.io/badge/live-coding.opkg.cn-2ea44f?style=for-the-badge)](https://coding.opkg.cn)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)

English | [简体中文](./README_zh_CN.md)

PikaBlog is a personal blog forked from [openRin/Rin](https://github.com/openRin/Rin), running on the
Cloudflare stack: **one Worker serves both the static frontend and `/api`**, D1 stores data,
R2/S3 stores images, Queues handle async jobs, Workers AI generates summaries.

Live site: <https://coding.opkg.cn>

## What this fork changes

- **Single Worker for frontend + backend**: the client bundle is uploaded via `[assets]`, `/api` lives on the
  same origin — no CORS, no two-domain configuration. SPA routes fall back to `index.html`.
- **Templated theme system**: five built-in themes (`official` / `aurora` / `fuwari` / `noir` / `zen`),
  switchable from the admin UI, plus a registration API for custom themes.
- **Multi-domain login**: the OAuth `state` carries a signed origin, so logging in from any routed domain
  returns to that same domain. `FRONTEND_URL` is gone.
- **Per-domain SEO output**: `sitemap.xml`, `robots.txt` and feeds always use the request origin.
- **Schema migrated to D1 `rinblogs-data`** (comments, moments, cache table, AI summary fields, indexes).
- Fixes for upstream leftovers: the `react-helmet-async` crash and stale theme variables.

## Features

- GitHub OAuth login; the first registered user becomes the administrator
- Markdown editor with live local drafts, drag-and-drop image upload, custom slugs (`/about`)
- Draft / unlisted / public visibility, pinned posts
- Hashtags, timeline, moments, search, friends (scheduled health checks)
- Comments with moderation, webhook notifications, AI summaries (Workers AI + Queue)
- RSS / Atom / JSON Feed, `sitemap.xml`, `robots.txt`
- Five themes, custom wallpaper and accent color, light/dark follows the system
- Chinese / Traditional Chinese / English / Japanese UI

## Architecture

```text
worker: rinblogs-work
├── [assets] ./dist/client   → frontend build output
├── /api/*                   → Hono app (server/src)
├── /sitemap.xml /robots.txt → generated per request origin
└── /rss.xml etc.            → generated per request origin

bindings
├── DB          D1    rinblogs-data
├── TASK_QUEUE  Queue rinblogs-work-tasks (AI summary / compat jobs)
├── AI          Workers AI
└── ASSETS      ./dist/client
```

```text
client/            React + Vite app (pages, components, theme, i18n)
server/            Hono Worker (services / db / runtime / queue)
packages/api/      shared request/response types
packages/config/   site config defaults (including theme defaults)
packages/ui/       shared UI components
cli/               deploy / db migration tooling
```

## Local development

Requires [Bun](https://bun.sh) 1.3+.

```bash
git clone https://github.com/PIKACHUIM/Rin.git
cd Rin
bun install

cp .env.example .env.local   # fill in your local settings
bun run dev                  # client on 5173, worker on 11498
```

Open <http://localhost:5173>.

| Command | Description |
| --- | --- |
| `bun run dev` | Start client and worker together |
| `bun run dev:client` / `dev:server` | Start one side only |
| `bun run check` | TypeScript type check |
| `bun run test` | All tests (`test:client` / `test:server` for one side) |
| `bun run db:migrate` | Run migrations against the local D1 |
| `bun run build` | Build client + server dry-run |

## Deploy to Cloudflare

### Option 1: one-click button

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/PIKACHUIM/Rin)

The button clones this repository and deploys the Worker using the repository `wrangler.toml`.
D1 needs a real `database_id`, so either bind the database after the first deploy or use Option 2,
which provisions D1 / Queue and runs migrations for you.

### Option 2: CLI (recommended)

```bash
export CLOUDFLARE_API_TOKEN=...      # Workers Scripts / D1 / Queues permissions
export CLOUDFLARE_ACCOUNT_ID=...

bun run deploy                       # client + server
bun run deploy -- --server           # worker only
bun run deploy -- --client           # frontend only
```

The CLI generates `wrangler.toml`, creates D1 (`DB_NAME`, default `rinblogs-data`) and the queue,
runs migrations, builds the client, deploys the Worker and syncs secrets.

### Option 3: plain wrangler

```bash
cp wrangler.toml wrangler.local.toml   # local config stays untracked
# set account_id, routes and the D1 database_id; keep the queue names
bun --filter './client' build
npx wrangler deploy --config wrangler.local.toml
```

### Required secrets

Set with `wrangler secret put <KEY>` (never in `[vars]`):

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Signs auth tokens |
| `RIN_GITHUB_CLIENT_ID` / `RIN_GITHUB_CLIENT_SECRET` | GitHub OAuth App (callback `/api/user/github/callback`) |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Object storage credentials |

### Optional site variables (`[vars]`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `NAME` / `DESCRIPTION` / `AVATAR` | `Rin` / empty | Site name, description, avatar |
| `PAGE_SIZE` | `5` | Items per page |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_HOST` | empty | Storage endpoint, bucket, public host |
| `S3_FOLDER` / `S3_CACHE_FOLDER` | `images/` / `cache/` | Upload and cache prefixes |
| `CACHE_STORAGE_MODE` | `s3` | `database` stores cache in D1 instead |
| `WEBHOOK_URL` | empty | Event notifications |
| `RSS_TITLE` / `RSS_DESCRIPTION` | empty | Feed metadata |

> `FRONTEND_URL` has been removed: sitemap, robots and feeds now follow the request domain.

## Themes

Admin → Settings → Personalization → Theme template switches between five themes, with custom
wallpaper and accent color support:

| Template | Style |
| --- | --- |
| `official` | Upstream look: neutral greys, white cards, no gradients or blur (default) |
| `aurora` | Cool gradients with glassmorphism |
| `fuwari` | Soft pastels and large radii |
| `noir` | High-contrast monochrome, small radii, no blur |
| `zen` | Warm paper tones with serif headings |

To add a theme, append an entry (light + dark tokens) to `client/src/theme/custom-templates.ts`;
it shows up in the settings UI automatically. `registerThemeTemplate()` is available for runtime registration.

## License

MIT. Based on [openRin/Rin](https://github.com/openRin/Rin); original copyright belongs to its authors,
modifications in this fork are released under the same license.
