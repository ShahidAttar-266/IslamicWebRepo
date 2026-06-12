import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const FAMILIAR_NAMES = [
  { num: 1, name: 'Layla', badge: 'Popular', arabic: 'ليلى', meaning: 'Night, or "dark beauty." Several female companions of the Prophet ﷺ were named Layla.', origin: 'Arabic' },
  { num: 2, name: 'Aaliyah', badge: 'Classic', arabic: 'عالية', meaning: 'Exalted, noble, the highest status or rank.', origin: 'Arabic' },
  { num: 3, name: 'Sara / Sarah', badge: 'Global', arabic: 'سارة', meaning: 'Princess, or "she who is pure." Carrying the legacy of Sarah, the wife of Prophet Ibrahim (AS).', origin: 'Arabic / Hebrew' },
  { num: 4, name: 'Yasmin', badge: 'Flower', arabic: 'ياسمين', meaning: 'Jasmine flower. Symbolizes fragrance, beauty, and grace.', origin: 'Arabic / Persian' },
  { num: 5, name: 'Salma', badge: 'Peace', arabic: 'سلمى', meaning: 'Peace, safety. Derived from the root word "Salam" (peace).', origin: 'Arabic' },
  { num: 6, name: 'Zara', badge: 'Radiant', arabic: 'زهراء / زارا', meaning: 'Princess, or radiant flower. Often linked to the name Zahra.', origin: 'Arabic' },
  { num: 7, name: 'Iman', badge: 'Faith', arabic: 'إيمان', meaning: 'Faith, belief. Represents one of the core concepts of the Islamic faith.', origin: 'Arabic' }
];

const TRENDING_NAMES = [
  { num: 8, name: 'Noor', badge: 'Quranic', arabic: 'نور', meaning: 'Light, radiance, illumination. Rich with Quranic symbolism.', origin: 'Arabic' },
  { num: 9, name: 'Lina', badge: 'Tender', arabic: 'لينا', meaning: 'Tender, soft, delicate. Refers to a palm tree or soft soil.', origin: 'Arabic' },
  { num: 10, name: 'Hira', badge: 'Historic', arabic: 'هيرة', meaning: 'Diamond; also associated with the Cave of Hira, where the first Quranic revelation was received.', origin: 'Arabic' },
  { num: 11, name: 'Dua', badge: 'Spiritual', arabic: 'دعاء', meaning: 'Prayer, supplication, calling upon Allah.', origin: 'Arabic' },
  { num: 12, name: 'Zoya', badge: 'Alive', arabic: 'زویا', meaning: 'Alive, loving, caring, full of life.', origin: 'Persian / Arabic' },
  { num: 13, name: 'Haya', badge: 'Virtue', arabic: 'حياء', meaning: 'Modesty, shyness, decency, life.', origin: 'Arabic' }
];

const POWERFUL_NAMES = [
  { num: 14, name: 'Amira', badge: 'Leader', arabic: 'أميرة', meaning: 'Princess, leader, one who commands.', origin: 'Arabic' },
  { num: 15, name: 'Inaya', badge: 'Quranic', arabic: 'عناية', meaning: 'Care, concern, divine protection or help from Allah (Surah Al-Furqan 25:74).', origin: 'Arabic' },
  { num: 16, name: 'Sakina', badge: 'Quranic', arabic: 'سكينة', meaning: 'Tranquility, calm, peace of mind descended by Allah upon believers.', origin: 'Arabic' },
  { num: 17, name: 'Hafsa', badge: 'Historic', arabic: 'حفصة', meaning: 'Young lioness; wife of the Prophet Muhammad ﷺ and daughter of Umar (RA).', origin: 'Arabic' },
  { num: 18, name: 'Faiza', badge: 'Successful', arabic: 'فائزة', meaning: 'Victorious, successful, winner.', origin: 'Arabic' },
  { num: 19, name: 'Zahra', badge: 'Radiant', arabic: 'زهراء', meaning: 'Radiant, shining flower. Famously used as a nickname for Fatima (RA).', origin: 'Arabic' }
];

const EDGE_NAMES = [
  { num: 20, name: 'Maryam', badge: 'Quranic', arabic: 'مريم', meaning: 'Beloved; Mary. The only woman named in her own right in the Quran.', origin: 'Arabic / Hebrew' },
  { num: 21, name: 'Asma', badge: 'Supreme', arabic: 'أسماء', meaning: 'Supreme, exalted, names. Daughter of Abu Bakr (RA) who aided the hijrah.', origin: 'Arabic' },
  { num: 22, name: 'Lulu', badge: 'Pearl', arabic: 'لولو', meaning: 'Pearl. Mentioned in the Quran representing precious beauty.', origin: 'Arabic' },
  { num: 23, name: 'Alaia', badge: 'Sublime', arabic: 'علياء', meaning: 'Sublime, high status, exalted, high-minded.', origin: 'Arabic' },
  { num: 24, name: 'Eshal', badge: 'Trending', arabic: 'إشال', meaning: 'Associated with "flower of Jannah" (Paradise).', origin: 'Arabic' }
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
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20`}>
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

const ModernArabicGirlNamesArticle = () => {
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
        'why-trend-growing',
        'familiar-west',
        'trending-short',
        'powerful-meanings',
        'spiritually-rooted',
        'how-to-pick',
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
    const text = 'Modern Arabic Girl Names That Sound Beautiful in English Too';
    
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
    { id: 'introduction', label: 'Introduction: The Crossover Trend' },
    { id: 'why-trend-growing', label: 'Why This Trend Is Growing' },
    { id: 'familiar-west', label: 'Names Already Familiar in the West' },
    { id: 'trending-short', label: 'Short, Soft & Trending for 2025–2026' },
    { id: 'powerful-meanings', label: 'Names with Powerful, Modern Meanings' },
    { id: 'spiritually-rooted', label: 'Spiritually Rooted Names' },
    { id: 'how-to-pick', label: 'How to Pick the Right One' },
    { id: 'faq', label: 'Frequently Asked Questions' },
    { id: 'conclusion', label: 'Final Thoughts' },
  ];

  return (
    <>
      <Helmet>
        <title>Modern Arabic Girl Names That Sound Beautiful in English Too — IslamicNames</title>
        <meta
          name="description"
          content="Find beautiful Arabic girl names that are easy to pronounce and spell in English. Explore crossover names like Layla, Sara, Zara, Inaya, and Noor with full meanings."
        />
        <meta name="keywords" content="modern Arabic girl names, English friendly Muslim names, crossover girl names, trending Islamic girl names 2026, Layla meaning, Inaya meaning" />
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
            <span className="text-text">Girl Names</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Girl Names · Modern Trends
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              Modern Arabic Girl Names That Sound Beautiful in English Too
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              Discover beautiful Arabic crossover names with rich Islamic meanings that roll off the tongue effortlessly in English-speaking countries.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> May 28, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 5 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 8,900 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#A0305A] via-[#D4607A] to-accent rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            مـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            مريم & ليلى
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="introduction" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Introduction: The Crossover Trend
              </h2>
              <p>
                One of the biggest challenges Muslim parents face today — especially those living in the UK, US, Canada, or raising children in English-medium schools — is finding a name that feels deeply Islamic at home, yet doesn't require constant spelling and pronunciation corrections at school, work, or the doctor's office.
              </p>
              <p>
                The good news: dozens of beautiful Arabic names already fit perfectly into English-speaking life, either because they're phonetically simple, or because they've already become familiar through pop culture, fashion, and global celebrities. Names of Arabic origin consistently rank high on annual baby name charts in countries like the US and UK, often chosen not just by Muslim families but by anyone looking for a name with rich cultural meaning.
              </p>
              <p>
                This guide rounds up the best of these "crossover" names — real Arabic names, with real Islamic meanings, that also roll off the tongue in English.
              </p>
            </section>

            <section id="why-trend-growing" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Why This Trend Is Growing
              </h2>
              <p>
                The naming trend for 2026 is moving away from long, complex traditional names toward what some call <strong>"phonetic gems"</strong> — names that are short and easy to pronounce globally, while still carrying deep Arabic or Persian roots. Parents increasingly want a name that works on a passport, a school register, and a family WhatsApp group without three different spellings circulating.
              </p>
              <p>
                There's also a softness theme running through recent naming trends. Many parents are gravitating toward names that evoke peace — like <strong>Sakina</strong> — or light and radiance — like <strong>Noor</strong>.
              </p>
            </section>

            <section id="familiar-west" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Names Already Familiar in the West
              </h2>
              <p>
                These names need almost no introduction — they're already part of the English-speaking naming landscape, often thanks to celebrities, music, or fashion, while remaining authentically Arabic and Islamically sound.
              </p>
              
              <TableOfNames data={FAMILIAR_NAMES} />

              <div className="space-y-3 mt-4 text-xs md:text-sm">
                <p>
                  <strong>Layla (ليلى)</strong> comes from the old Arabian tale of the poet Qays and Layla, retold by the 12th-century Persian poet Nizami Ganjavi. It became widely known in the West through Eric Clapton's 1970 song "Layla." Importantly for Muslim parents: several female companions of the Prophet ﷺ were named Layla, and he never asked them to change it — which scholars take as confirmation that the name is fully acceptable.
                </p>
                <p>
                  <strong>Aaliyah (عالية)</strong> has become popular in the US and UK not just among Muslim families, but among anyone drawn to a culturally rich, elegant-sounding name. The late singer Aaliyah brought global recognition to this name while it remained rooted in genuine Arabic meaning.
                </p>
                <p>
                  <strong>Sara / Sarah (سارة)</strong> is not only a hugely popular Muslim girls' name, it's also one of the most popular names across the entire world. It needs zero adjustment for English speakers and carries the legacy of Sarah, the wife of Prophet Ibrahim (AS).
                </p>
                <p>
                  <strong>Yasmin (ياسمين)</strong> refers to the jasmine flower, which holds deep significance across the Middle East and South Asia for its fragrance and beauty. "Jasmine" itself is an English word derived from this Arabic root — making Yasmin a name that's quite literally already part of English vocabulary.
                </p>
                <p>
                  <strong>Salma (سلمى)</strong> comes directly from the Arabic word "Salam," meaning peace. Short, soft, and immediately understandable in any language — and shares its root with the universal Islamic greeting "Salaam."
                </p>
                <p>
                  <strong>Zara (زهراء / زارا)</strong> appears regularly among modern Muslim girl names with meanings tied to "princess" and "flower." It's also a recognised name among British royalty and a global fashion brand — giving it instant familiarity in Western contexts while remaining an authentic Arabic name.
                </p>
                <p>
                  <strong>Iman (إيمان)</strong> is valued for its simplicity, elegance, and international appeal. It represents one of the core concepts of Islamic faith, made into a name that's instantly pronounceable anywhere.
                </p>
              </div>
            </section>

            <section id="trending-short" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Short, Soft & Trending for 2025–2026
              </h2>
              <p>
                These names are gaining momentum specifically because they're brief, gentle-sounding, and easy to say in any accent.
              </p>

              <TableOfNames data={TRENDING_NAMES} />

              <div className="space-y-3 mt-4 text-xs md:text-sm">
                <p>
                  <strong>Noor (نور)</strong> represents the trend toward names evoking illumination and softness. One syllable, universally understood, and rich with Quranic symbolism (Allah is described as An-Noor, the Light).
                </p>
                <p>
                  <strong>Lina (لينا)</strong> means "soft" or "tender" in Arabic. A two-syllable name that sounds equally at home in Cairo, Karachi, or California.
                </p>
                <p>
                  <strong>Hira (هيرة)</strong> is listed among names meaning "diamond" with strong modern appeal. It is also associated with the Cave of Hira, where the first revelation was received by the Prophet ﷺ — making it both gemstone-pretty and spiritually significant.
                </p>
                <p>
                  <strong>Dua (دعاء)</strong> is a modern Islamic girl name meaning "prayer." Short, meaningful, and one of the most spiritually direct names a parent can choose — every time someone calls her name, it's a small reminder of prayer itself.
                </p>
                <p>
                  <strong>Zoya (زویا)</strong> is leading the charts for modern girl names, blending modern style with deep spiritual roots meaning "alive" or "loving."
                </p>
                <p>
                  <strong>Haya (حياء)</strong> carries the dual meaning of "life" and "modesty" — a name that's simple to pronounce while carrying real depth.
                </p>
              </div>
            </section>

            <section id="powerful-meanings" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Names With Powerful, Modern Meanings
              </h2>
              <p>
                For parents who want a name that's a little more distinctive while still being easy on English-speaking tongues.
              </p>

              <TableOfNames data={POWERFUL_NAMES} />

              <div className="space-y-3 mt-4 text-xs md:text-sm">
                <p>
                  <strong>Amira (أميرة)</strong> appears consistently among popular modern Muslim girl names meaning "princess" or "leader." Strong meaning, soft sound.
                </p>
                <p>
                  <strong>Inaya (عناية)</strong> is a direct Quranic name connected to the concept of care and protection, referenced in Surah Al-Furqan 25:74. It is one of the fastest-rising names in recent naming guides.
                </p>
                <p>
                  <strong>Sakina (سكينة)</strong> describes the deep spiritual peace mentioned in the Quran as descending upon the hearts of believers — calm to say, calm in meaning.
                </p>
                <p>
                  <strong>Hafsa (حفصة)</strong> means "young lioness" in Arabic and was the name of one of the Prophet's ﷺ wives — a name that pairs gentle sound with a fierce, empowering meaning.
                </p>
                <p>
                  <strong>Faiza (فائزة)</strong> is listed among names meaning "victorious," part of a category of empowering, strength-themed modern names.
                </p>
                <p>
                  <strong>Zahra (زهراء)</strong> means "radiant flower" and is famously used as a nickname for Fatimah, the beloved daughter of the Prophet ﷺ.
                </p>
              </div>
            </section>

            <section id="spiritually-rooted" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Spiritually Rooted Names With a Modern Edge
              </h2>
              <p>
                These names combine profound historical and spiritual weight with a clean phonetic profile suitable for Western environments.
              </p>

              <TableOfNames data={EDGE_NAMES} />

              <div className="space-y-3 mt-4 text-xs md:text-sm">
                <p>
                  <strong>Maryam (مريم)</strong> is the Arabic form of Mary, and in Iran the same name is also used for the tuberose flower. Maryam is the only woman named in her own right in the Quran, with an entire chapter (Surah Maryam) bearing her name.
                </p>
                <p>
                  <strong>Asma (أسماء)</strong> was the name of the daughter of Abu Bakr (RA) and represents "supreme" or "excellent."
                </p>
                <p>
                  <strong>Lulu (لولو)</strong> means "pearl" in Arabic, and is also used as a nickname in countries like Germany, Romania, and Sweden — making it one of the most genuinely "international" Arabic names on this list.
                </p>
                <p>
                  <strong>Alaia (علياء)</strong> feels very modern while carrying genuinely deep Arabic roots tied to the meaning "sublime" or "high status."
                </p>
                <p>
                  <strong>Eshal (إشال)</strong> is among the names currently leading naming charts, blending a modern sound with spiritual symbolism tied to the "flower of Jannah" (Paradise).
                </p>
              </div>
            </section>

            <section id="how-to-pick" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                How to Pick the Right One for Your Family
              </h2>
              <p>
                A few practical questions worth running through before you finalise a name from this list:
              </p>
              
              <div className="space-y-3">
                {[
                  { step: 1, title: 'Test the flow', desc: "Say the full name out loud — first name, middle name (if any), and surname together. Some beautiful names create awkward combinations with certain surnames." },
                  { step: 2, title: 'Check spelling variations', desc: "Layla can be Layla, Laila, Leila, or Leyla — decide early and stick with it across all documents to prevent future clerical confusion." },
                  { step: 3, title: 'Think about nicknames', desc: "Aaliyah might become 'Ali' among English-speaking friends; Sakina might become 'Sak.' Are you comfortable with the likely shortenings?" },
                  { step: 4, title: 'Verify the meaning', desc: "Verify the meaning from more than one source, especially for newer or trendier names — some 'modern' names circulating online have meanings that are loosely translated or disputed." },
                  { step: 5, title: 'Consider official documents', desc: "Think about how it reads on government forms, school records, and passports. Names with diacritics or apostrophes (representing ayn or hamza) can cause administrative friction." }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start p-4 bg-card/60 border border-border rounded-xl">
                    <span className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-text">{item.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 divide-y divide-border/30">
                {[
                  {
                    q: "Is it okay to choose a name just because it's popular in the West, even if it has Arabic roots?",
                    a: "Yes — as long as the meaning is good and doesn't conflict with Islamic principles (no shirk, no negative connotations), there's no issue with a name being popular in multiple cultures simultaneously. In fact, many of the most beloved names in Islamic history have always been 'international' in this sense."
                  },
                  {
                    q: "Are spelling variations like Laila vs. Layla religiously significant?",
                    a: "No — these are simply transliteration choices from Arabic script into Latin letters. Choose whichever spelling feels right for your family and is easiest for your child to write and pronounce in your country of residence."
                  },
                  {
                    q: "What's the difference between 'Sara' and 'Sarah'?",
                    a: "Both refer to the same name. 'Sarah' is more common in English/Hebrew-influenced spelling, while 'Sara' is more common in Arabic/Turkish/South Asian usage. Both are correct and carry the same meaning."
                  },
                  {
                    q: "Do these names work well as middle names too?",
                    a: "Many of them do — shorter names like Noor, Dua, Lina, and Zara pair nicely as middle names alongside a more traditional or family first name, giving you the best of both worlds."
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
                The names above prove that "modern" and "meaningful" aren't opposites. Each carries real Arabic roots, real Islamic significance, and — just as importantly — real ease of use for a child growing up in an English-speaking environment.
              </p>
              <p>
                Whether you choose something globally recognised like <strong>Layla</strong> or <strong>Sara</strong>, or something quietly rising like <strong>Inaya</strong> or <strong>Alaia</strong>, you're giving your daughter a name that will feel at home wherever life takes her.
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
                <Link to="/blog/50-beautiful-islamic-girl-names-starting-with-f" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">50 Beautiful Islamic Girl Names Starting with F</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 10, 2026</span>
                </Link>
                <Link to="/blog/how-to-choose-an-islamic-name" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent inline-block">Guide</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">How to Choose an Islamic Name — Complete Guide for Parents</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 3, 2026</span>
                </Link>
                <Link to="/blog/top-30-quranic-names-for-baby-boys-in-2026" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Boy Names</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Article Category</span><span className="text-text font-bold">Girl Names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Naming Trend</span><span className="text-text font-bold">Crossover / English-Friendly</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Featured Years</span><span className="text-text font-bold">2025–2026</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium font-arabic">Primary Focus</span><span className="text-text font-bold">Spelling & Pronunciation Ease</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Total Names Listed</span><span className="text-text font-bold">24 Names</span></li>
              </ul>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Hadith on Good Meanings</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ said: <em className="text-text">"You will be called on the Day of Resurrection by your names and your fathers' names, so give yourselves good names."</em> (Abu Dawud)
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

export default ModernArabicGirlNamesArticle;
