#!/usr/bin/env node
// original comes from https://github.com/nodejs/node/blob/master/tools/update-authors.js

// Usage: tools/update-author.js [--dry]
// Passing --dry will redirect output to stdout rather than write to 'AUTHORS'.
'use strict';
const {spawn} = require('child_process');
const fs = require('fs');
const readline = require('readline');

const log = spawn(
  'git',
  // Inspect author name/email and body.
  ['log', '--reverse', '--format=Author: %aN <%aE>\n%b'],
  {
    stdio: ['inherit', 'pipe', 'inherit']
  }
);
const rl = readline.createInterface({input: log.stdout});

let output;
if (process.argv.includes('--dry')) {
  output = process.stdout;
} else {
  output = fs.createWriteStream('AUTHORS');
}

output.write('# Authors ordered by first contribution.\n\n');

const seen = new Set();

const excludeEmails = [
  '<support@greenkeeper.io>',
  '<greenkeeper[bot]@users.noreply.github.com>'
];

// Support regular git author metadata, as well as `Author:` and
// `Co-authored-by:` in the message body. Both have been used in the past
// to indicate multiple authors per commit, with the latter standardized
// by GitHub now.
const authorRe = new RegExp(
  '(^Author:|^Co-authored-by:)\\s+(?<author>[^<]+)\\s+(?<email><[^>]+>)',
  'i'
);

rl.on('line', line => {
  const match = line.match(authorRe);
  if (!match) return;

  const {author, email} = match.groups;

  if (seen.has(email) || excludeEmails.includes(email)) {
    return;
  }

  seen.add(email);
  output.write(`${author} ${email}\n`);
});

rl.on('close', () => {
  output.end('\n# Generated by scripts/update-authors.js\n');
});
