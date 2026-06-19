const fs = require('fs');
const https = require('https');

const fetchSitemap = () => {
    return new Promise((resolve, reject) => {
        https.get('https://islamicnames.in/sitemap.xml', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
};

const fetchPageSpeed = (url) => {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=AIzaSyCnM4nSj3XuhmomJpwERtB1liNsUOxiv10`;
        https.get(apiUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', err => reject(err));
    });
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
const sitemapPath = 'C:\\Users\\herog\\.gemini\\antigravity-cli\\brain\\79e6971d-cac4-49b1-9c9c-0463b7bc8f6f\\.system_generated\\steps\\39\\content.md';
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    
    const locRegex = /<loc>(.*?)<\/loc>/g;
    let match;
    const urls = [];
    while ((match = locRegex.exec(sitemap)) !== null) {
        urls.push(match[1]);
    }
    
    const filteredUrls = urls.filter(url => !url.includes('/name/'));
    console.log(`Found ${urls.length} total URLs, ${filteredUrls.length} after filtering.`);
    
    const results = [];
    
    for (let i = 0; i < filteredUrls.length; i++) {
        const url = filteredUrls[i];
        console.log(`Processing ${i + 1}/${filteredUrls.length}: ${url}`);
        
        try {
            const data = await fetchPageSpeed(url);
            
            if (data.error) {
                console.error(`Error for ${url}: ${data.error.message}`);
                results.push({ url, error: data.error.message });
            } else {
                const lighthouse = data.lighthouseResult;
                if (!lighthouse) {
                    results.push({ url, error: "No lighthouse result returned" });
                } else {
                    const performanceScore = lighthouse.categories.performance ? lighthouse.categories.performance.score * 100 : null;
                    const audits = lighthouse.audits || {};
                    const failedAudits = Object.values(audits)
                        .filter(a => a.score !== null && a.score < 0.5 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative')
                        .map(a => ({
                            title: a.title,
                            id: a.id,
                            score: a.score,
                            displayValue: a.displayValue,
                            description: a.description ? a.description.split('[')[0].trim() : ''
                        }));
                        
                    results.push({ url, performanceScore, failedAudits });
                }
            }
        } catch (e) {
            console.error(`Exception for ${url}: ${e.message}`);
            results.push({ url, error: e.message });
        }
        
        if (i < filteredUrls.length - 1) {
            console.log("Waiting 5 seconds before next request...");
            await delay(5000);
        }
    }
    
    // Ensure scratch dir exists
    const scratchDir = 'C:\\Users\\herog\\.gemini\\antigravity-cli\\brain\\79e6971d-cac4-49b1-9c9c-0463b7bc8f6f\\scratch';
    if (!fs.existsSync(scratchDir)) {
        fs.mkdirSync(scratchDir, { recursive: true });
    }
    
    const outputPath = scratchDir + '\\pagespeed_results.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Results written to ${outputPath}`);
}

main().catch(console.error);
