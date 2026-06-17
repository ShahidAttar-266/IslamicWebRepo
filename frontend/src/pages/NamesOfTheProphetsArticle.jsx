import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, ChevronRight, Copy, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { PROPHETS_DATA } from '../utils/prophets-data';

const articleFaqs = [
  {
    q: "How many Prophets are mentioned in the Quran?",
    a: "The Quran mentions exactly 25 Prophets by name. Every Muslim is required to believe in all of them, as well as in the numerous unnamed Prophets sent to other nations throughout human history."
  },
  {
    q: "Is it recommended to name children after the Prophets?",
    a: "Yes, the Prophet Muhammad ﷺ strongly recommended it, stating: 'Name yourselves with the names of the Prophets.' It helps connect the child's identity to these exemplary figures of faith, patience, and leadership."
  },
  {
    q: "Who are the 'Ulul Azm' (Prophets of firm resolve)?",
    a: "They are the five greatest Prophets in Islam who faced the most severe trials and showed unbreakable resilience: Nuh (Noah), Ibrahim (Abraham), Musa (Moses), Isa (Jesus), and Muhammad ﷺ."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": articleFaqs.map(q => ({
    "@type": "Question",
    "name": q.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.a
    }
  }))
};

const NamesOfTheProphetsArticle = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTOC, setActiveTOC] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      const sections = [
        'introduction',
        'how-many',
        'prophets-list',
        'ulul-azm',
        'why-name',
        'faq',
        'conclusion'
      ];
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
    const text = 'Names of the Prophets in Islam — Meanings and Stories';
    
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
    { id: 'introduction', label: 'Introduction: A Call to Faith' },
    { id: 'how-many', label: 'How Many Prophets Were There?' },
    { id: 'prophets-list', label: 'The 25 Prophets in the Quran' },
    { id: 'ulul-azm', label: 'The Five Ulul Azm' },
    { id: 'why-name', label: 'Why Name Your Child After a Prophet?' },
    { id: 'faq', label: 'Frequently Asked Questions' },
    { id: 'conclusion', label: 'Final Thoughts' },
  ];

  return (
    <>
      <Helmet>
        <title>Names of the Prophets in Islam — Meanings and Stories — IslamicNames</title>
        <meta name="description" content="Explore the names of all 25 Prophets named in the Quran, including their Arabic spelling, etymology, origins, and their stories of faith and patience in Islam." />
        <meta name="keywords" content="names of prophets in islam, islamic prophet names, 25 prophets in quran, prophet names meanings, Ulul Azm prophets, arabic boy names" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.islamicnames.in/blog/names-of-the-prophets-in-islam" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.islamicnames.in/blog/names-of-the-prophets-in-islam" />
        <meta property="og:title" content="Names of the Prophets in Islam — Meanings and Stories — IslamicNames" />
        <meta property="og:description" content="Explore the names of all 25 Prophets named in the Quran, including their Arabic spelling, etymology, origins, and their stories of faith and patience in Islam." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/blog/names-of-the-prophets-in-islam" />
        <meta name="twitter:title" content="Names of the Prophets in Islam — Meanings and Stories — IslamicNames" />
        <meta name="twitter:description" content="Explore the names of all 25 Prophets named in the Quran, including their Arabic spelling, etymology, origins, and their stories of faith and patience in Islam." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* JSON-LD Article Structured Data */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Names of the Prophets in Islam — Meanings and Stories — IslamicNames",
  "description": "Explore the names of all 25 Prophets named in the Quran, including their Arabic spelling, etymology, origins, and their stories of faith and patience in Islam.",
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
    "@id": "https://www.islamicnames.in/blog/names-of-the-prophets-in-islam"
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
              { "@type": "ListItem", "position": 3, "name": "Names of the Prophets in Islam", "item": "https://www.islamicnames.in/blog/names-of-the-prophets-in-islam" }
            ]
          })}
        </script>

        {/* JSON-LD FAQ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
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
              Prophetic Names · Meanings & Stories
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              Names of the Prophets in Islam — Meanings and Stories
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              From Adam to Muhammad ﷺ — explore the meanings, etymologies, and inspiring stories of the 25 Prophets mentioned by name in the Holy Quran.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> April 28, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 8 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 5,200 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#1A3A1A] via-[#245224] to-[#2D6A2D] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            يـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none text-center px-4">
            الأنبياء والرسل
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="introduction" className="space-y-4">
              <p>
                Among the most beloved and recommended names a Muslim parent can give their child are the names of the Prophets of Allah. These are not simply historical names — they are names that carry within them entire stories of faith, patience, courage, and complete trust in Allah. Every Prophet whose name has reached us through the Quran and authentic Sunnah lived a life worth remembering, and every name carries a meaning worth understanding.
              </p>
              <div className="bg-card border border-border p-5 rounded-2xl italic text-text my-4 text-center">
                The Prophet Muhammad ﷺ said: <span className="font-bold">"Name yourselves with the names of the Prophets."</span> (Abu Dawud)
              </div>
              <p>
                This guidance is not a command but a strong recommendation — an invitation to connect your child's identity to the greatest human beings who ever walked the earth. This article explores the names of the Prophets mentioned in the Quran, their meanings, and something of their remarkable stories.
              </p>
            </section>

            <section id="how-many" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                How Many Prophets Were There?
              </h2>
              <p>
                Islamic tradition holds that Allah sent a very large number of Prophets and Messengers to humanity throughout history. A commonly referenced hadith states there were 124,000 Prophets in total, though this specific narration is considered weak by many hadith scholars. What is established is that Allah sent guidance to every nation and people.
              </p>
              <p>
                The Quran mentions 25 Prophets by name. These are the ones we know with certainty from divine revelation. Every Muslim is required to believe in all the Prophets of Allah — those named and those unnamed. The Quran says:
              </p>
              <div className="bg-card border border-border p-5 rounded-2xl italic text-text my-4 text-center">
                "And We have already sent messengers before you. Among them are those We have related to you, and among them are those We have not related to you." (Surah Ghafir 40:78)
              </div>
              <p>
                The 25 Prophets named in the Quran are the focus of this article.
              </p>
            </section>

            <section id="prophets-list" className="space-y-6">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The 25 Prophets Named in the Quran — Their Names, Meanings, and Stories
              </h2>
              
              <div className="space-y-8 mt-6">
                {PROPHETS_DATA.map((p) => (
                  <div key={p.num} className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm hover:border-primary/50 transition-all">
                    <div className="flex justify-between items-center border-b border-border/40 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                          {p.num}
                        </span>
                        <h3 className="text-lg font-black text-text">{p.name}</h3>
                      </div>
                      <span className="font-arabic text-2xl text-primary font-bold">{p.arabic}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm font-semibold bg-bg/50 p-3 rounded-xl">
                      <p className="text-text">
                        <span className="text-text-muted font-normal mr-1">Meaning:</span> {p.meaning}
                      </p>
                      <p className="text-text">
                        <span className="text-text-muted font-normal mr-1">Origin:</span> {p.origin}
                      </p>
                    </div>

                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                      {p.story}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="ulul-azm" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Five Ulul Azm — Prophets of Firm Resolve
              </h2>
              <p>
                Among the 25 Prophets, five are given a special distinction in the Quran as Ulul Azm — Prophets of firm resolve, extraordinary patience, and the greatest missions. They are:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-xs md:text-sm">
                <li>
                  <strong>Nuh (AS)</strong> — who preached for 950 years and endured rejection from his own family.
                </li>
                <li>
                  <strong>Ibrahim (AS)</strong> — who was thrown into fire, commanded to sacrifice his son, and rebuilt the Kaaba — passing every test with complete submission.
                </li>
                <li>
                  <strong>Musa (AS)</strong> — who confronted the greatest tyrannical power of his time and led an entire people to freedom.
                </li>
                <li>
                  <strong>Isa (AS)</strong> — who was sent to a people who plotted against him, yet maintained his message of pure monotheism.
                </li>
                <li>
                  <strong>Muhammad ﷺ</strong> — who endured exile, boycott, the deaths of his loved ones, and relentless opposition — and yet transformed the world.
                </li>
              </ul>
            </section>

            <section id="why-name" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Why Name Your Child After a Prophet?
              </h2>
              <p>
                There is a specific spiritual wisdom behind the recommendation to name children after the Prophets. Every time a name is called, it is a reminder — to the child and to those around them — of the person who bore that name. A child named Yusuf is reminded daily of patience and integrity. A child named Ibrahim carries the name of the great friend of Allah. A child named Muhammad is reminded of the best of creation.
              </p>
              <p>
                Names shape identity. The Prophets lived lives worth emulating, and their names carry stories worth knowing. When your child learns the meaning and history of their name, they gain not just a biography but a blueprint for how to live.
              </p>
            </section>

            <section id="faq" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 divide-y divide-border/30">
                {articleFaqs.map((item, idx) => (
                  <div key={idx} className={`${idx > 0 ? 'pt-4' : ''} space-y-2`}>
                    <h4 className="text-sm font-bold text-text flex items-start gap-2">
                      <span className="text-accent">Q:</span> {item.q}
                    </h4>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed pl-6">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="conclusion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Final Thoughts
              </h2>
              <p>
                The names of the Prophets are among the greatest gifts of the Islamic naming tradition. They are names rooted in revelation, in history, in tested faith, and in the mercy of Allah. From Adam at the beginning of human time to Muhammad ﷺ at the completion of divine guidance, every Prophet carried a name worth honouring.
              </p>
              <p>
                If you are choosing a name for your child, the names of the Prophets represent the highest recommendation in Islamic tradition — names of meaning, dignity, and divine connection that your child will carry proudly throughout their life.
              </p>
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
                <Link to="/blog/top-30-quranic-names-for-baby-boys-in-2026" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Quranic</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Top 30 Quranic Names for Baby Boys in 2026</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 11, 2026</span>
                </Link>
                <Link to="/blog/rare-islamic-boy-names-with-deep-meanings" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E3EEF9] text-[#1A4F8A] inline-block">Boy Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Rare Islamic Boy Names with Deep, Powerful Meanings</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 22, 2026</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Named in Quran</span><span className="text-text font-bold">25 Prophets</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Ulul Azm</span><span className="text-text font-bold">5 Prophets</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Sunnah Recommended</span><span className="text-text font-bold">Yes</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium font-arabic">Root Letter</span><span className="text-text font-bold">يـ (Yaa)</span></li>
              </ul>
            </div>

            {/* Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <Shield size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">✨ Sunnah Recommendation</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet Muhammad ﷺ said: <em className="text-text">"Name yourselves with the names of the Prophets."</em> This links our children's identity directly to these blessed leaders of humanity.
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

export default NamesOfTheProphetsArticle;

