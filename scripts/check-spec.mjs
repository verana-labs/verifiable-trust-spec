// Consistency checks for the draft spec (spec.md). Run with `npm run check`,
// which builds the HTML first. See CONTRIBUTING.md.
//
// Checks:
//   1. every internal link `](#anchor)` resolves to an id of the built index.html
//   2. every link to a sibling Verana spec resolves, when that spec is built
//      in a sibling directory (skipped otherwise)
//   3. the glossary: alphabetical order, no duplicate term, no reference
//      without a definition, no definition that nothing references
//   4. every rule id cited in the text, such as [TR-4], is defined in this
//      spec or in the sibling spec
//   5. every Mermaid block parses
//
// The script exits with status 1 when a check fails.

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const pagesBase = 'https://verana-labs.github.io/';

const failures = [];
const notices = [];
const fail = (check, items) => {
  if (items.length) failures.push({ check, items });
};

const read = (file) => fs.readFileSync(file, 'utf8');
const htmlIds = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const lineOf = (text, index) => text.slice(0, index).split('\n').length;
const unique = (list) => [...new Set(list)].sort();

// Rule ids are upper-case and hyphenated: [TR-4], [MOD-AC-MSG-10], [VT-DECL].
const ruleId = String.raw`\[([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+)\]`;
// A rule id is defined by a heading that carries it, or by a list item or a
// table row that starts with it. A list item also defines the id that follows
// its label ("- Service Credential [ID]: ...") and an id that opens one of its
// sentences as the subject of a requirement ("... . [ID] MUST ...").
const ruleDefinitions = (text) => {
  const defined = new Set();
  const patterns = [
    new RegExp(String.raw`^#{1,6} .*?` + ruleId, 'gm'),
    new RegExp(String.raw`^\s*(?:[-*]|\d+\.)\s+(?:\*\*)?` + ruleId, 'gm'),
    new RegExp(String.raw`^\|\s*(?:\*\*)?` + ruleId, 'gm'),
    new RegExp(String.raw`^\s*[-*]\s+[^\[\]:.]{1,60}` + ruleId + ':', 'gm'),
    new RegExp(String.raw`^\s*[-*]\s.*?[.:]\s` + ruleId + String.raw`\s(?:MUST|SHOULD|MAY)\b`, 'gm'),
  ];
  for (const pattern of patterns) {
    for (const m of text.matchAll(pattern)) defined.add(m[1]);
  }
  // A heading may carry several ids.
  for (const heading of text.matchAll(/^#{1,6} .*$/gm)) {
    for (const m of heading[0].matchAll(new RegExp(ruleId, 'g'))) defined.add(m[1]);
  }
  return defined;
};

const specPath = path.join(root, 'spec.md');
const indexPath = path.join(root, 'index.html');
const spec = read(specPath);
// Code blocks hold examples, not links or rule citations.
const prose = spec.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' '));

if (!fs.existsSync(indexPath)) {
  console.error('index.html is missing: run `npm run build` first, or use `npm run check`.');
  process.exit(1);
}

// 1. Internal anchors.
const ids = htmlIds(read(indexPath));
fail(
  'internal links that resolve to no anchor',
  unique([...prose.matchAll(/\]\(#([^)\s]+)\)/g)].map((m) => m[1]).filter((a) => !ids.has(a))),
);

// 2. Links to sibling specs.
const thisRepo = path.basename(root);
const siblings = new Map();
const sibling = (repo) => {
  if (!siblings.has(repo)) {
    const dir = path.resolve(root, '..', repo);
    const built = path.join(dir, 'index.html');
    const source = path.join(dir, 'spec.md');
    siblings.set(
      repo,
      fs.existsSync(built) && fs.existsSync(source)
        ? { ids: htmlIds(read(built)), rules: ruleDefinitions(read(source)) }
        : null,
    );
    if (!siblings.get(repo)) notices.push(`links to ${repo} not checked: ../${repo} is not built`);
  }
  return siblings.get(repo);
};
const crossLinks = new RegExp(
  String.raw`\]\(` + pagesBase.replace(/[.]/g, '\\.') + String.raw`([a-z0-9-]+)/#([^)\s]+)\)`,
  'g',
);
const brokenCross = [];
const linkedRepos = new Set();
for (const m of prose.matchAll(crossLinks)) {
  const [, repo, anchor] = m;
  if (repo === thisRepo) {
    if (!ids.has(anchor)) brokenCross.push(`${repo}#${anchor}`);
    continue;
  }
  linkedRepos.add(repo);
  const target = sibling(repo);
  if (target && !target.ids.has(anchor)) brokenCross.push(`${repo}#${anchor}`);
}
fail('links to another spec that resolve to no anchor', unique(brokenCross));

// 3. Glossary.
const definitions = [...spec.matchAll(/^\[\[def:\s*([^\]]+)\]\]/gm)].map((m) =>
  m[1].split(',').map((term) => term.trim().toLowerCase()),
);
const firstTerms = definitions.map((terms) => terms[0]);
fail(
  'glossary entries out of alphabetical order',
  firstTerms.slice(1).flatMap((term, i) => (firstTerms[i] > term ? [`"${firstTerms[i]}" before "${term}"`] : [])),
);
const allTerms = definitions.flatMap((terms) => [...new Set(terms)]);
fail('glossary terms defined twice', unique(allTerms.filter((term, i) => allTerms.indexOf(term) !== i)));
const references = new Set(
  [...spec.matchAll(/\[\[ref:\s*([^\]]+)\]\]/g)].map((m) => m[1].trim().toLowerCase()),
);
fail('references without a definition', unique([...references].filter((term) => !allTerms.includes(term))));
fail(
  'definitions that nothing references',
  definitions.filter((terms) => !terms.some((term) => references.has(term))).map((terms) => terms[0]),
);

// 4. Rule ids.
const localRules = ruleDefinitions(spec);
const foreignRules = new Set();
for (const repo of linkedRepos) {
  const target = sibling(repo);
  if (target) for (const id of target.rules) foreignRules.add(id);
}
const allSiblingsBuilt = [...linkedRepos].every((repo) => sibling(repo));
// Inline code holds patterns such as `^[A-Z0-9]{20}$`, and a bracket followed
// by a parenthesis is a link label: neither cites a rule.
const citations = prose.replace(/`[^`\n]*`/g, (code) => ' '.repeat(code.length));
const cited = unique([...citations.matchAll(new RegExp(ruleId + String.raw`(?!\()`, 'g'))].map((m) => m[1]));
const undefinedRules = cited.filter(
  (id) => !localRules.has(id) && !foreignRules.has(id),
);
if (allSiblingsBuilt) fail('rule ids cited but defined nowhere', undefinedRules);
else if (undefinedRules.length) {
  notices.push(`${undefinedRules.length} rule ids not checked: they are not defined here and a sibling spec is not built`);
}

// 5. Mermaid blocks.
const blocks = [...spec.matchAll(/```mermaid\n([\s\S]*?)```/g)];
if (blocks.length) {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.DOMParser = dom.window.DOMParser;
  globalThis.Element = dom.window.Element;
  try {
    globalThis.navigator = dom.window.navigator;
  } catch {
    // Node defines a read-only navigator: Mermaid accepts it.
  }
  const mermaid = (await import(path.join(root, 'node_modules/mermaid/dist/mermaid.core.mjs'))).default;
  mermaid.initialize({ startOnLoad: false });
  const broken = [];
  for (const block of blocks) {
    try {
      await mermaid.parse(block[1]);
    } catch (error) {
      const reason = String(error.message || error).split('\n')[0];
      broken.push(`spec.md line ${lineOf(spec, block.index)}: ${reason}`);
    }
  }
  fail('Mermaid diagrams that do not parse', broken);
}

console.log(
  `${thisRepo}: ${definitions.length} glossary entries, ${localRules.size} rule ids, ${blocks.length} Mermaid diagrams`,
);
for (const notice of notices) console.log(`note: ${notice}`);
for (const { check, items } of failures) {
  console.error(`\nFAILED: ${check} (${items.length})`);
  for (const item of items) console.error(`  ${item}`);
}
if (failures.length) process.exit(1);
console.log('All checks passed.');
