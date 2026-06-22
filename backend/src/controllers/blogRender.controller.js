const cache = require('../utils/cache');

/**
 * Static map of blog article metadata for SSR rendering.
 * Keeps the render endpoint self-contained — no DB dependency, no frontend fetch.
 */
const BLOG_ARTICLES = {
    '50-beautiful-islamic-girl-names-starting-with-f': {
        title: '50 Beautiful Islamic Girl Names Starting with F — With Famous Muslim Actresses & Meanings',
        description: 'Choosing a name for your baby girl is one of the most beautiful and sacred responsibilities in Islam. Discover 50 beautiful Islamic girl names starting with the letter F, each paired with its meaning, Arabic script, origin, and a famous Muslim actress.',
        date: 'June 10, 2026',
        readTime: '6 min',
        tag: 'Girl Names',
    },
    'top-30-quranic-names-for-baby-boys-in-2026': {
        title: 'Top 30 Quranic Names for Baby Boys in 2026',
        description: 'Names directly from the Quran carry immense blessing. Compiled with verse references.',
        date: 'June 11, 2026',
        readTime: '7 min',
        tag: 'Quranic Names',
    },
    'how-to-choose-an-islamic-name': {
        title: 'How to Choose an Islamic Name — Complete Guide for Parents',
        description: 'What Islam says about naming: Sunnah, what to avoid, and how to pick a name that lasts.',
        date: 'June 3, 2026',
        readTime: '5 min',
        tag: 'Naming Guide',
    },
    'rare-islamic-boy-names-with-deep-meanings': {
        title: 'Rare Islamic Boy Names with Deep, Powerful Meanings',
        description: 'Distinctive, strong Arabic boy names rarely seen in standard lists — with full meanings.',
        date: 'May 22, 2026',
        readTime: '6 min',
        tag: 'Boy Names',
    },
    'modern-arabic-girl-names-that-sound-beautiful': {
        title: 'Modern Arabic Girl Names That Sound Beautiful in English Too',
        description: 'Elegant, meaningful names that work perfectly in Karachi, London, or Toronto.',
        date: 'May 28, 2026',
        readTime: '5 min',
        tag: 'Girl Names',
    },
    'names-meaning-light-in-the-quran': {
        title: 'Names Meaning Light in the Quran — Noor, Zia, and More',
        description: 'Light is one of the most sacred themes in the Quran. Names rooted in Noor and radiance.',
        date: 'May 15, 2026',
        readTime: '6 min',
        tag: 'Quranic Names',
    },
    '50-islamic-girl-names-starting-with-s': {
        title: '50 Islamic Girl Names Starting with S — Sara, Safiya & More',
        description: "The letter Seen gives us some of Islam's most beloved names — explore them all here.",
        date: 'May 10, 2026',
        readTime: '6 min',
        tag: 'Girl Names',
    },
    'can-muslims-use-non-arabic-names': {
        title: 'Can Muslims Use Non-Arabic Names? A Scholarly Perspective',
        description: 'Persian, Turkish, Urdu names — are they permissible? Islamic scholars weigh in on the matter.',
        date: 'May 5, 2026',
        readTime: '4 min',
        tag: 'Naming Guide',
    },
    'names-of-the-prophets-in-islam': {
        title: 'Names of the Prophets in Islam — Meanings and Stories',
        description: 'From Adam to Muhammad ﷺ — the names of all 25 Prophets mentioned in the Quran, explained.',
        date: 'April 28, 2026',
        readTime: '8 min',
        tag: 'Boy Names',
    },
    'the-name-fatima-meaning-history': {
        title: 'The Name Fatima — Meaning, History, and Why It Matters',
        description: 'The most beloved name in Islam. Learn the full story, meaning, and legacy of Fatimah bint Muhammad.',
        date: 'April 20, 2026',
        readTime: '5 min',
        tag: 'Girl Names',
    },
};

/**
 * Hardcoded minimal HTML template (mirrors render.controller.js pattern).
 * Used as the SSR shell for blog pages.
 */
const BLOG_TEMPLATE = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IslamicNames Blog</title>
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.islamicnames.in/blog" />
  <link rel="icon" type="image/png" href="https://www.islamicnames.in/favicon.png">
  <meta name="description" content="Read articles about Islamic names, Quranic references, and naming traditions.">
  <meta property="og:title" content="IslamicNames Blog">
  <meta property="og:description" content="Read articles about Islamic names, Quranic references, and naming traditions.">
  <meta property="og:image" content="https://www.islamicnames.in/og-image.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;700&display=optional">
  <style>
    :root {
      --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      --bg-color: #0d1f1a;
      --text-color: #e8f5ef;
    }
    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      margin: 0;
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
</head>
<body>
  <div id="root"></div>
</body></html>`;

/**
 * Generate structured data (JSON-LD) for a blog article
 * @param {object} article - Article metadata from BLOG_ARTICLES
 * @param {string} slug - Article slug
 * @returns {string} HTML script tags with structured data
 */
function generateBlogSEOInjectHTML(article, slug) {
    const canonicalUrl = `https://www.islamicnames.in/blog/${slug}`;

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.title,
        'description': article.description,
        'datePublished': article.date,
        'author': {
            '@type': 'Organization',
            'name': 'IslamicNames',
            'url': 'https://www.islamicnames.in'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'IslamicNames',
            'url': 'https://www.islamicnames.in',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://www.islamicnames.in/favicon.png'
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonicalUrl
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.islamicnames.in/' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://www.islamicnames.in/blog' },
            { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': canonicalUrl }
        ]
    };

    const keywords = `${article.tag}, islamic names, muslim baby names, ${article.title.toLowerCase()}`;

    return `
  <meta name="keywords" content="${keywords}" />
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    `;
}

/**
 * Generate semantic fallback HTML for blog article body (crawler-friendly)
 * @param {object} article - Article metadata
 * @param {string} slug - Article slug
 * @returns {string}
 */
function generateBlogFallbackBodyHTML(article, slug) {
    return `
  <article style="max-width: 800px; margin: 40px auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background-color: #0d1f1a; color: #e8f5ef;">
    <header style="margin-bottom: 30px;">
      <nav style="margin-bottom: 16px; font-size: 0.875rem; color: #9ca3af;">
        <a href="/" style="color: #10b981; text-decoration: none;">Home</a>
        <span style="margin: 0 8px;">›</span>
        <a href="/blog" style="color: #10b981; text-decoration: none;">Blog</a>
        <span style="margin: 0 8px;">›</span>
        <span>${article.title}</span>
      </nav>
      <h1 style="font-size: 2.2rem; color: #10b981; margin: 0 0 12px 0; line-height: 1.3;">${article.title}</h1>
      <div style="display: flex; gap: 16px; font-size: 0.875rem; color: #9ca3af; flex-wrap: wrap;">
        <span style="background-color: #122c25; padding: 4px 12px; border-radius: 20px; border: 1px solid #1f4037;">${article.tag}</span>
        <time datetime="${article.date}">${article.date}</time>
        <span>${article.readTime} read</span>
      </div>
    </header>
    <section style="margin-bottom: 30px; background-color: #122c25; padding: 20px; border-radius: 8px; border: 1px solid #1f4037;">
      <p style="font-size: 1.15rem; line-height: 1.7; margin: 0; color: #e8f5ef;">${article.description}</p>
    </section>
    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1f4037; font-size: 0.875rem; color: #9ca3af;">
      <p>Read the full article at <a href="https://www.islamicnames.in/blog/${slug}" style="color: #10b981; text-decoration: none;">islamicnames.in</a></p>
    </footer>
  </article>
    `;
}

/**
 * Render a blog article page with pre-populated HTML for crawler SEO.
 * Uses a static metadata map — no database lookup needed.
 *
 * @route GET /api/v1/render/blog/:slug
 */
exports.renderBlogPage = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const article = BLOG_ARTICLES[slug];

        if (!article) {
            // Unknown slug → 404 with minimal shell
            let html = BLOG_TEMPLATE;
            html = html.replace(/<title>[^<]*<\/title>/i, '<title>Article Not Found | IslamicNames Blog</title>');
            res.header('Content-Type', 'text/html');
            return res.status(404).send(html);
        }

        const cacheKey = `render:blog:${slug}`;

        const buildHtml = () => {
            let html = BLOG_TEMPLATE;

            const canonicalUrl = `https://www.islamicnames.in/blog/${slug}`;
            const ogImage = 'https://www.islamicnames.in/og-image.png';

            // Replace title, canonical, description, OG tags
            html = html.replace(/<title>[^<]*<\/title>/i, `<title>${article.title} | IslamicNames Blog</title>`);
            html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
            html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${article.description}" />`);
            html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${article.title} | IslamicNames Blog" />`);
            html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${article.description}" />`);
            html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);

            // Inject structured data
            html = html.replace('<head>', `<head>${generateBlogSEOInjectHTML(article, slug)}`);

            // Inject fallback body content
            html = html.replace('<div id="root"></div>', `<div id="root">${generateBlogFallbackBodyHTML(article, slug)}</div>`);

            return html;
        };

        const html = await cache.getOrSet(cacheKey, buildHtml, 3600); // 1 hour TTL (static content)

        res.header('Content-Type', 'text/html');
        res.header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).send(html);
    } catch (err) {
        next(err);
    }
};
