import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const NAMES_1_15 = [
  { num: 1, name: 'Adam', badge: 'Prophet', arabic: 'آدم', meaning: 'The first human created by Allah; from earth or soil. Mentioned 25 times in the Quran, representing new beginnings and Allah\'s special creation.', origin: 'Arabic' },
  { num: 2, name: 'Nuh', badge: 'Prophet', arabic: 'نوح', meaning: 'Rest, comfort, tranquility. Remembered as the Prophet who showed immense patience. Surah 71 bears his name.', origin: 'Arabic' },
  { num: 3, name: 'Ibrahim', badge: 'Prophet', arabic: 'إبراهيم', meaning: 'Father of many nations. Khalilullah — the Friend of Allah — mentioned 69 times in the Quran.', origin: 'Arabic' },
  { num: 4, name: 'Ismail', badge: 'Prophet', arabic: 'إسماعيل', meaning: 'God hears; Allah listens. Commemorated during Eid Al-Adha for his story of obedience and sacrifice.', origin: 'Arabic' },
  { num: 5, name: 'Ishaq', badge: 'Prophet', arabic: 'إسحاق', meaning: 'He laughs; laughter and joy. His birth was announced by angels to Ibrahim in old age as a miraculous blessing.', origin: 'Arabic' },
  { num: 6, name: 'Yaqub', badge: 'Prophet', arabic: 'يعقوب', meaning: 'He who follows. Father of Yusuf and a Prophet of great patience.', origin: 'Arabic' },
  { num: 7, name: 'Yusuf', badge: 'Prophet', arabic: 'يوسف', meaning: 'Allah will increase. Surah Yusuf is dedicated to his story, called "the most beautiful of stories."', origin: 'Arabic' },
  { num: 8, name: 'Musa', badge: 'Prophet', arabic: 'موسى', meaning: 'Drawn from the water; saved from the river. Mentioned 136 times in the Quran, reflecting courage and determination.', origin: 'Arabic' },
  { num: 9, name: 'Harun', badge: 'Prophet', arabic: 'هارون', meaning: 'Lofty mountain; exalted. Brother and companion of Musa, representing loyalty, brotherhood, and support.', origin: 'Arabic' },
  { num: 10, name: 'Dawood', badge: 'Prophet', arabic: 'داوود', meaning: 'Beloved; dear one. Prophet and king gifted with a beautiful voice, recipient of the Zabur (Psalms).', origin: 'Arabic' },
  { num: 11, name: 'Sulaiman', badge: 'Prophet', arabic: 'سليمان', meaning: 'Man of peace. Granted command over humans, jinn, and animals; synonymous with wisdom.', origin: 'Arabic' },
  { num: 12, name: 'Yunus', badge: 'Prophet', arabic: 'يونس', meaning: 'Dove; gentle. Recited the famous du\'a of repentance from inside the whale, symbolising hope and faith.', origin: 'Arabic' },
  { num: 13, name: 'Zakariyah', badge: 'Prophet', arabic: 'زكريا', meaning: 'Allah has remembered. Answered with the miracle birth of Yahya, representing hope and prayer.', origin: 'Arabic' },
  { num: 14, name: 'Yahya', badge: 'Prophet', arabic: 'يحيى', meaning: 'He who lives; full of life. Named directly by Allah before birth, a name with no prior parallel.', origin: 'Arabic' },
  { num: 15, name: 'Isa', badge: 'Prophet', arabic: 'عيسى', meaning: 'Allah saves. Known for compassion and miracles, symbolising mercy, resolve, and inner strength.', origin: 'Arabic' }
];

const NAMES_16_30 = [
  { num: 16, name: 'Muhammad', badge: 'Prophet', arabic: 'محمد', meaning: 'The praised one; highly commended. Final Prophet ﷺ. Naming a son Muhammad is considered one of the greatest honours.', origin: 'Arabic' },
  { num: 17, name: 'Ahmad', badge: 'Prophet', arabic: 'أحمد', meaning: 'Most praiseworthy. One of the Prophet\'s own names, foretold by Prophet Isa in Surah As-Saf.', origin: 'Arabic' },
  { num: 18, name: 'Hud', badge: 'Prophet', arabic: 'هود', meaning: 'Guidance; one who guides. Sent to the people of Aad; known for eloquence and steadfastness.', origin: 'Arabic' },
  { num: 19, name: 'Salih', badge: 'Prophet', arabic: 'صالح', meaning: 'Righteous; virtuous; pious. Sent to the people of Thamud; one of the purest names in meaning.', origin: 'Arabic' },
  { num: 20, name: 'Luqman', badge: 'Wise Man', arabic: 'لقمان', meaning: 'Wise; deep reflection. A wise man whose counsel to his son is recorded in Surah Luqman.', origin: 'Arabic' },
  { num: 21, name: 'Idris', badge: 'Prophet', arabic: 'إدريس', meaning: 'Interpreter; teacher. First to write; symbol of knowledge and dedication to learning.', origin: 'Arabic' },
  { num: 22, name: 'Ilyas', badge: 'Prophet', arabic: 'إلياس', meaning: 'Allah is my God. Sent to his people when they turned to idol worship; represents courage.', origin: 'Arabic' },
  { num: 23, name: 'Ayyub', badge: 'Prophet', arabic: 'أيوب', meaning: 'Returning to Allah; penitent. The ultimate symbol of patience (sabr) during hardship.', origin: 'Arabic' },
  { num: 24, name: 'Shuaib', badge: 'Prophet', arabic: 'شعيب', meaning: 'One who shows the right path. Known as "the preacher of the Prophets" for his eloquence.', origin: 'Arabic' },
  { num: 25, name: 'Zaid', badge: 'Companion', arabic: 'زيد', meaning: 'Growth, increase, abundance. Zaid ibn Harithah is the only companion of the Prophet ﷺ mentioned by name in the Quran.', origin: 'Arabic' },
  { num: 26, name: 'Jibreel', badge: 'Angel', arabic: 'جبريل', meaning: 'Strength of Allah; servant of Allah. The Archangel who brought divine revelations.', origin: 'Arabic' },
  { num: 27, name: 'Mikail', badge: 'Angel', arabic: 'ميكائيل', meaning: 'Who is like God. The Archangel responsible for rain and sustenance; represents care.', origin: 'Arabic' },
  { num: 28, name: 'Imran', badge: 'Honoured', arabic: 'عمران', meaning: 'Prosperity; long life. Father of Maryam (Mary), representing a chosen, blessed family.', origin: 'Arabic' },
  { num: 29, name: 'Taha', badge: 'Letters', arabic: 'طه', meaning: 'Letters from the Quran\'s opening (Muqatta\'at). One of the blessed names of Prophet Muhammad ﷺ.', origin: 'Arabic' },
  { num: 30, name: 'Yasin', badge: 'Letters', arabic: 'ياسين', meaning: 'Letters from the Quran\'s opening (Muqatta\'at). Another honoured name of Prophet Muhammad ﷺ.', origin: 'Arabic' }
];

const TableOfNames = ({ data }) => (
  <div className="overflow-x-auto border border-border rounded-xl bg-card/50 my-6">
    <table className="w-full min-w-[650px] text-left text-sm border-collapse">
      <thead>
        <tr className="bg-card border-b border-border/80">
          <th className="py-3.5 px-4 font-bold text-accent text-xs uppercase w-12 text-center">#</th>
          <th className="py-3.5 px-4 font-bold text-text text-sm">Name</th>
          <th className="py-3.5 px-4 font-bold text-text text-sm text-right font-arabic">Arabic</th>
          <th className="py-3.5 px-4 font-bold text-text-muted text-sm">Meaning</th>
          <th className="py-3.5 px-4 font-bold text-text-muted text-sm w-32">Origin</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/30">
        {data.map((row) => (
          <tr key={row.num} className="hover:bg-primary/5 transition-colors">
            <td className="py-4 px-4 text-center text-text-muted font-bold text-xs">{row.num}</td>
            <td className="py-4 px-4 font-bold text-text">
              <span className="flex items-center gap-1.5 flex-wrap">
                {row.name}
                {row.badge && (
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    row.badge === 'Prophet' 
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}>
                    {row.badge}
                  </span>
                )}
              </span>
            </td>
            <td className="py-4 px-4 font-arabic text-lg text-right text-text/90 font-medium">{row.arabic}</td>
            <td className="py-4 px-4 text-text-muted text-xs md:text-sm leading-relaxed">{row.meaning}</td>
            <td className="py-4 px-4 text-text-muted text-xs">{row.origin}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BoyQuranicNamesArticle = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTOC, setActiveTOC] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Update reading progress bar
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Update active Table of Contents link
      const sections = ['introduction', 'why-quranic', 'names-1-15', 'names-16-30', 'naming-tips', 'conclusion'];
      let currentSection = '';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 120;
          if (scrollTop >= top) {
            currentSection = sectionId;
          }
        }
      }
      setActiveTOC(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = 'Discover the Top 30 Quranic Names for Baby Boys in 2026 — with full meanings and script.';
    
    const shareUrls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      });
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const tocItems = [
    { id: 'introduction', label: 'Introduction: The Gift of Naming' },
    { id: 'why-quranic', label: 'Why Quranic Names Carry Blessing' },
    { id: 'names-1-15', label: 'Names 1–15' },
    { id: 'names-16-30', label: 'Names 16–30' },
    { id: 'naming-tips', label: 'Guidelines for Using the List' },
    { id: 'conclusion', label: 'Conclusion & Prayer' },
  ];

  return (
    <>
      <Helmet>
        <title>Top 30 Quranic Names for Baby Boys in 2026 — IslamicNames</title>
        <meta name="description" content="Discover the top 30 direct Quranic names for baby boys in 2026. Explore names of Prophets, companions, and angels with meanings, Arabic script, and verse references." />
        <meta name="keywords" content="Quranic boy names 2026, Islamic baby boy names, names of prophets in Quran, Muhammad meaning, Yusuf meaning, Arabic boy names" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.islamicnames.in/blog/top-30-quranic-names-for-baby-boys-in-2026" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.islamicnames.in/blog/top-30-quranic-names-for-baby-boys-in-2026" />
        <meta property="og:title" content="Top 30 Quranic Names for Baby Boys in 2026 — IslamicNames" />
        <meta property="og:description" content="Discover the top 30 direct Quranic names for baby boys in 2026. Explore names of Prophets, companions, and angels with meanings, Arabic script, and verse references." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/blog/top-30-quranic-names-for-baby-boys-in-2026" />
        <meta name="twitter:title" content="Top 30 Quranic Names for Baby Boys in 2026 — IslamicNames" />
        <meta name="twitter:description" content="Discover the top 30 direct Quranic names for baby boys in 2026. Explore names of Prophets, companions, and angels with meanings, Arabic script, and verse references." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* JSON-LD Article Structured Data */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Top 30 Quranic Names for Baby Boys in 2026 — IslamicNames",
  "description": "Discover the top 30 direct Quranic names for baby boys in 2026. Explore names of Prophets, companions, and angels with meanings, Arabic script, and verse references.",
  "image": "https://www.islamicnames.in/og-image.png",
  "author": {
    "@type": "Organization",
    "name": "IslamicNames Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "IslamicNames",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.islamicnames.in/logo-120.webp"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.islamicnames.in/blog/top-30-quranic-names-for-baby-boys-in-2026"
  }
}`}
        </script>

        {/* JSON-LD Breadcrumb Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.islamicnames.in/blog" },
              { "@type": "ListItem", "position": 3, "name": "Top 30 Quranic Names for Baby Boys in 2026", "item": "https://www.islamicnames.in/blog/top-30-quranic-names-for-baby-boys-in-2026" }
            ]
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-[60] transition-all duration-100 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="space-y-8">
        
        {/* Breadcrumb & Meta */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-primary transition-colors">Articles</Link>
            <ChevronRight size={12} />
            <span className="text-text">Boy Names</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Boy Names · Quranic
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              Top 30 Quranic Names for Baby Boys in 2026
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              Authentic, beautiful direct Quranic names for your son — from Muhammad to Yusuf, compiled with complete meanings, Arabic script, and verse references.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> June 11, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 7 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 9,800 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#1A4F8A] via-[#2E6DB4] to-[#4A7FA5] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            قـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            يوسف & محمد
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="introduction" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Introduction: The Gift of Naming
              </h2>
              <p>
                Choosing a name for your son is one of the most blessed acts a parent can perform. In Islam, a name is not just a label — it is an identity, a prayer, and a legacy. The Prophet Muhammad ﷺ said: <em>"You will be called on the Day of Resurrection by your names and your fathers' names, so give yourselves good names."</em> (Abu Dawud, 4948).
              </p>
              <p>
                There is an important distinction to understand before diving in: <strong>"direct"</strong> Quranic names are words or names plainly mentioned in the Quran itself, such as Musa and Yusuf. <strong>"Indirect"</strong> Quranic names are derived from Arabic roots that appear in the Quran, even if the exact name form does not appear. This list focuses primarily on direct Quranic names — the most authentic and spiritually grounded choices for your son.
              </p>
            </section>

            <section id="why-quranic" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Why Quranic Names Carry Extra Blessing
              </h2>
              <p>
                Beyond standard recommendations, names taken directly from the Quran connect a child to the sacred text from birth. Every time his name is called, it echoes a word that Allah chose to preserve forever in His final revelation.
              </p>
              <p>
                According to the Quran, there are 25 Prophets mentioned by name. Among them are Adam, Idris, Nuh, Ibrahim, Ismail, Ishaq, Yaqub, Yusuf, Musa, Haroon, Dawood, Sulaiman, Ilyas, Luqman, Yunus, Zakariyah, Yahya, Isa, and Muhammad. Choosing a name for your son based on any of these Prophets means giving him an identity built upon patience, strength, faith, and devotion.
              </p>
            </section>

            <section id="names-1-15" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Top Quranic Names 1–15
              </h2>
              <p>
                Below is the first part of our curated list of direct Quranic names for baby boys, detailing their meanings, Arabic script, and theological significance.
              </p>
              <TableOfNames data={NAMES_1_15} />
            </section>

            <section id="names-16-30" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Top Quranic Names 16–30
              </h2>
              <p>
                Below is the second half of our direct Quranic boy names list, featuring names representing virtue, strength, and divine guidance.
              </p>
              <TableOfNames data={NAMES_16_30} />
            </section>

            <section id="naming-tips" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Guidelines for Using the List
              </h2>
              <p>
                When finalising a name, check three things: the meaning is good, the name is easy to pronounce in your country and community, and — ideally — the name appears directly in the Quran or is derived from a Quranic root. All 30 names above pass every one of these criteria.
              </p>
              <div className="bg-gradient-to-r from-card to-primary/5 border border-border p-5 rounded-2xl text-sm leading-relaxed space-y-2">
                <span className="text-primary font-black block">💡 Authenticity Tip:</span>
                <p>
                  Many names sold online as "Quranic" are actually from hadith literature or classical Arabic poetry, not the Quran itself. The names in this list are verified direct Quranic names — a distinction that matters for parents who want the highest level of scriptural authenticity in their choice.
                </p>
              </div>
            </section>

            <section id="conclusion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Conclusion & Prayer
              </h2>
              <p>
                May Allah bless every child named from His Book with a life of faith, knowledge, and goodness. May your child grow to reflect the noble attributes associated with their Quranic namesake.
              </p>
              
              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl italic text-text my-6 space-y-2">
                <p className="text-sm md:text-base">"Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous."</p>
                <span className="block text-right text-xs font-bold text-primary">— Surah Al-Furqan 25:74</span>
              </div>
            </section>

            {/* Share Bar */}
            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <span className="text-sm font-bold text-text flex items-center gap-1.5"><Share2 size={16} /> Share this article:</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  WhatsApp
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  Facebook
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="px-4 py-2 bg-bg hover:bg-border text-text border border-border rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Author Box */}
            <div className="bg-card/40 border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                IN
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-sm font-black text-text">IslamicNames.in Editorial Team</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Our team of researchers and scholars curates authentic Islamic name content with verified meanings, Arabic script, and Quranic references. We are dedicated to helping Muslim families around the world choose beautiful, meaningful names for their children.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-4 mt-8">
              <h3 className="text-base font-black text-text border-b border-border pb-2">
                You May Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/blog/how-to-choose-an-islamic-name" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Tips</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">How to Choose an Islamic Name — Complete Guide for Parents</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 3, 2026</span>
                </Link>
                <Link to="/blog" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">50 Beautiful Islamic Girl Names Starting with F</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 10, 2026</span>
                </Link>
                <Link to="/blog" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Quranic</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Names Meaning Light in the Quran — Noor, Zia, and More</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 15, 2026</span>
                </Link>
              </div>
            </div>

          </article>

          {/* Right Column: Sidebar */}
          <aside className="flex flex-col gap-6">

            {/* Quick Facts Widget */}
            <div className="order-2 lg:order-1 bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent border-b border-border pb-3 mb-4">
                📊 Quick Facts
              </h3>
              <ul className="divide-y divide-border/40 text-xs">
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Total Names</span><span className="text-text font-bold">30</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Category</span><span className="text-text font-bold">Boy Names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Thematic focus</span><span className="text-text font-bold">Direct Quranic</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Quranic Prophets</span><span className="text-text font-bold">25 Prophets</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium font-arabic">Arabic Script</span><span className="text-text font-bold">Included</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Most Popular</span><span className="text-text font-bold">Muhammad</span></li>
              </ul>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Naming Hadith</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet Muhammad ﷺ said: <em className="text-text">"Name yourselves with the names of the Prophets."</em> (Abu Dawud). Direct Quranic names tie your child's destiny to the teachings and blessings of these holy figures.
              </p>
            </div>
            
            {/* Table of Contents Widget */}
            <div className="order-1 lg:order-3 bg-card border border-border rounded-2xl p-6 lg:sticky lg:top-36 shadow-md">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent border-b border-border pb-3 mb-4 flex items-center gap-1.5">
                📑 Table of Contents
              </h3>
              <ul className="space-y-2.5">
                {tocItems.map((item, idx) => (
                  <li key={item.id} className="text-xs font-medium">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) {
                          window.scrollTo({
                            top: el.offsetTop - 140,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`hover:text-primary transition-colors flex items-start gap-2 py-0.5 ${
                        activeTOC === item.id ? 'text-accent font-bold' : 'text-text-muted'
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${activeTOC === item.id ? 'text-accent' : 'text-text-muted/65'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 leading-snug">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </aside>

        </div>
      </div>
    </>
  );
};

export default BoyQuranicNamesArticle;
