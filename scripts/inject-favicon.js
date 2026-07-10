// Injects the favicon link into every rendered spec page. Spec-up has no
// native favicon support, and the spec is served under a sub-path of
// verana-labs.github.io, so a root favicon.ico would not be picked up either.
// Runs after the spec-up render (see the "build" script in package.json).
const fs = require('fs');
const path = require('path');

const TAG = '<link rel="icon" type="image/svg+xml" href="img/favicon.svg">';
const specs = JSON.parse(fs.readFileSync('specs.json', 'utf8')).specs;

for (const spec of specs) {
  const file = path.join(spec.spec_directory, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('rel="icon"')) continue;
  fs.writeFileSync(
    file,
    html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n        ${TAG}`)
  );
  console.log(`favicon injected: ${file}`);
}
