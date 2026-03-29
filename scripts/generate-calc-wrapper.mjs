import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourcePath = path.join(__dirname, 'shared-calc-core.mjs');
const targetPath = path.join(__dirname, 'calc-core.js');

const source = fs.readFileSync(sourcePath, 'utf8');
const exportNames = [];

const withoutDefault = source.replace(/\nexport default \{[\s\S]*?\};?\s*$/m, '\n');
const body = withoutDefault.replace(/^export\s+(const|function)\s+([A-Za-z0-9_]+)/gm, (_, kind, name) => {
  exportNames.push(name);
  return `${kind} ${name}`;
});

const output = `(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CapmCalculations = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

${body.trim()}

  return {
    ${exportNames.join(',\n    ')}
  };
}));
`;

fs.writeFileSync(targetPath, output);
console.log(`built ${path.relative(path.join(__dirname, '..'), targetPath)}`);
