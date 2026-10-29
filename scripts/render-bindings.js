// Renders the binding documents (bindings/<version>/*.md) to HTML pages next
// to their sources, so that GitHub Pages serves them as pages: the static
// deploy publishes the repository as is, and a .md file would be served as
// raw text. Links between bindings (.md) are rewritten to the rendered pages.
// Runs after the spec render (see "build" in package.json).
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: false, linkify: true });
const defaultLink = md.renderer.rules.link_open || ((tokens, i, options, env, self) => self.renderToken(tokens, i, options));
md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  const href = tokens[i].attrGet('href');
  if (href && !/^[a-z]+:/i.test(href)) tokens[i].attrSet('href', href.replace(/\.md(#|$)/, '.html$1'));
  return defaultLink(tokens, i, options, env, self);
};

// Heading ids as GitHub generates them, so that #anchors work on both.
md.core.ruler.push('heading_ids', (state) => {
  state.tokens.forEach((t, i) => {
    if (t.type !== 'heading_open') return;
    const text = state.tokens[i + 1].content;
    t.attrSet('id', text.toLowerCase().replace(/[^a-z0-9 _-]/g, '').trim().replace(/ /g, '-'));
  });
});

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []);
}

if (!fs.existsSync('bindings')) process.exit(0);
for (const file of walk('bindings')) {
  const src = fs.readFileSync(file, 'utf8');
  const title = (src.match(/^# (.+)$/m) || [, path.basename(file, '.md')])[1];
  const root = path.posix.relative(path.posix.dirname(file.split(path.sep).join('/')), '.') || '.';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<link rel="icon" type="image/svg+xml" href="${root}/img/favicon.svg">
<style>
:root { color-scheme: light dark; --fg: #1d1d1f; --bg: #ffffff; --muted: #6e6e73; --line: #d2d2d7; --code: #f5f5f7; --link: #0b63ce; }
@media (prefers-color-scheme: dark) { :root { --fg: #f5f5f7; --bg: #161618; --muted: #a1a1a6; --line: #3a3a3c; --code: #232326; --link: #6cb0ff; } }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 52rem; margin: 0 auto; padding: 2rem 1rem 4rem; }
a { color: var(--link); }
code { background: var(--code); padding: 0.1em 0.3em; border-radius: 4px; font-size: 0.9em; overflow-wrap: anywhere; }
table { border-collapse: collapse; width: 100%; display: block; overflow-x: auto; }
th, td { border: 1px solid var(--line); padding: 0.4rem 0.6rem; text-align: left; vertical-align: top; }
h1 { line-height: 1.25; }
</style>
</head>
<body>
<main>
${md.render(src)}</main>
</body>
</html>
`;
  fs.writeFileSync(file.replace(/\.md$/, '.html'), html);
  console.log(`binding rendered: ${file.replace(/\.md$/, '.html')}`);
}
