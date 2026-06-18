const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://islamicnames.in/',
  'https://islamicnames.in/blog',
  'https://islamicnames.in/blog/50-beautiful-islamic-girl-names-starting-with-f',
  'https://islamicnames.in/blog/50-islamic-girl-names-starting-with-s',
  'https://islamicnames.in/blog/can-muslims-use-non-arabic-names',
  'https://islamicnames.in/blog/how-to-choose-an-islamic-name',
  'https://islamicnames.in/blog/modern-arabic-girl-names-that-sound-beautiful',
  'https://islamicnames.in/blog/names-meaning-light-in-the-quran',
  'https://islamicnames.in/blog/names-of-the-prophets-in-islam',
  'https://islamicnames.in/blog/rare-islamic-boy-names-with-deep-meanings',
  'https://islamicnames.in/blog/the-name-fatima-meaning-history',
  'https://islamicnames.in/blog/top-30-quranic-names-for-baby-boys-in-2026',
  'https://islamicnames.in/compare',
  'https://islamicnames.in/disclaimer',
  'https://islamicnames.in/faq',
  'https://islamicnames.in/free-service',
  'https://islamicnames.in/privacy',
  'https://islamicnames.in/report-bug',
  'https://islamicnames.in/search',
  'https://islamicnames.in/terms'
];

const reportPath = 'C:\\Users\\herog\\.gemini\\antigravity-cli\\brain\\d9e836ac-41d1-484c-a694-23ffc43d70a5\\pagespeed_report_real.md';

let mdContent = `# Real PageSpeed Insights Report (Mobile)

> [!NOTE]  
> This report was generated using local Lighthouse audits to bypass the Google PageSpeed API rate limit. It tests the mobile performance of all non-names pages.

## Scores Overview

| Page Path | Performance | LCP | CLS | SEO | Accessibility | Best Practices |
|-----------|-------------|-----|-----|-----|---------------|----------------|
`;

function getEmoji(score) {
  if (score >= 0.9) return '🟢 ' + Math.round(score * 100);
  if (score >= 0.5) return '🟡 ' + Math.round(score * 100);
  return '🔴 ' + Math.round(score * 100);
}

function getValEmoji(val, good, poor) {
  if (val <= good) return '🟢 ' + val;
  if (val >= poor) return '🔴 ' + val;
  return '🟡 ' + val;
}

for (const url of urls) {
  console.log('Testing ' + url + '...');
  try {
    // Run lighthouse, ignoring exit code because of EPERM bug
    execSync('npx lighthouse "' + url + '" --chrome-flags="--headless --no-sandbox" --output=json --output-path=./temp_lh.json --quiet', { stdio: 'ignore' });
  } catch (e) {
    // Expected to crash on cleanup
  }

  try {
    if (fs.existsSync('./temp_lh.json')) {
      const data = JSON.parse(fs.readFileSync('./temp_lh.json', 'utf8'));
      const perf = data.categories.performance?.score || 0;
      const seo = data.categories.seo?.score || 0;
      const a11y = data.categories.accessibility?.score || 0;
      const bp = data.categories['best-practices']?.score || 0;
      
      const lcp = (data.audits['largest-contentful-paint']?.numericValue / 1000).toFixed(1) + 's';
      const clscore = (data.audits['cumulative-layout-shift']?.numericValue || 0).toFixed(2);
      
      const pathOnly = new URL(url).pathname;
      mdContent += '| ' + (pathOnly || '/') + ' | ' + getEmoji(perf) + ' | ' + getValEmoji(parseFloat(lcp), 2.5, 4.0) + ' | ' + getValEmoji(parseFloat(clscore), 0.1, 0.25) + ' | ' + getEmoji(seo) + ' | ' + getEmoji(a11y) + ' | ' + getEmoji(bp) + ' |\\n';
      
      fs.unlinkSync('./temp_lh.json');
    }
  } catch (err) {
    console.error('Failed to parse report for ' + url + ':', err);
  }
}

fs.writeFileSync(reportPath, mdContent);
console.log('Report generated at:', reportPath);
