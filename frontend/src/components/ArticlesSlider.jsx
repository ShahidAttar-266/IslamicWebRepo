import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ARTICLES } from '../utils/articles-data';

/**
 * Renders a single article card within the grid.
 * @param {{ article: typeof ARTICLES[number] }} props
 */
const ArticleCard = ({ article }) => {
  const {
    title,
    href,
    tag,
    tagBg,
    tagText,
    date,
    readTime,
    arabicLetter,
    gradientFrom,
    gradientTo,
    excerpt,
    featured,
  } = article;

  const isHash = href === '#';

  const cardContent = (
    <>
      {/* Arabic letter hero area */}
      <div
        className="relative h-28 flex items-center justify-center rounded-t-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {/* Decorative radial glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        <span className="font-arabic text-5xl text-white/90 drop-shadow-lg select-none group-hover:scale-110 transition-transform duration-500">
          {arabicLetter}
        </span>

        {featured && (
          <span className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20">
            Featured
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Tag badge */}
        <span
          className="self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3"
          style={{ backgroundColor: tagBg, color: tagText }}
        >
          {tag}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-text leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-4 flex-1">
          {excerpt}
        </p>

        {/* Meta footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40 group-hover:border-primary/20 transition-colors">
          <span className="text-[10px] text-text-muted tracking-wide">
            {date} · {readTime} read
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
            Read
            <ArrowRight
              size={12}
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            />
          </span>
        </div>
      </div>
    </>
  );

  if (isHash) {
    return (
      <div
        className="group bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 flex flex-col cursor-not-allowed"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={href}
      className="group bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col"
    >
      {cardContent}
    </Link>
  );
};

const ArticlesSlider = () => {
  // Slice to exactly 8 articles for a 2x4 grid
  const displayedArticles = ARTICLES.slice(0, 8);

  return (
    <section className="py-12 md:py-20">
      {/* Outer card wrapper */}
      <div className="bg-card/30 border border-border rounded-3xl p-6 md:p-10">
        {/* ── Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <BookOpen size={14} className="text-primary" />
              <span className="text-primary text-xs font-semibold uppercase tracking-widest">
                From the Blog
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-3">
              Islamic Naming Articles
            </h2>
            <p className="text-text-muted max-w-xl text-sm md:text-base leading-relaxed">
              Expert guides, curated lists, and inspiration to help you choose the perfect name.
            </p>
          </div>

          <Link
            to="/blog"
            className="group/link flex items-center gap-2 text-primary text-sm font-semibold shrink-0 hover:underline underline-offset-4"
          >
            View All Articles
            <ArrowRight
              size={16}
              className="translate-x-0 group-hover/link:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* ── Grid Layout ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSlider;
