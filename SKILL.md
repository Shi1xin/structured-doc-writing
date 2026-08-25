---
name: structured-doc-writing
description: Use only for workplace, product, and technical documents such as PRDs, requirements, plans, notes, design briefs, and handoffs. Do not use for academic writing
---

# Structured Doc Writing

## Principle

Choose structure from the work the document must do for its reader. Let the document shape follow the actual problem.

Good structure makes relationships visible: sequence, branch, ownership, state, evidence, tradeoff, scope, or decision. The right load-bearing structure depends on the document.

## Method

1. Identify the reader and the judgment they need to make.
2. Find the few relationships that carry the document.
3. Give each section one job.
4. Put information where it does the most work.
5. Keep material that adds judgment, action, or precision.

## Structure

- Use headings to reveal structure, not to create volume.
- Use nested bullets for hierarchy or branching.
- Use tables for real comparisons, mappings, states, fields, or ownership splits.
- Keep related information together.
- Split sections when the reader needs a new mode of thinking.
- Merge sections when they repeat the same job.

## Anti-Slop

- Cut title restatements.
- Cut requirement restatements.
- Cut risk lists lacking handling paths.
- Cut decorative terminology.
- Deduplicate lists, states, channels, languages, and outputs.
- Remove discussion or decision context the reader cannot see, including explicit references such as `基于之前讨论`, `按之前决策`, reviewer names, and revision traces.
- Remove sentences whose only purpose is to explain that the selected approach does not use, include, or depend on an option rejected during discussion.
- State the selected behavior directly. Include exclusions only when they define scope, compatibility, or an implementation constraint.
- Replace generic paragraphs with specific behavior, constraint, or evidence.

## Style

- Write direct Chinese with concrete nouns and verbs.
- Keep bullets short.
- Preserve enough context for the target reader; compress everything else.

## Review

- The structure matches the reader's task.
- Each section has a distinct job.
- Important relationships are visible through sequence, indentation, table, or grouping.
- Repeated information has been removed or consolidated in one place.
- Sentences that only say the selected approach does not use, include, or depend on a rejected option have been removed.
- Every remaining exclusion defines scope, compatibility, or an implementation constraint; otherwise the sentence states the selected behavior directly.

## Formatting

- After review, run formatter: `node <skill-dir>/scripts/format-markdown.mjs --fix <path>`
- Before delivery, verify document with `node <skill-dir>/scripts/format-markdown.mjs --check <path>`