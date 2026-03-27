#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const generatedFiles = [
  'theory/index.html',
  'tldr/price-the-work-before-you-plan-it.html',
  'tldr/walkthrough.html',
  'tldr/decision-guide.html',
  'tldr/calibration-notes.html',
  'essays/systems-thinking-for-web-development-agencies.html'
];

try {
  execFileSync('git', ['diff', '--exit-code', '--', ...generatedFiles], {
    cwd: root,
    stdio: 'pipe'
  });
  console.log('Generated pages are up to date');
} catch (error) {
  process.stderr.write('Generated pages are out of date. Run `npm run build:static` and commit the results.\n');
  process.exit(1);
}
