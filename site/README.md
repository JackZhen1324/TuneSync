# TuneSync site

The marketing site + user documentation for TuneSync, built with
**Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + next-intl**.
Bilingual (简体中文 / English), dark mode, fully static-exportable.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000  (served from "/")
```

To preview the GitHub Pages build locally (with the `/TuneSync` base path):

```bash
BASE_PATH=/TuneSync pnpm build
cd out && python3 -m http.server 8080
# open http://localhost:8080/TuneSync/
```

## Deploy to GitHub Pages

Deployment is automated via `.github/workflows/deploy-site.yml`. On every
push to `master` that touches `site/**` (or via manual `workflow_dispatch`),
the workflow:

1. Installs deps with `pnpm install --frozen-lockfile`
2. Builds with `BASE_PATH=/TuneSync` (static export to `site/out/`)
3. Uploads `site/out/` and deploys to GitHub Pages

### One-time repository setup

In the GitHub repo (**Settings → Pages**):

1. **Source**: `GitHub Actions` (not “Deploy from a branch”)
2. Under **Settings → Actions → General → Workflow permissions**, allow
   `Read and write permissions` so the workflow can create the deployment.

The site then lives at **`https://<user>.github.io/TuneSync/`**.

> The base path `/TuneSync` is derived from the repo name. If you rename the
> repo or use a custom domain, set `BASE_PATH` accordingly:
> - Custom domain (e.g. `tunesync.app`) → `BASE_PATH="" pnpm build` (root)
> - Different repo name → `BASE_PATH=/<repo-name>`

## Structure

```
src/
├── app/[locale]/            # localized routes (zh-CN, en)
│   ├── page.tsx             # home
│   ├── features/            # feature deep-dives
│   ├── pricing/             # free vs VIP
│   └── docs/                # 9 doc pages + home
├── components/
│   ├── site/                # Header, Footer, LangSwitcher, ThemeToggle
│   ├── marketing/           # Hero, FeatureGrid, Showcase, PhoneMockup
│   └── docs/                # Sidebar, DocsArticle, Callout/Steps/etc.
├── lib/assets.ts            # basePath-aware asset URLs
i18n/
├── routing.ts               # locales: zh-CN (default), en
└── messages/{zh-CN,en}.json # all copy lives here
public/screenshots/          # drop real screenshots here (see its README)
```

## Screenshots

While `public/screenshots/` only contains a README, every screenshot slot
renders a gradient placeholder. Drop a file with the matching name in and
pass `screenshot="<name>"` to `PhoneMockup` / `ShowcaseSection` to enable it.
See `public/screenshots/README.md` for the filename list.
