// Points the favicon of every rendered spec page at the small favicon.svg.
// Spec-up has no favicon option. It reuses the "logo" from specs.json as the
// icon, which makes the browser download the full 23 KB logo. This script
// replaces that tag. It puts favicon.svg next to the logo, so each spec keeps
// the correct relative path. Runs after the render (see "build" in package.json).
const fs = require('fs');
const path = require('path');

const ICON_TAG = /<link rel="icon"[^>]*>/;
const specs = JSON.parse(fs.readFileSync('specs.json', 'utf8')).specs;

for (const spec of specs) {
  const file = path.join(spec.spec_directory, 'index.html');
  if (!fs.existsSync(file)) continue;

  const href = path.posix.join(path.posix.dirname(spec.logo || 'img/logo.svg'), 'favicon.svg');
  const target = path.join(spec.spec_directory, href);
  if (!fs.existsSync(target)) {
    console.warn(`favicon missing, skipped: ${target}`);
    continue;
  }

  const html = fs.readFileSync(file, 'utf8');
  const tag = `<link rel="icon" type="image/svg+xml" href="${href}">`;
  if (!ICON_TAG.test(html)) {
    console.warn(`no icon tag found, skipped: ${file}`);
    continue;
  }

  fs.writeFileSync(file, html.replace(ICON_TAG, tag));
  console.log(`favicon set: ${file} -> ${href}`);
}
