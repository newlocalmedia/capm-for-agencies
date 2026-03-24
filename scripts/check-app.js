#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

if (!html.includes('<script src="scripts/calc-core.js"></script>')) {
  throw new Error('index.html is missing the shared calculation module include.');
}

const match = html.match(/<script>\n([\s\S]*)<\/script>\n<\/body>/);
if (!match) {
  throw new Error('Could not find the inline application script in index.html.');
}

new Function(match[1]);
console.log('index.html inline script parses successfully');
