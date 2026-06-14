const fs = require('fs');
const path = require('path');
const Name = require('../models/Name');
const cache = require('../utils/cache');

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

    // Fetch via HTTP (production mode/serverless) with Redis caching
    const fetchTemplateFromRemote = async () => {
        try {
            const frontendUrl = process.env.FRONTEND_URL || 'https://www.islamicnames.in';
            const response = await fetch(`${frontendUrl}/index.html`, {
                headers: { 'User-Agent': 'IslamicNames-SEO-Renderer' }
            });
            if (response.ok) {
                return await response.text();
            }
        } catch (err) {
            console.error('Failed to fetch HTML template:', err.message);
        }
        return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>IslamicNames</title></head><body><div id="root"></div></body></html>`;
    };

    try {
        cachedHtml = await cache.getOrSet('template:index_html', fetchTemplateFromRemote, 1800); // Cache template for 30 minutes in Redis
        lastFetched = now;
        return cachedHtml;
    } catch (e) {
        return await fetchTemplateFromRemote();
    }
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
        const cacheKey = `render:name:${idOrSlug.toLowerCase()}`;

        const fetchNameHtml = async () => {
            const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
            
            let name = isObjectId ? await Name.findById(idOrSlug) : null;
            if (!name) {
                name = await Name.findOne({ slug: idOrSlug.toLowerCase() });
            }

            if (!name || !name.isActive) {
                return { status: 404, html: null };
            }

            let html = await getTemplate();

            const title = `${name.nameEnglish} (${name.nameArabic}) Meaning & Origin | IslamicNames`;
            const description = `Find the meaning, origin, pronunciation, and Quranic reference for the name ${name.nameEnglish}. Meaning: "${name.meaning}".`;

            // Inject initial data script safely
            const initialDataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify({ name }).replace(/</g, '\\u003c')};</script>`;

            // Inject dynamic tags and HTML body structure
            html = html.replace('<head>', `<head>${initialDataScript}${generateSEOInjectHTML(name)}`);
            html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
            html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
            html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
            html = html.replace('<div id="root"></div>', `<div id="root">${generateFallbackBodyHTML(name)}</div>`);

            return { status: 200, html };
        };

        const result = await cache.getOrSet(cacheKey, fetchNameHtml, 600); // 10 min TTL

        if (result.status === 404) {
            let html = await getTemplate();
            html = html.replace('<head>', '<head><title>Name Not Found | IslamicNames</title>');
            return res.status(404).send(html);
        }

        injectPreloadHeaders(res, result.html);
        res.header('Content-Type', 'text/html');
        return res.status(200).send(result.html);
    } catch (err) {
        next(err);
    }
};

/**
 * Generate fallback HTML for home page
 * @param {Array} recentNames
 * @returns {string}
 */
function generateHomeFallbackBodyHTML(recentNames) {
    const namesHtml = recentNames.map(name => `
        <div style="padding: 16px; border: 1px solid #1f4037; border-radius: 12px; margin-bottom: 16px; background-color: #122c25;">
            <h3 style="font-size: 1.25rem; color: #10b981; margin: 0 0 8px 0; font-family: Amiri, serif;">${name.nameArabic}</h3>
            <h4 style="font-size: 1.1rem; font-weight: bold; color: #e8f5ef; margin: 0 0 4px 0;">${name.nameEnglish}</h4>
            <p style="font-size: 0.875rem; color: #9ca3af; margin: 0; font-style: italic;">"${name.meaning}"</p>
        </div>
    `).join('');

    return `
  <main style="max-width: 800px; margin: 40px auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background-color: #0d1f1a; color: #e8f5ef;">
    <header style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 2.5rem; color: #10b981; margin: 0 0 10px 0;">IslamicNames</h1>
      <p style="font-size: 1.2rem; color: #9ca3af; margin: 0; font-style: italic;">"Meaningful Names. Timeless Legacy."</p>
    </header>
    <section>
      <h2 style="font-size: 1.5rem; color: #10b981; margin: 0 0 20px 0; border-bottom: 1px solid #1f4037; padding-bottom: 8px;">Recently Added</h2>
      <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
        ${namesHtml}
      </div>
    </section>
  </main>
    `;
}

/**
 * Render home page dynamically with pre-populated HTML and preloaded state
 */
exports.renderHomePage = async (req, res, next) => {
    try {
        const cacheKey = 'render:home';

        const fetchHomeHtml = async () => {
            const recentNames = await Name.find({ isActive: true })
                .sort('-createdAt')
                .limit(8)
                .lean();

            let html = await getTemplate();

            // Inject initial data script safely
            const initialDataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify({ recentNames }).replace(/</g, '\\u003c')};</script>`;

            // Inject dynamic tags and HTML body structure
            html = html.replace('<head>', `<head>${initialDataScript}`);
            html = html.replace('<div id="root"></div>', `<div id="root">${generateHomeFallbackBodyHTML(recentNames)}</div>`);

            return html;
        };

        const html = await cache.getOrSet(cacheKey, fetchHomeHtml, 600); // 10 min TTL

        injectPreloadHeaders(res, html);
        res.header('Content-Type', 'text/html');
        return res.status(200).send(html);
    } catch (err) {
        next(err);
    }
};

/**
 * Inject HTTP Link preload headers into the response based on template HTML content
 * @param {object} res - Express response object
 * @param {string} html - The rendered HTML string
 * @returns {void}
 */
function injectPreloadHeaders(res, html) {
    const links = [];
    const cssMatch = html.match(/href="(\/assets\/[^"]+\.css)"/i);
    const jsMatch = html.match(/src="(\/assets\/[^"]+\.js)"/i);

    if (cssMatch) {
        links.push(`<${cssMatch[1]}>; rel=preload; as=style`);
    }
    if (jsMatch) {
        links.push(`<${jsMatch[1]}>; rel=modulepreload`);
    }

    if (links.length > 0) {
        res.setHeader('Link', links.join(', '));
    }
}
