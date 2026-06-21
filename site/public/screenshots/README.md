# Screenshots

This folder holds the real iOS screenshots referenced by the site.
While it is empty, every screenshot slot renders an attractive
gradient placeholder instead. Drop a file with the matching name
here and the placeholder is replaced automatically — no code changes.

Recommended filenames (referenced across the site):

| File                        | Where it appears                          |
| --------------------------- | ----------------------------------------- |
| `home.png`                  | Hero (homepage), home placeholder label   |
| `player-lyrics.png`         | Player showcase + docs/player             |
| `karaoke.png`               | Karaoke showcase + docs/karaoke           |
| `ai-dj.png`                 | AI showcase + docs/ai                     |
| `library.png`               | docs/library                              |
| `lyrics.png`                | docs/lyrics                               |
| `metadata.png`              | docs/metadata                             |
| `discovery.png`             | docs/discovery                            |
| `settings.png`              | docs/settings                             |
| `getting-started.png`       | docs/getting-started                      |

## Capture tips

- Capture on an **iPhone 17** simulator at `1170 × 2532` (point scale ×3)
  to match the app's reference device in `AGENTS.md`.
- Export as PNG with the status bar visible for authenticity.
- For dark mode variants, append `-dark` (e.g. `player-lyrics-dark.png`)
  and wire up conditional rendering in the relevant component if needed.

## How placeholders work

`PhoneMockup` and `ShowcaseSection` accept a `screenshot` prop. When the
prop is omitted, the placeholder is shown. To enable a real image, pass
the filename, e.g.:

```tsx
<ShowcaseSection screenshot="player-lyrics.png" ... />
```
