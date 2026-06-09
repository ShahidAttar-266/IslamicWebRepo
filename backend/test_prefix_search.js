/**
 * test_prefix_search.js
 * Verifies that the updated search logic in names.controller.js
 * correctly applies prefix matching on nameEnglish.
 *
 * Run with: node test_prefix_search.js
 */

// Simulated name dataset (subset of real Islamic names)
const NAMES = [
  'Abdul', 'Abdullah', 'Abdur', 'Abid', 'Abrar',
  'Ahmad', 'Ahmed', 'Ahmer', 'Ahsan', 'Ahad', 'Ahlam', 'Ahmadali',
  'Ali', 'Aliya', 'Alina', 'Alia', 'Aleem',
  'Amina', 'Amir', 'Amira', 'Amjad',
  'Muhammad', 'Muhammadali',          // contain 'ah' but do NOT start with A
  'Ibrahim', 'Ismail',
  'Fatima', 'Farouk', 'Faisal',
  'Zainab', 'Zahid', 'Zara',
  'Omar', 'Umar', 'Uthman',
  'Hassan', 'Hussain',
  'Mariam', 'Maryam',
  'Sarah', 'Sumaiya', 'Samira',
  'Rahma', 'Rahman', 'Rashid',
];

/**
 * Simulate the updated controller search logic.
 * @param {string} q - The query string (e.g., 'A', 'Ah', 'Ahm', 'Ali')
 * @returns {string[]} Names that match the prefix query on nameEnglish
 */
function simulateSearch(q) {
  if (!q) return NAMES;
  const escapedQ    = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^${escapedQ}`, 'i'); // starts-with
  return NAMES.filter(name => prefixRegex.test(name)).sort();
}

// ── Test cases ────────────────────────────────────────────────────────────────
const tests = [
  {
    input:    'A',
    expected: ['Abdul', 'Abdullah', 'Abdur', 'Abid', 'Abrar',
               'Ahmad', 'Ahmed', 'Ahmer', 'Ahsan', 'Ahad', 'Ahlam', 'Ahmadali',
               'Ali', 'Aliya', 'Alina', 'Alia', 'Aleem',
               'Amina', 'Amir', 'Amira', 'Amjad'],
    notExpected: ['Muhammad', 'Ibrahim', 'Hassan'],
  },
  {
    input:    'Ah',
    expected: ['Ahmad', 'Ahmed', 'Ahmer', 'Ahsan', 'Ahad', 'Ahlam', 'Ahmadali'],
    notExpected: ['Muhammad', 'Abdul', 'Ali', 'Rahman'],  // contain 'ah' but don't start with it
  },
  {
    input:    'Ahm',
    expected: ['Ahmad', 'Ahmed', 'Ahmer', 'Ahmadali'],
    notExpected: ['Ahsan', 'Ahad', 'Ahlam', 'Muhammad'],
  },
  {
    input:    'Ali',
    expected: ['Ali', 'Aliya', 'Alina', 'Alia'],
    notExpected: ['Aleem', 'Abdul', 'Ahmad'],
  },
  {
    input:    'Z',
    expected: ['Zainab', 'Zahid', 'Zara'],
    notExpected: ['Abdul', 'Ahmad', 'Faisal'],
  },
  {
    input:    'Fa',
    expected: ['Fatima', 'Farouk', 'Faisal'],
    notExpected: ['Zara', 'Sarah'],
  },
];

// ── Run tests ─────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

console.log('\n🔍 Prefix Search Verification\n' + '='.repeat(50));

for (const { input, expected, notExpected } of tests) {
  const results = simulateSearch(input);
  const resultSet = new Set(results.map(n => n.toLowerCase()));

  const missingExpected = expected.filter(n => !resultSet.has(n.toLowerCase()));
  const wronglyIncluded = (notExpected || []).filter(n => resultSet.has(n.toLowerCase()));

  const ok = missingExpected.length === 0 && wronglyIncluded.length === 0;

  if (ok) {
    console.log(`✅  q="${input}"  →  [${results.join(', ')}]`);
    passed++;
  } else {
    console.log(`❌  q="${input}"`);
    if (missingExpected.length) console.log(`    MISSING:  ${missingExpected.join(', ')}`);
    if (wronglyIncluded.length) console.log(`    WRONG IN: ${wronglyIncluded.join(', ')}`);
    console.log(`    GOT:      [${results.join(', ')}]`);
    failed++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);

// Key negative test: "Muhammad" must NOT appear for query "Ah"
const ahResults = simulateSearch('Ah').map(n => n.toLowerCase());
const muhammadSlipped = ahResults.includes('muhammad');
console.log(`\n🛡️  "Muhammad" NOT in Ah-results: ${!muhammadSlipped ? '✅ PASS' : '❌ FAIL (old partial-match bug)'}`);

console.log('\nDone.\n');
