const fs = require('fs');

const dataPath = 'C:\\Users\\herog\\.gemini\\antigravity-cli\\brain\\79e6971d-cac4-49b1-9c9c-0463b7bc8f6f\\scratch\\pagespeed_results.json';
const results = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let md = '# PageSpeed Insights Audit Report (Mobile)\n\n';
md += 'This report contains the results of the Google PageSpeed Insights (Mobile Strategy) audits for the URLs found in the `islamicnames.in` sitemap, excluding individual name pages (URLs containing `/name/`).\n\n';

md += '**Summary:**\n';
md += '- Total URLs processed: 20\n';
md += '- Execution: Sequentially with a 5-second delay and a valid API key.\n\n';

md += '## Performance Overview\n\n';
md += '| URL | Performance Score | Status |\n';
md += '|-----|-------------------|--------|\n';

for (const res of results) {
    if (res.error) {
        md += `| \`${res.url}\` | N/A | ❌ Error |\n`;
    } else {
        const score = res.performanceScore;
        const icon = score >= 90 ? '🟢' : (score >= 50 ? '🟠' : '🔴');
        md += `| \`${res.url}\` | ${score} ${icon} | ✅ Success |\n`;
    }
}

md += '\n## Detailed Failed Audits\n\n';

for (const res of results) {
    if (res.error) {
        md += `### ${res.url}\n\n`;
        md += `**Error:** ${res.error}\n\n---\n\n`;
    } else if (res.failedAudits && res.failedAudits.length > 0) {
        md += `### ${res.url} (Score: ${res.performanceScore})\n\n`;
        md += '| Audit | Score | Savings / Value | Description |\n';
        md += '|-------|-------|-----------------|-------------|\n';
        for (const audit of res.failedAudits) {
            md += `| **${audit.title}** | ${audit.score} | ${audit.displayValue || 'N/A'} | ${audit.description} |\n`;
        }
        md += '\n---\n\n';
    } else {
        md += `### ${res.url} (Score: ${res.performanceScore})\n\n`;
        md += 'No major issues found! 🎉\n\n---\n\n';
    }
}

const outPath = 'C:\\Users\\herog\\.gemini\\antigravity-cli\\brain\\79e6971d-cac4-49b1-9c9c-0463b7bc8f6f\\scratch\\temp_report.md';
fs.writeFileSync(outPath, md);
console.log('Report written to ' + outPath);
