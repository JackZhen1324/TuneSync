import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Base path is only set when building for GitHub Pages, where the site is
 * served from https://<user>.github.io/TuneSync/. Override locally with the
 * BASE_PATH env var (e.g. `BASE_PATH="" pnpm dev` for a clean "/" root).
 */
const basePath = process.env.BASE_PATH ?? "/TuneSync";

const isGitHubPages = basePath.length > 0;

// Expose the base path to client components so <img>/asset URLs resolve
// correctly under a sub-path deployment.
if (isGitHubPages) {
  process.env.NEXT_PUBLIC_BASE_PATH = basePath;
}

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only — emit a fully static site.
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? basePath : undefined,
  // Match GitHub Pages' directory-style URLs and let next-intl's locale
  // prefix resolve cleanly under the base path.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
