import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Base path is opt-in via the BASE_PATH env var. Set it when building for a
 * sub-path deployment such as GitHub Pages:
 *   BASE_PATH=/TuneSync pnpm build
 * For local dev or a custom-domain deploy, leave it unset (served from "/").
 */
const basePath = process.env.BASE_PATH ?? "";

const isSubPath = basePath.length > 0;

// Expose the base path to client components so <img>/asset URLs resolve
// correctly under a sub-path deployment.
if (isSubPath) {
  process.env.NEXT_PUBLIC_BASE_PATH = basePath;
}

const nextConfig: NextConfig = {
  // Pin the workspace root to this `site/` directory. The monorepo root
  // contains a sibling yarn.lock (the React Native app); without this,
  // `next dev` mis-detects the workspace root and fails to resolve routes.
  outputFileTracingRoot: path.resolve(__dirname),
  // Sub-path deploys (GitHub Pages) serve static files only.
  output: isSubPath ? "export" : undefined,
  basePath: isSubPath ? basePath : undefined,
  // Match GitHub Pages' directory-style URLs and let next-intl's locale
  // prefix resolve cleanly under the base path.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Tell Turbopack (used by `next dev`) that THIS directory is the project
  // root. The monorepo parent has its own yarn.lock; without this, dev picks
  // the wrong workspace root and all routes 404.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default withNextIntl(nextConfig);
