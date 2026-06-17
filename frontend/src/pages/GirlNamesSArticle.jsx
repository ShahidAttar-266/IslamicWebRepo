import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const NAMES_1_25 = [
  { num: 1, name: 'Sara', badge: 'Historic', arabic: 'سارة', meaning: 'Pure, happiness, princess; name of the beloved wife of Prophet Ibrahim (AS)', origin: 'Arabic / Hebrew' },
  { num: 2, name: 'Safiya', badge: 'Historic', arabic: 'صفية', meaning: 'Pure, chosen, untroubled; name of Safiya bint Huyayy, one of the wives of the Prophet ﷺ', origin: 'Arabic' },
  { num: 3, name: 'Sana', badge: null, arabic: 'سناء', meaning: 'Radiance, brilliance, to shine; refers to a glowing light', origin: 'Arabic' },
  { num: 4, name: 'Sajida', badge: null, arabic: 'ساجدة', meaning: 'One who prostrates to Allah, worshipper; derived from the root sajada', origin: 'Arabic' },
  { num: 5, name: 'Samira', badge: null, arabic: 'سميرة', meaning: 'Entertaining companion, pleasant evening conversation; from the root samara', origin: 'Arabic' },
  { num: 6, name: 'Sumayyah', badge: 'Historic', arabic: 'سمية', meaning: 'High above, elevated; name of the first martyr (shaheed) in the history of Islam', origin: 'Arabic' },
  { num: 7, name: 'Sadia', badge: null, arabic: 'سعدية', meaning: 'Fortunate, blessed, happy; feminine form of Saad', origin: 'Arabic' },
  { num: 8, name: 'Salma', badge: null, arabic: 'سلمى', meaning: 'Safe, peaceful, serene; rooted in salam (peace)', origin: 'Arabic' },
  { num: 9, name: 'Shahida', badge: null, arabic: 'شاهدة', meaning: 'Witness, one who observes; carries a spiritual dimension of witnessing the truth', origin: 'Arabic' },
  { num: 10, name: 'Sumaya', badge: 'Historic', arabic: 'سُمَيَّة', meaning: 'High, exalted, lofty; variant spelling of Sumayyah', origin: 'Arabic' },
  { num: 11, name: 'Sabrina', badge: null, arabic: 'صابرينة', meaning: 'Patient; also refers to the river Severn in Latin roots, popular in multicultural families', origin: 'Arabic / Latin' },
  { num: 12, name: 'Sidra', badge: 'Quranic', arabic: 'سدرة', meaning: 'The lote tree in Jannah (Sidrat al-Muntaha) at the boundary of the seventh heaven', origin: 'Arabic' },
  { num: 13, name: 'Sakina', badge: 'Quranic', arabic: 'سكينة', meaning: 'Peace, tranquillity, divine calm sent down by Allah upon believers', origin: 'Arabic' },
  { num: 14, name: 'Souad', badge: null, arabic: 'سعاد', meaning: 'Happiness, good fortune; popular across North Africa and the Arab world', origin: 'Arabic' },
  { num: 15, name: 'Suha', badge: null, arabic: 'سُها', meaning: 'A small star, a dim star in Ursa Major that tests eyesight; quietly beautiful', origin: 'Arabic' },
  { num: 16, name: 'Sabah', badge: null, arabic: 'صباح', meaning: 'Morning, dawn; the early morning hours filled with Fajr and barakah', origin: 'Arabic' },
  { num: 17, name: 'Shahnaz', badge: null, arabic: 'شاہناز', meaning: 'Pride of the king, royal melody; combines Shah (king) and Naz (pride)', origin: 'Persian / Urdu' },
  { num: 18, name: 'Sumbul', badge: null, arabic: 'سنبل', meaning: 'A fragrant plant (hyacinth or spikenard); symbolises natural grace', origin: 'Arabic / Persian' },
  { num: 19, name: 'Shirin', badge: null, arabic: 'شيرين', meaning: 'Sweet, pleasant, charming; immortalised in classical love stories', origin: 'Persian' },
  { num: 20, name: 'Saba', badge: null, arabic: 'صبا', meaning: 'East wind, morning breeze, gentle wind; messenger of love in Sufi poetry', origin: 'Arabic' },
  { num: 21, name: 'Safia', badge: null, arabic: 'صافية', meaning: 'Pure, clear, serene (like still, clean water); variant of Safiya', origin: 'Arabic' },
  { num: 22, name: 'Sumaira', badge: null, arabic: 'سميرة', meaning: 'Brownish complexion, one with a golden-brown tone; warm and beautiful', origin: 'Arabic' },
  { num: 23, name: 'Sameena', badge: null, arabic: 'سمينة', meaning: 'Precious, valuable, healthy; something of great worth', origin: 'Arabic' },
  { num: 24, name: 'Sarra', badge: null, arabic: 'سرّاء', meaning: 'Joy, happiness, delight; Quranic term describing life\'s positive side', origin: 'Arabic' },
  { num: 25, name: 'Sarwat', badge: null, arabic: 'ثروت', meaning: 'Wealth, riches, affluence; also represents richness of character', origin: 'Arabic / Urdu' }
];

const NAMES_26_50 = [
  { num: 26, name: 'Shaima', badge: 'Historic', arabic: 'شيماء', meaning: 'One with beauty marks; name of the Prophet\'s ﷺ beloved foster sister', origin: 'Arabic' },
  { num: 27, name: 'Sawda', badge: 'Historic', arabic: 'سودة', meaning: 'Black date palm, dark beauty; second wife of the Prophet ﷺ', origin: 'Arabic' },
  { num: 28, name: 'Salwa', badge: 'Quranic', arabic: 'سلوى', meaning: 'Consolation, solace, quail; sent by Allah as provision (Surah Al-Baqarah 2:57)', origin: 'Arabic' },
  { num: 29, name: 'Sadaf', badge: null, arabic: 'صدف', meaning: 'Oyster shell, mother of pearl; represents hidden inner beauty', origin: 'Arabic / Persian' },
  { num: 30, name: 'Shafaq', badge: 'Quranic', arabic: 'شفق', meaning: 'Twilight, the red glow at dawn or dusk (Surah Al-Inshiqaq 84:16)', origin: 'Arabic' },
  { num: 31, name: 'Sawsan', badge: null, arabic: 'سوسن', meaning: 'Lily of the valley, iris flower; delicate botanical name', origin: 'Arabic' },
  { num: 32, name: 'Sitara', badge: null, arabic: 'ستارة', meaning: 'Star, a curtain, veil; brightness and protective modesty', origin: 'Persian / Urdu' },
  { num: 33, name: 'Safaa', badge: 'Quranic', arabic: 'صفاء', meaning: 'Purity, clarity, serenity; connected to Al-Safa hill in Makkah', origin: 'Arabic' },
  { num: 34, name: 'Sundus', badge: 'Quranic', arabic: 'سندس', meaning: 'Fine silk, brocade worn by the dwellers of Jannah (Surah Al-Kahf 18:31)', origin: 'Arabic / Quranic' },
  { num: 35, name: 'Sabreen', badge: 'Quranic', arabic: 'صابرين', meaning: 'Patient ones, those who endure with grace; praised frequently in the Quran', origin: 'Arabic' },
  { num: 36, name: 'Shaheena', badge: null, arabic: 'شاهينة', meaning: 'Falcon, royal bird of prey; symbolises high ambition and nobility', origin: 'Persian / Urdu' },
  { num: 37, name: 'Suhana', badge: null, arabic: 'سُهانا', meaning: 'Pleasant, agreeable, charming; one whose presence brings comfort', origin: 'Arabic / Urdu' },
  { num: 38, name: 'Shayma', badge: 'Historic', arabic: 'شيماء', meaning: 'One of good character, beauty marks; foster sister of the Prophet ﷺ', origin: 'Arabic' },
  { num: 39, name: 'Sharifah', badge: null, arabic: 'شريفة', meaning: 'Noble, honourable, distinguished; status title and name', origin: 'Arabic' },
  { num: 40, name: 'Sanaa', badge: null, arabic: 'سناء', meaning: 'Brilliance, splendour, radiance; variant of Sana', origin: 'Arabic' },
  { num: 41, name: 'Sariya', badge: null, arabic: 'سارية', meaning: 'Clouds at night, night clouds moving with rain; rare and poetic name', origin: 'Arabic' },
  { num: 42, name: 'Shahla', badge: null, arabic: 'شهلاء', meaning: 'Dark blue or grey eyes, deep and striking eyes admired in poetry', origin: 'Persian / Arabic' },
  { num: 43, name: 'Sameera', badge: null, arabic: 'سميرة', meaning: 'One who entertains with pleasant conversation; variant of Samira', origin: 'Arabic' },
  { num: 44, name: 'Samah', badge: null, arabic: 'سماح', meaning: 'Generosity, forgiveness, tolerance; highly prized virtues in Islam', origin: 'Arabic' },
  { num: 45, name: 'Salsabil', badge: 'Quranic', arabic: 'سَلسَبيل', meaning: 'A spring in paradise, sweet and flowing water (Surah Al-Insan 76:18)', origin: 'Arabic / Quranic' },
  { num: 46, name: 'Shukria', badge: null, arabic: 'شكرية', meaning: 'Grateful, thankful; rooted in shukr (gratitude)', origin: 'Arabic' },
  { num: 47, name: 'Shahrazad', badge: null, arabic: 'شهرزاد', meaning: 'Free city, of noble lineage; the legendary narrator of 1001 Nights', origin: 'Persian' },
  { num: 48, name: 'Sawdah', badge: 'Historic', arabic: 'سودة', meaning: 'Dark, black date palm; variant of Sawda, Mother of the Believers', origin: 'Arabic' },
  { num: 49, name: 'Siham', badge: null, arabic: 'سهام', meaning: 'Arrows; represents precision, strength, and clear direction', origin: 'Arabic' },
  { num: 50, name: 'Suhailah', badge: null, arabic: 'سهيلة', meaning: 'Gentle, smooth, easy-going; associated with the star Canopus (Suhayl)', origin: 'Arabic' }
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
                    row.badge === 'Quranic' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-accent/10 text-accent border border-accent/20'
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

const GirlNamesSArticle = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTOC, setActiveTOC] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      const sections = ['introduction', 'why-s', 'quranic-names', 'names-1-25', 'names-26-50', 'top-picks', 'naming-tips', 'conclusion'];
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
    const text = 'Discover 50 beautiful Islamic girl names starting with the letter S — from Sara to Safiya.';
    
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
    { id: 'introduction', label: 'Introduction: The Letter Seen' },
    { id: 'why-s', label: 'Why Choose a Name Starting with S?' },
    { id: 'quranic-names', label: 'Quranic & Historical Significance' },
    { id: 'names-1-25', label: 'Names 1–25' },
    { id: 'names-26-50', label: 'Names 26–50' },
    { id: 'top-picks', label: 'Our Top 5 Picks' },
    { id: 'naming-tips', label: 'How to Choose the Right Name' },
    { id: 'conclusion', label: 'Conclusion' },
  ];

  return (
    <>
      <Helmet>
        <title>50 Islamic Girl Names Starting with S — Sara, Safiya & More — IslamicNames</title>
        <meta name="description" content="Explore 50 beautiful Islamic baby girl names starting with the letter S (Seen), featuring timeless classics like Sara and Safiya. Includes script, meanings, and origins." />
        <meta name="keywords" content="Islamic girl names starting with S, Muslim girl names S, Sara meaning, Safiya meaning, Arabic girl names, Quranic girl names, Seen names" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.islamicnames.in/blog/50-islamic-girl-names-starting-with-s" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.islamicnames.in/blog/50-islamic-girl-names-starting-with-s" />
        <meta property="og:title" content="50 Islamic Girl Names Starting with S — Sara, Safiya & More — IslamicNames" />
        <meta property="og:description" content="Explore 50 beautiful Islamic baby girl names starting with the letter S (Seen), featuring timeless classics like Sara and Safiya. Includes script, meanings, and origins." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/blog/50-islamic-girl-names-starting-with-s" />
        <meta name="twitter:title" content="50 Islamic Girl Names Starting with S — Sara, Safiya & More — IslamicNames" />
        <meta name="twitter:description" content="Explore 50 beautiful Islamic baby girl names starting with the letter S (Seen), featuring timeless classics like Sara and Safiya. Includes script, meanings, and origins." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* JSON-LD Article Structured Data */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "50 Islamic Girl Names Starting with S — Sara, Safiya & More — IslamicNames",
  "description": "Explore 50 beautiful Islamic baby girl names starting with the letter S (Seen), featuring timeless classics like Sara and Safiya. Includes script, meanings, and origins.",
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
    "@id": "https://www.islamicnames.in/blog/50-islamic-girl-names-starting-with-s"
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
              { "@type": "ListItem", "position": 3, "name": "50 Islamic Girl Names Starting with S", "item": "https://www.islamicnames.in/blog/50-islamic-girl-names-starting-with-s" }
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
            <span className="text-text">Girl Names</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Girl Names · Letter S
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              50 Islamic Girl Names Starting with S — Sara, Safiya & More
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              From the timeless Sara to the noble Safiya, explore 50 beautiful girl names starting with the Arabic letter Seen (سـ), with full meanings, Arabic script, and origins.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> May 10, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 14,200 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#4A2D6A] via-[#7A4FA5] to-accent rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            سـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            سارة & صفية
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="introduction" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Introduction
              </h2>
              <p>
                Choosing a name for your daughter is one of the most meaningful decisions you will ever make as a parent. In Islam, a name is not just a label — it is a prayer, a hope, and a reflection of the values you wish to pass on. 
              </p>
              <p>
                Names beginning with the letter S hold a special place in Islamic tradition. From the timeless <strong>Sara</strong> to the noble <strong>Safiya</strong>, these names carry centuries of beauty, history, and deep spiritual meaning. Whether you are looking for a classic Arabic name, a name rooted in Quranic values, or something that sounds both modern and meaningful, this list of 50 Islamic girl names starting with S has something for every family.
              </p>
            </section>

            <section id="why-s" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Why Choose an Islamic Name Starting with S?
              </h2>
              <p>
                The letter S (Sin/Seen — س) in Arabic is associated with softness, serenity, and strength. Many beloved figures in Islamic history carried names beginning with S — including <strong>Safiya bint Huyayy</strong>, a wife of the Prophet ﷺ, and <strong>Sumayyah bint Khayyat</strong>, the first martyr in Islam. 
              </p>
              <p>
                Names starting with S have a natural elegance when spoken in Arabic, Urdu, Persian, and English alike, making them globally popular among Muslim families.
              </p>
            </section>

            <section id="quranic-names" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Quranic & Historical Significance
              </h2>
              <p>
                Several names in this list are directly derived from vocabulary in the Holy Quran or are associated with legendary women of faith. 
              </p>
              <p>
                For instance, <strong>Sidra</strong> refers to the <em>Sidrat al-Muntaha</em> (the Lote Tree of the Boundary) mentioned in Surah An-Najm. <strong>Sakina</strong> refers to the divine peace and calm that Allah sends down upon the hearts of the believers, as mentioned in Surah Al-Fath. 
              </p>
              <p>
                Historically, names like <strong>Sawda</strong> (the second wife of the Prophet ﷺ) and <strong>Shaima</strong> (the foster sister of the Prophet ﷺ) connect a young girl to a lineage of grace, character, and strength.
              </p>
              
              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl italic text-text my-6 space-y-2">
                <p className="text-sm md:text-base">"Indeed, Allah sent down His tranquillity (Sakina) upon His Messenger and upon the believers..."</p>
                <span className="block text-right text-xs font-bold text-primary">— Surah Al-Fath 48:26</span>
              </div>
            </section>

            <section id="names-1-25" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                50 Beautiful Islamic Girl Names Starting with S (1-25)
              </h2>
              <p>
                Here are the first 25 names in our curated list, featuring their Arabic script, meanings, and origins:
              </p>
              <TableOfNames data={NAMES_1_25} />
            </section>

            <section id="names-26-50" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Names 26–50
              </h2>
              <p>
                Below is the second half of our selection, showcasing the rich variety of Arabic, Persian, and Urdu origins:
              </p>
              <TableOfNames data={NAMES_26_50} />
            </section>

            <section id="top-picks" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Our Top 5 Picks
              </h2>
              <p>
                If you are looking for names that combine beautiful phonetics with rich Islamic history and spiritual depth, here are our top recommendations:
              </p>
              <ol className="list-decimal pl-6 space-y-4 text-sm md:text-base">
                <li>
                  <strong className="text-text">Sara (سارة)</strong> — A universally loved name across the globe. As the wife of Prophet Ibrahim (AS), Sara represents patience, loyalty, and joy. It is simple, elegant, and perfectly cross-cultural.
                </li>
                <li>
                  <strong className="text-text">Safiya (صفية)</strong> — Meaning "pure" and "chosen." This name honors Safiya bint Huyayy (RA), a wife of the Prophet ﷺ celebrated for her intelligence and nobility.
                </li>
                <li>
                  <strong className="text-text">Sidra (سدرة)</strong> — A beautiful Quranic name referring to the lote tree of Jannah. It evokes a feeling of high spiritual standing and paradise.
                </li>
                <li>
                  <strong className="text-text">Sakina (سكينة)</strong> — Meaning "divine peace" and "tranquillity." A profound Quranic choice representing calm and reassurance.
                </li>
                <li>
                  <strong className="text-text">Sumayyah (سمية)</strong> — Exalted and high above. Historically, this name carries supreme honour as the first female martyr of Islam, representing courage and unwavering faith.
                </li>
              </ol>
            </section>

            <section id="naming-tips" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                How to Choose the Right Name
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>1. Meaning first.</strong> In Islam, the Prophet ﷺ encouraged giving children good, meaningful names. Look for names whose meanings reflect virtues — patience, gratitude, purity, faith, or beauty.
                </p>
                <p>
                  <strong>2. Historical connection.</strong> Names like Sumayyah, Sawda, Safiya, and Shaima connect your daughter to great women in Islamic history. These names carry stories of courage, devotion, and love.
                </p>
                <p>
                  <strong>3. Quranic roots.</strong> Names like Sakina, Salwa, Sidra, Sundus, Salsabil, and Safaa are either mentioned in the Quran or directly derived from Quranic vocabulary. These names carry a spiritual weight that goes beyond beauty.
                </p>
                <p>
                  <strong>4. Ease of pronunciation.</strong> Consider how the name sounds in your local language as well as in Arabic. A name like Sara, Sana, or Salma works beautifully in both Arabic and English-speaking environments.
                </p>
                <p>
                  <strong>5. Family tradition.</strong> Many families honour grandparents or relatives by passing down names. If there is an S-name in your family lineage, consider how it fits with the criteria above.
                </p>
              </div>

              <div className="bg-gradient-to-r from-card to-primary/5 border border-border p-5 rounded-2xl text-sm leading-relaxed space-y-2 mt-6">
                <span className="text-primary font-black block">💡 A Note on Arabic Pronunciation:</span>
                <p>Many of these names have sounds that are specific to Arabic and may be pronounced slightly differently across cultures. For example, Suha rhymes with "mocha," Sidra has a soft 'd,' and Shafaq ends with a short 'q' sound from the back of the throat. If you want your daughter's name pronounced in its original Arabic form, it is worth learning the correct pronunciation and sharing it with family and teachers.</p>
              </div>
            </section>

            <section id="conclusion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Conclusion
              </h2>
              <p>
                The names beginning with S in Islamic tradition span a remarkable range — from names of Quranic significance like Salsabil and Sakina, to names honouring the Prophet's ﷺ companions like Safiya and Sumayyah, to names rooted in Persian and Urdu poetry like Shirin and Sitara. Every name on this list carries something beautiful and worthy of the daughter you are welcoming into the world.
              </p>
              <p>
                A name is the first gift you give your child. Choose it with love, intention, and prayer — and it will be a blessing she carries for the rest of her life.
              </p>
              <p>
                Looking for more Islamic names? Explore our full collection of Islamic girl names and Islamic boy names, organised by letter, origin, and meaning, at <a href="https://www.islamicnames.in/" className="text-primary hover:underline font-bold">IslamicNames.in</a>.
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
                <Link to="/blog/names-meaning-light-in-the-quran" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Quranic</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Names Meaning Light in the Quran — Noor, Zia, and More</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 15, 2026</span>
                </Link>
                <Link to="/blog/how-to-choose-an-islamic-name" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent inline-block">Guide</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">How to Choose an Islamic Name — Complete Guide for Parents</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 3, 2026</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Total Names</span><span className="text-text font-bold">50</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Category</span><span className="text-text font-bold">Girl Names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Starting Letter</span><span className="text-text font-bold">S (سـ)</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Quranic Names</span><span className="text-text font-bold">7 names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Origins</span><span className="text-text font-bold">Arabic, Persian, Urdu</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Most Popular</span><span className="text-text font-bold">Sara, Safiya</span></li>
              </ul>
            </div>

            {/* Naming History Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Naming History</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The name <strong className="text-text">Safiya</strong> carries deep significance as it was borne by Safiya bint Huyayy, one of the Mothers of the Believers (<em>Ummahat al-Mu'minin</em>). Also, <strong className="text-text">Sumayyah</strong> bint Khayyat holds the unique honour of being the first martyr (<em>shaheed</em>) in the history of Islam, representing ultimate strength and devotion.
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

export default GirlNamesSArticle;
