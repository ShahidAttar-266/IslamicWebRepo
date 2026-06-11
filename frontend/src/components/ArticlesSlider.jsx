import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

const AUTO_SCROLL_INTERVAL_MS = 4000;
const SCROLL_STEP_PX = 320;

const ARTICLES = [
  {
    title: '50 Beautiful Islamic Girl Names Starting with F',
    href: '/islamicnames-sample-article.html',
    tag: 'Girl Names',
    tagBg: '#FCE8F0',
    tagText: '#A0305A',
    date: 'June 10, 2025',
    readTime: '6 min',
    arabicLetter: 'فـ',
    gradientFrom: '#A0305A',
    gradientTo: '#D4607A',
    excerpt: 'Discover beautiful and meaningful Islamic girl names starting with the letter F, each with rich Arabic heritage.',
    featured: true,
  },
  {
    title: 'Top 30 Quranic Names for Baby Boys in 2025',
    href: '/blog.html',
    tag: 'Quranic Names',
    tagBg: '#D1FAE5',
    tagText: '#065F46',
    date: 'June 7, 2025',
    readTime: '7 min',
    arabicLetter: 'قـ',
    gradientFrom: '#1A4F8A',
    gradientTo: '#2E6DB4',
    excerpt: 'Explore the most popular Quranic names for baby boys, each rooted in the Holy Quran with profound meanings.',
  },
  {
    title: 'How to Choose an Islamic Name — Complete Guide',
    href: '/blog.html',
    tag: 'Naming Guide',
    tagBg: '#F0DEB0',
    tagText: '#7A5A10',
    date: 'June 3, 2025',
    readTime: '5 min',
    arabicLetter: 'نـ',
    gradientFrom: '#7A5A10',
    gradientTo: '#C4922A',
    excerpt: 'A comprehensive guide covering Islamic naming traditions, Sunnah recommendations, and practical tips for parents.',
  },
  {
    title: 'Modern Arabic Girl Names That Sound Beautiful',
    href: '/blog.html',
    tag: 'Girl Names',
    tagBg: '#FCE8F0',
    tagText: '#A0305A',
    date: 'May 28, 2025',
    readTime: '5 min',
    arabicLetter: 'مـ',
    gradientFrom: '#A0305A',
    gradientTo: '#D4607A',
    excerpt: 'Find modern Arabic names for girls that are elegant, meaningful, and perfect for today\'s world.',
  },
  {
    title: 'Rare Islamic Boy Names with Deep Meanings',
    href: '/blog.html',
    tag: 'Boy Names',
    tagBg: '#E3EEF9',
    tagText: '#1A4F8A',
    date: 'May 22, 2025',
    readTime: '6 min',
    arabicLetter: 'زـ',
    gradientFrom: '#2D4A6A',
    gradientTo: '#4A7FA5',
    excerpt: 'Uncover rare and unique Islamic boy names with deep historical and spiritual significance.',
  },
  {
    title: 'Names Meaning Light in the Quran',
    href: '/blog.html',
    tag: 'Quranic Names',
    tagBg: '#D1FAE5',
    tagText: '#065F46',
    date: 'May 15, 2025',
    readTime: '4 min',
    arabicLetter: 'عـ',
    gradientFrom: '#3D3D1E',
    gradientTo: '#6B6B2E',
    excerpt: 'Explore names derived from the concept of light (Noor) in the Quran and their beautiful meanings.',
  },
];

/**
 * Renders a single article card within the slider.
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

  return (
    <a
      href={href}
      className="group snap-start shrink-0 min-w-[280px] max-w-[300px] bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col"
      rel="noopener noreferrer"
    >
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
    </a>
  );
};

const ArticlesSlider = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  /** Evaluate whether the left/right arrows should be visible. */
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tolerance = 2;
    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance);
  }, []);

  /** Scroll the container by a given signed pixel offset. */
  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * SCROLL_STEP_PX, behavior: 'smooth' });
  }, []);

  /* Listen for manual scrolls to keep arrow visibility in sync. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  /* Auto-scroll interval, paused on hover. */
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: SCROLL_STEP_PX, behavior: 'smooth' });
      }
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isHovered]);

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

          <a
            href="/blog.html"
            className="group/link flex items-center gap-2 text-primary text-sm font-semibold shrink-0 hover:underline underline-offset-4"
          >
            View All Articles
            <ArrowRight
              size={16}
              className="translate-x-0 group-hover/link:translate-x-1 transition-transform duration-300"
            />
          </a>
        </div>

        {/* ── Slider controls + track ──────────────────── */}
        <div className="relative">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll articles left"
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border text-text-muted hover:text-primary hover:border-primary/50 flex items-center justify-center shadow-lg shadow-black/30 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll articles right"
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border text-text-muted hover:text-primary hover:border-primary/50 flex items-center justify-center shadow-lg shadow-black/30 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Scroll track */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 scrollbar-hide"
            role="region"
            aria-label="Articles carousel"
          >
            {ARTICLES.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSlider;
