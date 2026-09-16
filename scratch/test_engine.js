import { processDevOpsQuery } from '../src/terminal/engine/parser.js';
import { renderMarkdownToHTML } from '../src/terminal/engine/formatter.js';

console.log('Testing Senior DevOps Knowledge Engine...');

const testQueries = [
  'how to troubleshoot crashloopbackoff',
  '502 bad gateway error',
  'pod crashloopbackoff kyu hota hai',
  'aws 3 tier architecture',
  'docker vs kubernetes',
  'interview',
  'free -h',
  'kubectl get pods',
  'who is abhishek',
  'skills',
  'what is terraform state',
  'why do we need it?', // contextual follow-up to terraform state
  'explain prometheus architecture',
  'what happens when you type a url'
];

let passCount = 0;

for (const q of testQueries) {
  try {
    const result = processDevOpsQuery(q);
    if (!result || !result.text) {
      console.error(`FAIL: No result for query: "${q}"`);
      continue;
    }
    const html = renderMarkdownToHTML(result.text);
    if (!html || html.length < 20) {
      console.error(`FAIL: Rendered HTML too short for query: "${q}"`);
      continue;
    }
    console.log(`PASS [${result.type}]: "${q}" -> ${html.substring(0, 80).replace(/\n/g, ' ')}...`);
    passCount++;
  } catch (err) {
    console.error(`ERROR on query "${q}":`, err);
  }
}

console.log(`\nResults: ${passCount} / ${testQueries.length} passed.`);
if (passCount === testQueries.length) {
  console.log('ALL TESTS PASSED!');
} else {
  process.exit(1);
}
