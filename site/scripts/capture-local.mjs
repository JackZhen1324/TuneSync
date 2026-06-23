#!/usr/bin/env node
/**
 * Capture the LOCAL TuneSync site (/zh-CN) section-by-section using the
 * user-installed ChromeDriver, so the local side of the diff needs no
 * manual work. Pair with screenshots of the Codex page (tmp/codex-reference)
 * via scripts/diff-sections.mjs.
 *
 * Usage:
 *   node scripts/capture-local.mjs            # dev server must be running on :3000
 *   node scripts/capture-local.mjs --port=3001
 *
 * Prereqs (already set up by user):
 *   ChromeDriver on port 9515, Chrome for Testing at ~/chrome-for-testing/...
 *   `pnpm dev` running for the site.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const HOME = os.homedir();
const CHROME = `${HOME}/chrome-for-testing/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const DRIVER_PORT = 9515;
const port = process.argv.includes("--port=")
  ? process.argv.find((a) => a.startsWith("--port=")).split("=")[1]
  : "3000";

const OUT = path.resolve("tmp/local-shots");
fs.mkdirSync(OUT, { recursive: true });

async function createSession() {
  const r = await fetch(`http://localhost:${DRIVER_PORT}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      capabilities: {
        alwaysMatch: {
          "goog:chromeOptions": {
            binary: CHROME,
            args: ["--headless=new", "--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
          },
        },
      },
    }),
  });
  const j = await r.json();
  if (!j.value?.sessionId) throw new Error("no session: " + JSON.stringify(j.value?.error));
  return j.value.sessionId;
}

async function exec(sid, script) {
  const r = await fetch(`http://localhost:${DRIVER_PORT}/session/${sid}/execute/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ script, args: [] }),
  });
  const j = await r.json();
  return j.value;
}

async function shot(sid, file) {
  const r = await fetch(`http://localhost:${DRIVER_PORT}/session/${sid}/screenshot`);
  const j = await r.json();
  fs.writeFileSync(path.join(OUT, file), Buffer.from(j.value, "base64"));
  console.log("  wrote", file, fs.statSync(path.join(OUT, file)).size, "bytes");
}

(async () => {
  const sid = await createSession();
  console.log("session:", sid);

  const base = `http://localhost:${port}/zh-CN`;
  // Each route maps to a label that should pair with a codex-reference/* file.
  const targets = [
    { url: `${base}/`, label: "home", full: true },
    { url: `${base}/features`, label: "features" },
    { url: `${base}/pricing`, label: "pricing" },
    { url: `${base}/docs`, label: "docs" },
  ];

  // Computed tokens on home (for a quick numeric diff against codex tokens.json).
  await fetch(`http://localhost:${DRIVER_PORT}/session/${sid}/url`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: targets[0].url }),
  });
  await new Promise((r) => setTimeout(r, 2500));
  const tokens = await exec(sid, `
    const pick=(s)=>{const el=document.querySelector(s);if(!el)return null;const cs=getComputedStyle(el);
      return{bg:cs.backgroundColor,color:cs.color,font:cs.fontFamily,size:cs.fontSize,weight:cs.fontWeight,ls:cs.letterSpacing,lh:cs.lineHeight};};
    const bb=getComputedStyle(document.body);
    return JSON.stringify({body:{bg:bb.backgroundColor,color:bb.color,font:bb.fontFamily,size:bb.fontSize},h1:pick('h1'),h2:pick('h2')});
  `);
  fs.writeFileSync(path.join(OUT, "tokens.json"), tokens);
  console.log("tokens:", tokens);

  for (const t of targets) {
    console.log("capturing", t.label, t.url);
    await fetch(`http://localhost:${DRIVER_PORT}/session/${sid}/url`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: t.url }),
    });
    await new Promise((r) => setTimeout(r, 2000));
    await exec(sid, "window.scrollTo(0,0)");
    await new Promise((r) => setTimeout(r, 600));
    await shot(sid, `${t.label}-top.png`);
    if (t.full) {
      // capture hero, mid, bottom thirds
      const h = await exec(sid, "return document.body.scrollHeight");
      for (let y = 900, i = 1; y < Number(h); y += 900, i++) {
        await exec(sid, `window.scrollTo(0,${y})`);
        await new Promise((r) => setTimeout(r, 600));
        await shot(sid, `${t.label}-${i}.png`);
      }
    }
  }

  // delete session
  await fetch(`http://localhost:${DRIVER_PORT}/session/${sid}`, { method: "DELETE" }).catch(()=>{});
  console.log("DONE. files:", fs.readdirSync(OUT));
})().catch((e) => { console.error("ERR:", e.message); process.exit(1); });
