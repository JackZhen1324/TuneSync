/**
 * Central place for external links (download / store).
 *
 * These ship with sensible DEFAULT placeholder values so the site never
 * shows a dead end. Replace them with the real URLs when the app is live.
 *
 *   - iOS: App Store / TestFlight link
 *   - (Android / macOS / Windows: not yet available)
 */
export const DOWNLOAD_LINKS = {
  /** iOS TestFlight link. */
  ios: "https://testflight.apple.com/join/1QVnhpkZ",
  android: null,
  macos: null,
  windows: null,
} as const;

export type Platform = keyof typeof DOWNLOAD_LINKS;

export function downloadUrl(platform: Platform): string | null {
  return DOWNLOAD_LINKS[platform];
}
