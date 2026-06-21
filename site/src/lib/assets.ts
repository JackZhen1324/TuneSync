/**
 * Prefix a public asset path with the configured base path, so screenshots
 * and other static assets resolve correctly under a sub-path deployment such
 * as GitHub Pages (https://<user>.github.io/TuneSync/).
 *
 * Set `NEXT_PUBLIC_BASE_PATH` (e.g. "/TuneSync") at build time. Empty/undefined
 * means the site is served from the root.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!BASE_PATH) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
