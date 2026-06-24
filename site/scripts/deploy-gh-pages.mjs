#!/usr/bin/env node
/**
 * One-command deploy to GitHub Pages.
 *
 *   pnpm deploy          # build + push to gh-pages branch
 *
 * What it does:
 *   1. Runs `BASE_PATH=/TuneSync pnpm build`
 *   2. Copies site/out into a fresh gh-pages branch via a temp git worktree
 *   3. Commits + pushes to origin/gh-pages
 *
 * The temp worktree is cleaned up automatically, even on failure.
 * Requires: git push access to origin, pnpm build passing locally.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
const SITE_DIR = process.cwd();
const OUT_DIR = path.join(SITE_DIR, "out");
const BRANCH = "gh-pages";
const REMOTE = "origin";
const BASE_PATH = "/TuneSync";

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

function git(args, cwd = REPO_ROOT) {
  return execSync(`git ${args}`, { cwd, encoding: "utf8" }).trim();
}

// Step 1 — build with sub-path base
console.log("\n=== Building (BASE_PATH=" + BASE_PATH + ") ===\n");
run(`BASE_PATH=${BASE_PATH} pnpm build`);

if (!fs.existsSync(OUT_DIR)) {
  console.error("Build failed: out/ not found");
  process.exit(1);
}

// Step 2 — deploy via temp worktree
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gh-pages-deploy."));
let cleaned = false;
function cleanup() {
  if (cleaned) return;
  cleaned = true;
  try {
    execSync(`git worktree remove --force ${tmp}`, { cwd: REPO_ROOT, stdio: "ignore" });
  } catch {}
}
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(130); });
process.on("SIGTERM", () => { cleanup(); process.exit(143); });

// Make sure the gh-pages branch exists (locally or remote), create orphan if not
const localBranches = git("branch --list " + BRANCH);
const remoteRef = (() => { try { return git(`rev-parse --verify refs/remotes/${REMOTE}/${BRANCH}`); } catch { return ""; } })();

if (!localBranches && !remoteRef) {
  console.log("\n=== Creating orphan gh-pages branch ===\n");
  git(`worktree add --force --detach ${tmp}`);
  execSync(`git checkout --orphan ${BRANCH}`, { cwd: tmp, stdio: "inherit" });
  execSync("git rm -rf .", { cwd: tmp, stdio: "ignore" });
} else {
  console.log(`\n=== Deploying to ${BRANCH} ===\n`);
  if (localBranches) {
    git(`worktree add --force ${tmp} ${BRANCH}`);
  } else {
    git(`worktree add --force -b ${BRANCH} ${tmp} ${REMOTE}/${BRANCH}`);
  }
}

// Replace contents (keep .git)
for (const entry of fs.readdirSync(tmp)) {
  if (entry === ".git") continue;
  fs.rmSync(path.join(tmp, entry), { recursive: true, force: true });
}
fs.cpSync(OUT_DIR, tmp, { recursive: true });
fs.writeFileSync(path.join(tmp, ".nojekyll"), "");

// Commit + push
execSync("git add -A", { cwd: tmp, stdio: "inherit" });
const user = git("config user.name");
const email = git("config user.email");
const short = git("rev-parse --short HEAD");
execSync(
  `git -c user.name="${user}" -c user.email="${email}" commit -q -m "deploy: rebuild GitHub Pages (${short})"`,
  { cwd: tmp, stdio: "inherit" }
);

console.log(`\n=== Pushing to ${REMOTE}/${BRANCH} ===\n`);
execSync(`git push ${REMOTE} ${BRANCH}:${BRANCH}`, { cwd: tmp, stdio: "inherit" });

cleanup();

console.log(`\nDeployed. Site will update at https://jackzhen1324.github.io${BASE_PATH}/ within 1-2 min.`);
