"use strict";

const TERMINAL_PUNCTUATION = /[。；](?=\s*$)/u;
const OPAQUE_INLINE_TYPES = new Set(["Code", "Image", "Html", "Break"]);

function findLastVisibleLeaf(node) {
  if (node.type === "Str") {
    return { kind: "text", node };
  }

  if (OPAQUE_INLINE_TYPES.has(node.type)) {
    return { kind: "other" };
  }

  if (!Array.isArray(node.children)) {
    return null;
  }

  for (let index = node.children.length - 1; index >= 0; index -= 1) {
    const result = findLastVisibleLeaf(node.children[index]);
    if (result) {
      return result;
    }
  }

  return null;
}

function createRule(context) {
  const { Syntax, RuleError, fixer, report } = context;

  function checkBlock(node) {
    const lastVisible = findLastVisibleLeaf(node);
    if (!lastVisible || lastVisible.kind !== "text") {
      return;
    }

    const textNode = lastVisible.node;
    const match = textNode.raw.match(TERMINAL_PUNCTUATION);
    if (!match) {
      return;
    }

    const relativeIndex = match.index;

    report(
      textNode,
      new RuleError("段落、列表项和表格单元格结尾省略中文句号或分号", {
        index: relativeIndex,
        fix: fixer.removeRange([relativeIndex, relativeIndex + match[0].length]),
      }),
    );
  }

  return {
    [Syntax.Paragraph]: checkBlock,
    TableCell: checkBlock,
  };
}

module.exports = {
  linter: createRule,
  fixer: createRule,
};
