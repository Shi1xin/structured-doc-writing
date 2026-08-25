#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { run } from "zhlint";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(scriptDir, "..");
const textlintBin = resolve(skillDir, "node_modules/.bin/textlint");
const rulesDir = resolve(scriptDir, "rules");

function formatMarkdown(source) {
  const spaced = run(source, {
    rules: {
      spaceBetweenMixedwidthContent: true,
      spaceOutsideCode: true,
    },
  }).result;

  return execFileSync(
    textlintBin,
    [
      "--no-textlintrc",
      "--rulesdir",
      rulesDir,
      "--fix",
      "--stdin",
      "--stdin-filename",
      "input.md",
      "--format",
      "fixed-result",
    ],
    {
      cwd: skillDir,
      encoding: "utf8",
      input: spaced,
      maxBuffer: 16 * 1024 * 1024,
    },
  );
}

function usage() {
  process.stderr.write(
    "用法：format-markdown.mjs --fix <文件...> | --check <文件...> | --stdin\n",
  );
}

const [mode, ...paths] = process.argv.slice(2);

if (mode === "--stdin" && paths.length === 0) {
  const source = readFileSync(0, "utf8");
  process.stdout.write(formatMarkdown(source));
  process.exit(0);
}

if ((mode !== "--fix" && mode !== "--check") || paths.length === 0) {
  usage();
  process.exit(2);
}

let needsFormatting = false;

for (const path of paths) {
  const source = readFileSync(path, "utf8");
  const formatted = formatMarkdown(source);

  if (formatted === source) {
    continue;
  }

  if (mode === "--fix") {
    writeFileSync(path, formatted, "utf8");
    process.stdout.write(`已格式化：${path}\n`);
  } else {
    needsFormatting = true;
    process.stderr.write(`需要格式化：${path}\n`);
  }
}

process.exit(needsFormatting ? 1 : 0);
