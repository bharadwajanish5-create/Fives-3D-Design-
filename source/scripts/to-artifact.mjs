// Converts the single-file build into an Artifact page (no html/head/body wrapper).
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('dist-single/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const scripts = [...head.matchAll(/<script[\s\S]*?<\/script>/g)].map((m) => m[0]);
let headRest = head;
scripts.forEach((s) => (headRest = headRest.replace(s, '')));
headRest = headRest.replace(/<meta charset[^>]*>/, '').replace(/<meta name="viewport"[^>]*>/, '');
const title = headRest.match(/<title>[\s\S]*?<\/title>/)[0];
headRest = headRest.replace(title, '');
const fit = '<meta name="claude:viewport-fit-sides" content="cover" />';
headRest = headRest.replace(fit, '');
const out = `${title}\n${fit}\n${headRest.trim()}\n${body.replace('<script type="module" src="/src/main.tsx"></script>', '').trim()}\n${scripts.join('\n')}\n`;
writeFileSync('fives-homepage.html', out);
console.log('bytes', out.length, out.slice(0, 300));
