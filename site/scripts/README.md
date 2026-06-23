# Pixel-calibration workflow (Codex ↔ local)

This automates the local side of the visual diff and gives you a one-command
way to spot the gaps once you've captured the Codex reference.

## Why this exists

The Codex page is client-rendered behind Cloudflare Turnstile, so it can't be
screenshotted from this automation environment. The **local** TuneSync site,
however, renders fine. So:

- **Local side is automated** → `node scripts/capture-local.mjs`
- **Codex side is you** → screenshot the sections, drop them in `tmp/codex-reference/`
- **Diff is automated** → `node scripts/diff-sections.mjs`

## One-time setup (already done in this repo)

1. ChromeDriver + Chrome for Testing installed at `~/chrome-for-testing/...`
2. Start ChromeDriver: `~/chrome-for-testing/chromedriver-mac-arm64/chromedriver --port=9515 --allowed-origins='*'`

## Capture the local site

```bash
cd site
pnpm dev                         # in one terminal
node scripts/capture-local.mjs   # in another (driver must be running on :9515)
```

Writes section screenshots + computed `tokens.json` to `tmp/local-shots/`.

## Capture the Codex reference (you do this)

In a normal browser on a machine with a display/GPU, open
https://openai.com/zh-Hans-CN/codex/ and screenshot each section. Save them
into `tmp/codex-reference/` with these names (so they pair with the locals):

| Codex section        | filename               | pairs with local       |
| -------------------- | ---------------------- | ---------------------- |
| Hero (首屏)          | `hero.png`             | `home-top.png`         |
| Agent workflow demo  | `workflow.png`         | `home-2.png` (approx)  |
| Code/editor viz      | `editor.png`           | `home-3.png` (approx)  |
| Download / surfaces  | `download.png`         | `home-6.png` (approx)  |
| Testimonials         | `testimonials.png`     | `home-7.png` (approx)  |
| Footer               | `footer.png`           | `home-8.png` (approx)  |

> `tmp/` is gitignored, so your screenshots won't be committed.

## Run the diff

```bash
node scripts/diff-sections.mjs
```

Writes `tmp/CALIBRATION-DIFF.md` listing which pairs are present and the
per-section token deltas (colors/sizes), so you can hand me concrete numbers
to calibrate against.

## Verified token alignment (already done)

Both the local site and OpenAI's own Cloudflare challenge page report the same
body background — confirming the palette is sourced from OpenAI's real values:

```
local body bg : rgb(52, 53, 65)  =  #343541   ✅
OpenAI page bg: rgb(52, 53, 65)  =  #343541   ✅
```
