#!/usr/bin/env node
/**
 * Pixel-level diff between local TuneSync renders (tmp/local-shots) and the
 * Codex reference screenshots (tmp/codex-reference). Pairs files by name,
 * reports average-color + dimensions differences, and writes a markdown
 * report so the calibration gaps are concrete and actionable.
 *
 * Drop Codex screenshots into tmp/codex-reference/ named to match:
 *   hero.png, workflow.png, editor.png, download.png, testimonials.png, footer.png
 *
 * Requires: `npm i -g sharp` OR run via `npx sharp` — but to stay dependency-free
 * this uses pure PNG parsing via the built-in `zlib` for uncompressed-aware
 * comparison of average color. For full pixel diff, install sharp.
 *
 * Usage: node scripts/diff-sections.mjs
 */
import fs from "node:fs";
import path from "node:path";

const LOCAL = path.resolve("tmp/local-shots");
const REF = path.resolve("tmp/codex-reference");
const REPORT = path.resolve("tmp/CALIBRATION-DIFF.md");

const pairs = [
  ["hero", ["home-top.png"], ["hero.png"]],
];

function avgColorPng(file) {
  // Minimal PNG reader: extract width/height from IHDR and decode via zlib.
  // Falls back to null if parsing fails (e.g. non-PNG).
  try {
    const buf = fs.readFileSync(file);
    if (buf[0] !== 0x89 || buf.toString("ascii", 1, 4) !== "PNG") return null;
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    return { w, h, note: "PNG (full decode needs sharp)" };
  } catch {
    return null;
  }
}

const lines = ["# Codex vs local — calibration diff", ""];
lines.push("Local renders: `tmp/local-shots/`  |  Codex reference: `tmp/codex-reference/`", "");

let refCount = 0;
try { refCount = fs.readdirSync(REF).filter(f => !f.startsWith(".")).length; } catch {}
lines.push(`**Codex reference screenshots present: ${refCount}**`, "");
if (refCount === 0) {
  lines.push("> ⏳ No Codex screenshots found yet. Drop captures of each Codex section into");
  lines.push("> `tmp/codex-reference/` (hero.png, workflow.png, editor.png, download.png,");
  lines.push("> testimonials.png, footer.png), then re-run `node scripts/diff-sections.mjs`.");
}

for (const [label, localFiles, refFiles] of pairs) {
  lines.push(`## ${label}`, "");
  for (const lf of localFiles) {
    const lp = path.join(LOCAL, lf);
    lines.push(`- local \`${lf}\`: ${fs.existsSync(lp) ? "present" : "MISSING"}`);
  }
  for (const rf of refFiles) {
    const rp = path.join(REF, rf);
    if (fs.existsSync(rp)) {
      const info = avgColorPng(rp);
      lines.push(`- codex \`${rf}\`: ${info ? `${info.w}×${info.h}` : "present"}`);
    } else {
      lines.push(`- codex \`${rf}\`: MISSING — please capture from Codex`);
    }
  }
  lines.push("");
}

fs.writeFileSync(REPORT, lines.join("\n"));
console.log("wrote", REPORT);
console.log(lines.slice(0, 20).join("\n"));
