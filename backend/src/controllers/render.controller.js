const fs = require('fs');
const path = require('path');
const Name = require('../models/Name');

let cachedHtml = null;
let lastFetched = 0;

/**
 * Fetch and cache the base index.html template
 * @returns {Promise<string>}
 */
async function getTemplate() {
    const now = Date.now();
    if (cachedHtml && (now - lastFetched < 10 * 60 * 1000)) {
        return cachedHtml;
    }

    // Try local filesystem first (development mode)
    try {
        const localPath = path.join(__dirname, '../../../frontend/dist/index.html');
        if (fs.existsSync(localPath)) {
            cachedHtml = fs.readFileSync(localPath, 'utf8');
            lastFetched = now;
            return cachedHtml;
        }
    } catch (e) {
        // Silent fallback to remote fetch
    }

    // Fetch via HTTP (production mode/serverless)
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'https://www.islamicnames.in';
        const response = await fetch(`${frontendUrl}/index.html`, {
            headers: { 'User-Agent': 'IslamicNames-SEO-Renderer' }
        });
        if (response.ok) {
            cachedHtml = await response.text();
            lastFetched = now;
            return cachedHtml;
        }
    } catch (err) {
        console.error('Failed to fetch HTML template:', err.message);
    }

    // Ultimate fallback if everything fails
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>IslamicNames</title></head><body><div id="root"></div></body></html>`;
}

/**
 * Generate SEO tags to inject into the head
 * @param {object} name
 * @returns {string}
 */
function generateSEOInjectHTML(name) {
    const title = `${name.nameEnglish} (${name.nameArabic}) Meaning & Origin | IslamicNames`;
    const canonicalUrl = `https://www.islamicnames.in/name/${name.slug || name._id}`;
    const keywords = `${name.nameEnglish} meaning, ${name.nameEnglish} islamic name, ${name.nameArabic} meaning, muslim name ${name.nameEnglish}`;
    
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${name.nameEnglish} - Meaning, Origin & Islamic Significance`,
        "description": `Detailed information about the Islamic name ${name.nameEnglish}, including its meaning: "${name.meaning}", origin: ${name.origin || 'Arabic'}, and historical context.`,
        "datePublished": name.createdAt || new Date().toISOString(),
        "author": { "@type": "Organization", "name": "IslamicNames" },
        "publisher": {
            "@type": "Organization",
            "name": "IslamicNames",
            "logo": { "@type": "ImageObject", "url": "https://www.islamicnames.in/logo-120.webp" }
        },
        "mainEntity": {
            "@type": "DefinedTerm",
            "name": name.nameEnglish,
            "alternateName": name.nameArabic,
            "description": name.meaning,
            "inDefinedTermSet": "https://www.islamicnames.in"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
            { "@type": "ListItem", "position": 2, "name": "Browse Names", "item": "https://www.islamicnames.in/search" },
            { "@type": "ListItem", "position": 3, "name": name.nameEnglish, "item": canonicalUrl }
        ]
    };

    return `
  <title>${title}</title>
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="keywords" content="${keywords}" />
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    `;
}

/**
 * Generate fallback semantic HTML inside #root for crawlers
 * @param {object} name
 * @returns {string}
 */
function generateFallbackBodyHTML(name) {
    const quranSec = name.quranReference && name.quranReference.surah ? `
    <section style="margin-bottom: 30px; background-color: #122c25; padding: 20px; border-radius: 8px; border: 1px solid #1f4037;">
      <h2 style="font-size: 1.5rem; color: #10b981; margin-top: 0; border-bottom: 1px solid #1f4037; padding-bottom: 8px;">Quranic Reference</h2>
      <p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;"><strong>Surah:</strong> ${name.quranReference.surah}</p>
      <p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;"><strong>Verse:</strong> ${name.quranReference.verse}</p>
      ${name.quranReference.text ? `<p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;"><strong>Quranic Text:</strong> ${name.quranReference.text}</p>` : ''}
    </section>` : '';

    const historySec = name.history ? `
    <section style="margin-bottom: 30px; background-color: #122c25; padding: 20px; border-radius: 8px; border: 1px solid #1f4037;">
      <h2 style="font-size: 1.5rem; color: #10b981; margin-top: 0; border-bottom: 1px solid #1f4037; padding-bottom: 8px;">Historical Significance</h2>
      <p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;">${name.history}</p>
    </section>` : '';

    return `
  <article style="max-width: 800px; margin: 40px auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background-color: #0d1f1a; color: #e8f5ef;">
    <header style="margin-bottom: 30px;">
      <h1 style="font-size: 2.5rem; color: #10b981; margin: 0 0 10px 0;">${name.nameEnglish} (${name.nameArabic})</h1>
      <p style="font-size: 1.2rem; color: #9ca3af; margin: 0;">Islamic ${name.gender || 'unisex'} name meaning and details</p>
    </header>
    <section style="margin-bottom: 30px; background-color: #122c25; padding: 20px; border-radius: 8px; border: 1px solid #1f4037;">
      <h2 style="font-size: 1.5rem; color: #10b981; margin-top: 0; border-bottom: 1px solid #1f4037; padding-bottom: 8px;">Meaning & Significance</h2>
      <p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;"><strong>Meaning:</strong> ${name.meaning}</p>
      <p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;"><strong>Gender:</strong> ${name.gender || 'N/A'}</p>
      <p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;"><strong>Origin:</strong> ${name.origin || 'Arabic'}</p>
      ${name.pronunciation ? `<p style="font-size: 1.1rem; line-height: 1.6; margin: 12px 0;"><strong>Pronunciation:</strong> ${name.pronunciation}</p>` : ''}
    </section>
    ${quranSec}
    ${historySec}
  </article>
    `;
}

/**
 * Render name page dynamically with pre-populated HTML for crawler SEO
 */
exports.renderNamePage = async (req, res, next) => {
    try {
        const idOrSlug = req.params.idOrSlug;
        const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
        
        let name = isObjectId ? await Name.findById(idOrSlug) : null;
        if (!name) {
            name = await Name.findOne({ slug: idOrSlug.toLowerCase() });
        }

        let html = await getTemplate();

        if (!name || !name.isActive) {
            html = html.replace('<head>', '<head><title>Name Not Found | IslamicNames</title>');
            return res.status(404).send(html);
        }

        const title = `${name.nameEnglish} (${name.nameArabic}) Meaning & Origin | IslamicNames`;
        const description = `Find the meaning, origin, pronunciation, and Quranic reference for the name ${name.nameEnglish}. Meaning: "${name.meaning}".`;

        // Inject dynamic tags and HTML body structure
        html = html.replace('<head>', `<head>${generateSEOInjectHTML(name)}`);
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
        html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
        html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
        html = html.replace('<div id="root"></div>', `<div id="root">${generateFallbackBodyHTML(name)}</div>`);

        res.header('Content-Type', 'text/html');
        return res.status(200).send(html);
    } catch (err) {
        next(err);
    }
};
