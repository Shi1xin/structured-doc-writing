import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const skillDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const formatter = join(skillDir, "scripts/format-markdown.mjs");

function runFormatter(args, input) {
  return spawnSync(process.execPath, [formatter, ...args], {
    cwd: skillDir,
    encoding: "utf8",
    input,
  });
}

test("formats mixed Chinese and Western content across Markdown boundaries", () => {
  const input = [
    "这是App 2.0文档。",
    "",
    "中文**English**测试；",
    "",
    "中文[Link](https://example.com/a_b)测试。",
    "",
    "中文`const x=1;`测试。",
    "",
  ].join("\n");

  const expected = [
    "这是 App 2.0 文档",
    "",
    "中文 **English** 测试",
    "",
    "中文 [Link](https://example.com/a_b) 测试",
    "",
    "中文 `const x=1;` 测试",
    "",
  ].join("\n");

  const result = runFormatter(["--stdin"], input);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, expected);
});

test("removes terminal punctuation from paragraphs, lists, and table cells", () => {
  const input = [
    "# 标题。",
    "",
    "段落含有句号。末尾省略。",
    "",
    "- 列表项。",
    "- 保留内部；省略末尾；",
    "1. 编号列表。",
    "",
    "| 字段 | 说明 |",
    "| --- | --- |",
    "| MAC | 设备地址。 |",
    "",
  ].join("\n");

  const expected = [
    "# 标题。",
    "",
    "段落含有句号。末尾省略",
    "",
    "- 列表项",
    "- 保留内部；省略末尾",
    "1. 编号列表",
    "",
    "| 字段 | 说明 |",
    "| --- | --- |",
    "| MAC | 设备地址 |",
    "",
  ].join("\n");

  const result = runFormatter(["--stdin"], input);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, expected);
});

test("preserves fenced code, URLs, and punctuation before opaque inline content", () => {
  const input = [
    "地址是https://example.com/a_b。",
    "",
    "说明。`literal；`",
    "",
    "```json",
    '{"中文Key":"value测试。"}',
    "```",
    "",
  ].join("\n");

  const expected = [
    "地址是 https://example.com/a_b",
    "",
    "说明。`literal；`",
    "",
    "```json",
    '{"中文Key":"value测试。"}',
    "```",
    "",
  ].join("\n");

  const result = runFormatter(["--stdin"], input);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, expected);
});

test("is idempotent", () => {
  const first = runFormatter(["--stdin"], "中文App说明。\n");
  const second = runFormatter(["--stdin"], first.stdout);

  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(second.stdout, first.stdout);
});

test("check reports required changes and fix updates the file", () => {
  const directory = mkdtempSync(join(tmpdir(), "structured-doc-writing-"));
  const path = join(directory, "sample.md");
  writeFileSync(path, "这是App说明。\n", "utf8");

  const before = runFormatter(["--check", path]);
  assert.equal(before.status, 1);
  assert.match(before.stderr, /需要格式化/);

  const fix = runFormatter(["--fix", path]);
  assert.equal(fix.status, 0, fix.stderr);
  assert.equal(readFileSync(path, "utf8"), "这是 App 说明\n");

  const after = runFormatter(["--check", path]);
  assert.equal(after.status, 0, after.stderr);
});
