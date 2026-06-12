import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, ChevronRight, Copy, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const HADITH_NAMES = [
  { name: 'Harith', arabic: 'حارث', meaning: 'Cultivator, one who plows, one who earns or strives.', desc: 'An indirect Quranic name derived from the H-R-TH root. Considered one of the truest names because its meaning matches reality — every human being is constantly cultivating, whether for this world or the next.' },
  { name: 'Hammam', arabic: 'همام', meaning: 'One who plans and intends with resolve; a person of bold action.', desc: 'Also translated as "a great man, a chief, a hero." Singled out by the Prophet ﷺ as one of the two most truthful names (alongside Harith).' }
];

const COURAGE_NAMES = [
  { name: 'Laith', arabic: 'ليث', meaning: 'Lion.', desc: 'A rare variant of Layth, symbolising bravery and fearlessness. While Asad is common, Laith remains highly distinctive.' },
  { name: 'Ayham', arabic: 'أهم', meaning: 'Brave, courageous, fearless.', desc: 'A rare modern-sounding choice with a smooth sound and a meaning aligning with resilience.' },
  { name: 'Miqdad', arabic: 'مقداد', meaning: 'Brave warrior.', desc: 'Carries historical weight from Al-Miqdad ibn Amr, one of the earliest companions renowned for courage at the Battle of Badr.' },
  { name: 'Qudamah', arabic: 'قدامة', meaning: 'Courage, boldness, the act of stepping forward.', desc: 'Relates to "stepping ahead of others" — meaning "the one who goes first".' },
  { name: 'Baraa', arabic: 'براء', meaning: 'Innocent, free, clear, pure.', desc: 'Named after Al-Bara ibn Malik, a legendary warrior whose prayers for victory were immediately answered.' }
];

const WISDOM_NAMES = [
  { name: 'Aarif', arabic: 'عارف', meaning: 'Knowledgeable, wise, one who possesses deep inner understanding.', desc: 'In Islamic spiritual tradition, refers to someone with deep, experiential knowledge of Allah.' },
  { name: 'Rashid', arabic: 'راشد', meaning: 'Rightly guided, mature in faith, possessing sound judgment.', desc: 'The root behind "Khulafa-e-Rashidun" — the title given to the first four rightly-guided Caliphs.' },
  { name: 'Sami', arabic: 'سامي', meaning: 'Elevated, exalted, high in rank.', desc: 'A quiet, elegant name carrying aspirations of dignity and high character.' },
  { name: 'Akram', arabic: 'أكرم', meaning: 'Most generous, most noble.', desc: 'Superlative form of Karim, carrying an even stronger virtuous meaning.' },
  { name: 'Mahir', arabic: 'ماهر', meaning: 'Skilled, talented, proficient.', desc: 'A clean, modern-sounding name that is professional and ages very well.' },
  { name: 'Hadi', arabic: 'هادي', meaning: 'Guide, one who leads to the right path.', desc: 'Derived from one of Allah\'s attributes (Al-Hadi), reflecting guidance toward goodness.' }
];

const NATURE_NAMES = [
  { name: 'Zahran', arabic: 'زهران', meaning: 'Radiant, shining, glowing.', desc: 'Masculine form sharing a root with Zahra (radiant flower), yet far less common.' },
  { name: 'Zameer', arabic: 'ضمير', meaning: 'Conscience, the inner heart, one\'s innermost self.', desc: 'Directly describes a moral compass and inner accountability.' },
  { name: 'Burd', arabic: 'برد', meaning: 'Coolness, calm, a soothing presence.', desc: 'Historically associated with relief, relief, and comfort in hot desert climates.' },
  { name: 'Mazin', arabic: 'مازن', meaning: 'Soft rain clouds.', desc: 'Rain clouds historically symbolize mercy, abundance, and life arriving after a dry spell.' },
  { name: 'Zayan', arabic: 'زيّان', meaning: 'Graceful, beautiful, adorned.', desc: 'Doubled variant of Zain/Zayn, giving it a distinct, less common sound.' }
];

const HISTORICAL_NAMES = [
  { name: 'Qasim', arabic: 'قاسم', meaning: 'One who distributes, one who shares; generous.', desc: 'The name of the Prophet Muhammad\'s ﷺ firstborn son, carrying deep historical significance.' },
  { name: 'Tameem', arabic: 'تميم', meaning: 'Complete, perfect, whole; strong.', desc: 'Evokes completeness of character and is historically tied to the Banu Tamim tribe.' },
  { name: 'Naadir', arabic: 'نادر', meaning: 'Rare, precious, exceptional.', desc: 'Literally means "rare" — a name that describes its own unique rarity.' },
  { name: 'Yazan', arabic: 'يزن', meaning: 'An ancient Arabic name historically linked to leadership and strength.', desc: 'Linked to the legendary pre-Islamic Himyarite ruler Sayf ibn Dhi Yazan.' },
  { name: 'Zaeem', arabic: 'زعيم', meaning: 'Leader, chief, one who takes responsibility.', desc: 'A direct name signaling leadership qualities and accountability.' },
  { name: 'Iskander', arabic: 'إسكندر', meaning: 'Helper of mankind.', desc: 'The Arabic form of Alexander, connected to the righteous ruler Dhul-Qarnayn.' }
];

const NameCategorySection = ({ title, id, names }) => (
  <section id={id} className="space-y-4 pt-4">
    <h3 className="text-lg md:text-xl font-black text-text border-b border-border pb-2 flex items-center gap-2">
      <Sparkles size={18} className="text-primary" /> {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {names.map((n) => (
        <div key={n.name} className="bg-card border border-border p-5 rounded-2xl space-y-3 shadow-sm hover:border-primary/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-base font-black text-text">{n.name}</span>
            <span className="font-arabic text-lg text-primary font-bold">{n.arabic}</span>
          </div>
          <p className="text-xs font-semibold text-accent leading-relaxed">
            Meaning: {n.meaning}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {n.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const RareBoyNamesArticle = () => {
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
      const sections = [
        'introduction',
        'hadith-pair',
        'courage-strength',
        'wisdom-guidance',
        'nature-light',
        'historical-modern',
        'how-to-choose',
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
    const text = 'Rare Islamic Boy Names with Deep, Powerful Meanings';
    
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
    { id: 'introduction', label: 'Introduction: Beyond the Common' },
    { id: 'hadith-pair', label: 'The Hadith Pair: Harith & Hammam' },
    { id: 'courage-strength', label: 'Names of Courage & Strength' },
    { id: 'wisdom-guidance', label: 'Names of Wisdom & Character' },
    { id: 'nature-light', label: 'Names from Nature & Light' },
    { id: 'historical-modern', label: 'Distinctive Historical & Modern Names' },
    { id: 'how-to-choose', label: 'How to Choose a Rare Name' },
    { id: 'faq', label: 'Frequently Asked Questions' },
    { id: 'conclusion', label: 'Final Thoughts' },
  ];

  return (
    <>
      <Helmet>
        <title>Rare Islamic Boy Names with Deep, Powerful Meanings — IslamicNames</title>
        <meta
          name="description"
          content="Explore authentic, rare Arabic boy names with deep meanings from Hadith, companion history, and early Islam. Find distinct names like Harith, Hammam, and Miqdad."
        />
        <meta name="keywords" content="rare islamic boy names, unique muslim boy names, Harith meaning, Hammam meaning, Miqdad meaning, Layth meaning, Arabic baby boy names" />
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
              Boy Names · Rare & Meaningful
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              Rare Islamic Boy Names with Deep, Powerful Meanings
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              Distinctive, strong Arabic boy names rarely seen in standard lists — with full meanings, Arabic script, origins, and their stories from Islamic history.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> May 22, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 4,100 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#2D4A6A] via-[#3B6487] to-[#4A7FA5] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            زـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            حارث & همام
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="introduction" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Introduction: Beyond the Common Names
              </h2>
              <p>
                If you've scrolled through dozens of "Top 50 Muslim Boy Names" lists and kept seeing the same handful of names — Ahmed, Ali, Omar, Yusuf — you're not alone. These names are beautiful, but they're also extremely common. For parents who want something distinctive, something that sparks a question at every introduction ("what does that mean?"), there's a whole world of authentic Arabic names that carry serious depth without sacrificing meaning or legitimacy.
              </p>
              <p>
                This list focuses on names that are genuinely rare — not invented, not trendy spellings of common names, but real Arabic words and historical names with roots in hadith, Quranic vocabulary, and early Islamic history.
              </p>
            </section>

            <section id="hadith-pair" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Hadith Pair: Harith & Hammam
              </h2>
              <p>
                If you want to start with the single most authoritative source on "powerful rare names," there's one hadith that names exactly two of them by name:
              </p>
              <div className="bg-card border border-border p-5 rounded-2xl italic text-text my-4 text-center">
                "Name yourselves with the names of the prophets. The most beloved names to Allah are Abdullah and Abdur Rahman. The most truthful of them is Harith, the harvester of good, and Hammam, the brave one. The worst names are names of war and bitterness."
              </div>
              <p>
                Despite being directly praised by the Prophet ﷺ as the "most truthful" names, they remain incredibly rare in modern Muslim communities. Let's look at their definitions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {HADITH_NAMES.map((n) => (
                  <div key={n.name} className="bg-primary/5 border border-primary/20 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-base font-black text-text">{n.name}</span>
                      <span className="font-arabic text-lg text-primary font-bold">{n.arabic}</span>
                    </div>
                    <p className="text-xs font-semibold text-accent">
                      Meaning: {n.meaning}
                    </p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <NameCategorySection 
              title="Names of Courage & Strength" 
              id="courage-strength" 
              names={COURAGE_NAMES} 
            />

            <NameCategorySection 
              title="Names of Wisdom, Guidance & Character" 
              id="wisdom-guidance" 
              names={WISDOM_NAMES} 
            />

            <NameCategorySection 
              title="Names from Nature, Light & Spirit" 
              id="nature-light" 
              names={NATURE_NAMES} 
            />

            <NameCategorySection 
              title="Distinctive Historical & Modern Rare Names" 
              id="historical-modern" 
              names={HISTORICAL_NAMES} 
            />

            <section id="how-to-choose" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                How to Choose a Rare Name Without It Feeling "Too Different"
              </h2>
              <p>
                Rare doesn't have to mean hard to say or hard to spell. A few guidelines to keep in mind when finalizing a choice:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-xs md:text-sm">
                <li>
                  <strong>Check pronunciation and spelling:</strong> Names with letters like ع (ayn), ح (heavy H), or ض (heavy D), like Zameer or Baraa, may need simplified spelling for non-Arabic speakers (e.g. Zamir or Bara).
                </li>
                <li>
                  <strong>Look at the root meaning:</strong> A simple english translation like "brave" or "leader" often hides a much richer story. Look at the Arabic root to find the deep scriptural connections.
                </li>
                <li>
                  <strong>Seek historical attachments:</strong> Names tied to prominent companions (such as Miqdad, Qasim, or Baraa) carry stories you can tell your child as they grow.
                </li>
                <li>
                  <strong>Rare is not "made up":</strong> All names on this list are verified, authentic Arabic words. Avoid choosing names with no linguistic root or historical basis purely for "uniqueness," as they can feel out of place.
                </li>
              </ul>
            </section>

            <section id="faq" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 divide-y divide-border/30">
                {[
                  {
                    q: "Why are Harith and Hammam so rarely used if they're praised in hadith?",
                    a: "There is no explicit historical reason, likely just naming fashion shifts over centuries favoring Prophet names or 'Abd-' names. Many scholars highlight this gap, encouraging parents to revive these direct, beautiful names."
                  },
                  {
                    q: "Is it okay to name my son after a companion known for being a warrior, like Miqdad or Baraa?",
                    a: "Yes. Naming after companions known for courage, piety, or strong character is widely encouraged. The intention is that the name becomes a living reminder of virtue and resolution."
                  },
                  {
                    q: "Are names like Iskander/Alexander considered 'Islamic' despite the Greek connection?",
                    a: "Yes. The Arabic form Iskander has been used by Muslims for centuries. It carries its own meaning ('helper of mankind') and is historically associated with Dhul-Qarnayn, the righteous ruler mentioned in Surah Al-Kahf."
                  },
                  {
                    q: "Will a rare name cause problems with pronunciation for my child growing up outside the Arab world?",
                    a: "Some of these names (Sami, Rashid, Akram, Laith) are phonetically simple and present no issues. Others like Zameer or Qudamah can be written with simplified transliterations, which is completely acceptable."
                  }
                ].map((item, idx) => (
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
                A rare name isn't about being different for its own sake — it's about giving your son a name with a story behind it, one that very few people his age will share, yet one that's rooted in the same authentic tradition as the most common Islamic names. Whether you choose Harith for its direct hadith endorsement, Miqdad for its battlefield courage, or Naadir simply because "rare" suits a name that means "rare" — each of these carries centuries of meaning into a single word.
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
                <Link to="/blog/50-beautiful-islamic-girl-names-starting-with-f" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">50 Beautiful Islamic Girl Names Starting with F</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 10, 2026</span>
                </Link>
                <Link to="/blog/top-30-quranic-names-for-baby-boys-in-2026" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Quranic</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Top 30 Quranic Names for Baby Boys in 2026</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 11, 2026</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Focus</span><span className="text-text font-bold">Rare Arabic Names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Hadith Endorsed</span><span className="text-text font-bold">Harith & Hammam</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Companion Names</span><span className="text-text font-bold">Miqdad & Baraa</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Nature-Inspired</span><span className="text-text font-bold">Mazin & Zahran</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium font-arabic">Root Letter</span><span className="text-text font-bold">زـ (Zaeen)</span></li>
              </ul>
            </div>

            {/* Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <Shield size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">✨ Key Sunnah Tip</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ said: <em className="text-text">"The most truthful names are Harith (harvester/striver) and Hammam (planner of action)."</em> These names emphasize active goodness.
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

export default RareBoyNamesArticle;
