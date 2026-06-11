import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const NAMES_1_25 = [
  { num: 1, name: 'Fatimah', badge: 'Historic', arabic: 'فاطمة', meaning: 'One who abstains; one who weans — named after the beloved daughter of the Prophet ﷺ', origin: 'Arabic' },
  { num: 2, name: 'Firdaus', badge: 'Quranic', arabic: 'فردوس', meaning: 'The highest garden of Paradise (Jannah); mentioned in Surah Al-Kahf 18:107', origin: 'Arabic / Persian' },
  { num: 3, name: 'Farah', badge: null, arabic: 'فرح', meaning: 'Joy, happiness, delight, gladness', origin: 'Arabic' },
  { num: 4, name: 'Fajr', badge: 'Quranic', arabic: 'فجر', meaning: 'Dawn, daybreak; the name of Surah 89 of the Quran', origin: 'Arabic' },
  { num: 5, name: 'Farida', badge: null, arabic: 'فريدة', meaning: 'Unique, precious, incomparable gem', origin: 'Arabic' },
  { num: 6, name: 'Fiza', badge: null, arabic: 'فضاء', meaning: 'Wind, breeze; open atmosphere', origin: 'Arabic / Urdu' },
  { num: 7, name: 'Falak', badge: 'Quranic', arabic: 'فلك', meaning: 'Celestial sphere, orbit; mentioned in Surah Ya-Sin 36:40', origin: 'Arabic' },
  { num: 8, name: 'Fariha', badge: null, arabic: 'فرحة', meaning: 'Happy, joyful, delighted', origin: 'Arabic' },
  { num: 9, name: 'Fahima', badge: null, arabic: 'فهيمة', meaning: 'Intelligent, perceptive, one who understands deeply', origin: 'Arabic' },
  { num: 10, name: 'Faiza', badge: null, arabic: 'فائزة', meaning: 'Victorious, successful, one who attains', origin: 'Arabic' },
  { num: 11, name: 'Fatima Zahra', badge: null, arabic: 'فاطمة الزهراء', meaning: "The radiant Fatima — the title of the Prophet's ﷺ daughter meaning \"the shining one\"", origin: 'Arabic' },
  { num: 12, name: 'Fidda', badge: null, arabic: 'فضة', meaning: 'Silver; precious metal symbolising purity', origin: 'Arabic' },
  { num: 13, name: 'Fareeda', badge: null, arabic: 'فريدة', meaning: 'Unique, rare pearl, one of a kind', origin: 'Arabic' },
  { num: 14, name: 'Fadila', badge: null, arabic: 'فاضلة', meaning: 'Virtuous, excellent, one of outstanding moral character', origin: 'Arabic' },
  { num: 15, name: 'Fatin', badge: null, arabic: 'فاتن', meaning: 'Captivating, enchanting, fascinating', origin: 'Arabic' },
  { num: 16, name: 'Feroza', badge: null, arabic: 'فيروزة', meaning: 'Turquoise gemstone; precious stone of victory', origin: 'Persian / Arabic' },
  { num: 17, name: 'Fareeha', badge: null, arabic: 'فريحة', meaning: 'Cheerful, lively, full of joy', origin: 'Arabic' },
  { num: 18, name: 'Fawziya', badge: null, arabic: 'فوزية', meaning: 'Triumphant, successful, one who achieves victory', origin: 'Arabic' },
  { num: 19, name: 'Firdausa', badge: null, arabic: 'فردوسة', meaning: 'Variant of Firdaus; garden of Paradise', origin: 'Arabic' },
  { num: 20, name: 'Fathia', badge: null, arabic: 'فتحية', meaning: 'Opening, beginning, one who brings victory (from the root f-t-ḥ)', origin: 'Arabic' },
  { num: 21, name: 'Fauzia', badge: null, arabic: 'فوزية', meaning: 'Victorious, prosperous, one who succeeds', origin: 'Arabic' },
  { num: 22, name: 'Fayza', badge: null, arabic: 'فايزة', meaning: 'Winner, one who gains, victorious', origin: 'Arabic' },
  { num: 23, name: 'Fuaida', badge: null, arabic: 'فؤيدة', meaning: 'Heart, benefit; one who is close to the heart', origin: 'Arabic' },
  { num: 24, name: 'Fakiha', badge: 'Quranic', arabic: 'فاكهة', meaning: 'Fruit; cheerful one. The word appears in Surah Abasa 80:31', origin: 'Arabic' },
  { num: 25, name: 'Fariyal', badge: null, arabic: 'فريال', meaning: 'Beautiful neck, graceful, elegant', origin: 'Persian / Arabic' }
];

const NAMES_26_50 = [
  { num: 26, name: 'Firdausi', badge: null, arabic: 'فردوسي', meaning: 'Of or relating to Paradise; heavenly', origin: 'Arabic / Persian' },
  { num: 27, name: 'Faryal', badge: null, arabic: 'فریال', meaning: 'Angel, fairy-like beauty', origin: 'Persian' },
  { num: 28, name: 'Fatoon', badge: null, arabic: 'فتون', meaning: 'Fascination, charm, allure', origin: 'Arabic' },
  { num: 29, name: 'Fazila', badge: null, arabic: 'فاضلة', meaning: 'Noble, virtuous, learned, excellent in character', origin: 'Arabic' },
  { num: 30, name: 'Fehmida', badge: null, arabic: 'فہمیدہ', meaning: 'Intelligent, wise, understanding', origin: 'Urdu / Arabic' },
  { num: 31, name: 'Fawzia', badge: null, arabic: 'فوزية', meaning: 'Triumphant, achieving success and victory', origin: 'Arabic' },
  { num: 32, name: 'Fakhra', badge: null, arabic: 'فخرا', meaning: 'Pride, honour, glory', origin: 'Arabic' },
  { num: 33, name: 'Faria', badge: null, arabic: 'فاریہ', meaning: 'Beautiful, lovely, tall and slender', origin: 'Arabic / Urdu' },
  { num: 34, name: 'Faseeha', badge: null, arabic: 'فصيحة', meaning: 'Eloquent, articulate, fluent in speech', origin: 'Arabic' },
  { num: 35, name: 'Fatinah', badge: null, arabic: 'فاتنة', meaning: 'Charming, captivating, alluring', origin: 'Arabic' },
  { num: 36, name: 'Fawzana', badge: null, arabic: 'فوزانة', meaning: 'One who constantly achieves success', origin: 'Arabic' },
  { num: 37, name: 'Fida', badge: null, arabic: 'فداء', meaning: 'Sacrifice, devotion, ransom; selfless dedication', origin: 'Arabic' },
  { num: 38, name: 'Fowziya', badge: null, arabic: 'فوزية', meaning: 'Victorious, blessed with success', origin: 'Arabic' },
  { num: 39, name: 'Furat', badge: 'Quranic', arabic: 'فرات', meaning: 'Sweet water; the Euphrates river. Mentioned in Surah Al-Furqan 25:53', origin: 'Arabic' },
  { num: 40, name: 'Fasiha', badge: null, arabic: 'فسيحة', meaning: 'Spacious, wide, ample', origin: 'Arabic' },
  { num: 41, name: 'Farwa', badge: null, arabic: 'فروة', meaning: 'Fur, wealth, crown; a name used among early Muslim women', origin: 'Arabic' },
  { num: 42, name: 'Fawzah', badge: null, arabic: 'فوزة', meaning: 'Success, triumph, achievement', origin: 'Arabic' },
  { num: 43, name: 'Fairuz', badge: null, arabic: 'فيروز', meaning: 'Turquoise; a precious stone symbolising luck and victory', origin: 'Persian / Arabic' },
  { num: 44, name: 'Fajriyya', badge: null, arabic: 'فجرية', meaning: 'Of the dawn; one who is like the early morning light', origin: 'Arabic' },
  { num: 45, name: 'Falisha', badge: null, arabic: 'فليشا', meaning: 'Happiness, felicity, one who brings bliss', origin: 'Arabic' },
  { num: 46, name: 'Fasahat', badge: null, arabic: 'فصاحت', meaning: 'Eloquence, clarity of speech, rhetorical beauty', origin: 'Arabic / Urdu' },
  { num: 47, name: 'Firasah', badge: null, arabic: 'فراسة', meaning: 'Insight, keen perception, intuition', origin: 'Arabic' },
  { num: 48, name: 'Fajraan', badge: null, arabic: 'فجران', meaning: 'Two dawns; dual of Fajr, representing double blessings of light', origin: 'Arabic' },
  { num: 49, name: 'Falahah', badge: null, arabic: 'فلاحة', meaning: 'Success, prosperity, salvation — from the Islamic concept of Falāḥ', origin: 'Arabic' },
  { num: 50, name: 'Fauzeen', badge: null, arabic: 'فوزین', meaning: 'Two victories; a name symbolising double triumph', origin: 'Arabic' }
];

const TableOfNames = ({ data }) => (
  <div className="overflow-x-auto border border-border rounded-xl bg-card/50 my-6">
    <table className="w-full text-left text-sm border-collapse">
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

const GirlNamesFArticle = () => {
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
      const sections = ['introduction', 'why-f', 'quranic-names', 'names-1-25', 'names-26-50', 'top-picks', 'naming-tips', 'conclusion'];
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
    const text = 'Discover 50 beautiful Islamic girl names starting with the letter F — from Fatima to Firdaus.';
    
    const shareUrls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
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
    { id: 'introduction', label: 'Introduction: The Letter Fa' },
    { id: 'why-f', label: 'Why Choose a Name Starting with F?' },
    { id: 'quranic-names', label: 'Quranic Names Starting with F' },
    { id: 'names-1-25', label: 'Names 1–25' },
    { id: 'names-26-50', label: 'Names 26–50' },
    { id: 'top-picks', label: 'Our Top 5 Picks' },
    { id: 'naming-tips', label: 'Naming Tips from the Sunnah' },
    { id: 'conclusion', label: 'Conclusion' },
  ];

  return (
    <>
      <Helmet>
        <title>50 Beautiful Islamic Girl Names Starting with F — IslamicNames</title>
        <meta
          name="description"
          content="Discover 50 beautiful Islamic girl names starting with the letter F — from Fatima to Firdaus. Full Arabic script, meanings, origins, and Quranic references."
        />
        <meta name="keywords" content="Islamic girl names starting with F, Muslim baby girl names F, Fatima meaning, Firdaus meaning, Arabic girl names, Quranic girl names" />
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
              Girl Names · Letter F
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              50 Beautiful Islamic Girl Names Starting with F
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              From Fatima to Firdaus — explore 50 meaningful girl names starting with the Arabic letter Fa (فـ), with full meanings, Arabic script, and origins.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> June 10, 2025</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 12,400 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#A0305A] via-[#D4607A] to-accent rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            فـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            فاطمة & فردوس
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="introduction" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Introduction: The Beauty of the Letter Fa (فـ)
              </h2>
              <p>
                The Arabic letter <strong>Fa (ف)</strong> holds a special place in Islamic naming tradition. It is the first letter of one of the most beloved names in all of Islam — <strong>Fatimah (فاطمة)</strong>, the daughter of the Prophet Muhammad ﷺ. Names beginning with Fa carry a natural elegance, flowing beautifully in both Arabic and English, and many of them hold deep spiritual, Quranic, and historical significance.
              </p>
              <p>
                In this article, we have carefully curated <strong>50 beautiful Islamic girl names</strong> starting with the letter F. Each name includes its Arabic script, meaning, origin, and — where applicable — its Quranic connection. Whether you are expecting a daughter, helping a friend, or simply exploring the richness of Islamic names, this guide is for you.
              </p>
              
              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl italic text-text my-6 space-y-2">
                <p className="text-sm md:text-base">"On the Day of Resurrection, you will be called by your names and by your fathers' names, so give yourselves good names."</p>
                <span className="block text-right text-xs font-bold text-primary">— Sunan Abu Dawud 4948</span>
              </div>
            </section>

            <section id="why-f" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Why Choose a Name Starting with F?
              </h2>
              <p>
                Names starting with the letter F in Arabic are derived from roots that often convey concepts of <strong>opening, dawn, victory, paradise, and virtue</strong>. The Arabic root <em>f-t-ḥ</em> (فتح) means "to open" or "to grant victory," while <em>f-r-d-w-s</em> (فردوس) refers to the highest level of Paradise. The letter Fa is phonetically soft, making names that start with it easy to pronounce across languages — a practical consideration for families in multilingual communities.
              </p>
              <p>
                Many Fa-names are also <strong>Quranic</strong>, appearing directly in the Holy Quran. Others are rooted in classical Arabic poetry, historical figures, or the beautiful attributes described in the Sunnah. Below are some key reasons parents choose F-names:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
                <li><strong>Prophetic Connection</strong> — Fatimah (رضي الله عنها) is the most prominent female name in Islamic history</li>
                <li><strong>Quranic Presence</strong> — Names like Firdaus, Falaq, and Furqan appear directly in the Quran</li>
                <li><strong>Phonetic Beauty</strong> — The soft "F" sound is universally easy to pronounce</li>
                <li><strong>Rich Meanings</strong> — Themes of paradise, dawn, virtue, and radiance</li>
                <li><strong>Cross-cultural Appeal</strong> — Names like Farida, Farah, and Fiza work globally</li>
              </ul>
            </section>

            <section id="quranic-names" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Quranic Names Starting with F
              </h2>
              <p>
                Several names in this list are directly derived from words mentioned in the Holy Quran. These names carry additional spiritual significance, as they connect the child to the divine scripture. Here are the most notable Quranic F-names:
              </p>

              <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 my-6">
                <div className="font-arabic text-2xl text-accent font-bold">وَالْفَجْرِ ۝ وَلَيَالٍ عَشْرٍ</div>
                <span className="block text-xs text-text-muted font-bold">— Surah Al-Fajr (89:1-2)</span>
                <p className="text-sm italic text-text">"By the dawn, and by the ten nights."</p>
              </div>
              <p>
                The word <strong>Al-Fajr (الفجر)</strong> meaning "The Dawn" is the name of an entire Surah in the Quran. The name <strong>Fajr</strong> for a girl symbolises new beginnings, light breaking through darkness, and the beauty of creation at dawn — a powerful and poetic name choice.
              </p>

              <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 my-6">
                <div className="font-arabic text-2xl text-accent font-bold">فِيهَا عَيْنٌ جَارِيَةٌ ۝ فِيهَا سُرُرٌ مَّرْفُوعَةٌ</div>
                <span className="block text-xs text-text-muted font-bold">— Surah Al-Ghashiyah (88:12-13)</span>
                <p className="text-sm italic text-text">"In it is a flowing spring, in it are raised couches."</p>
              </div>
              <p>
                The concept of <strong>Firdaus (الفردوس)</strong> — the highest garden of Paradise — is mentioned multiple times in the Quran, including in <em>Surah Al-Kahf (18:107)</em> and <em>Surah Al-Mu'minun (23:11)</em>. It is one of the most spiritually charged names a Muslim parent can give their daughter.
              </p>
            </section>

            <section id="names-1-25" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Names 1–25
              </h2>
              <p>
                Below are the first 25 beautiful Islamic girl names starting with F.
              </p>
              <TableOfNames data={NAMES_1_25} />
              
              <div className="bg-gradient-to-r from-card to-accent/5 border border-border p-5 rounded-2xl text-sm leading-relaxed space-y-2">
                <span className="text-accent font-black block">💡 Naming Tip:</span>
                <p>When choosing a name, consider how it sounds with your surname. Say the full name aloud — a name that flows naturally with the family name will feel more comfortable throughout the child's life.</p>
              </div>
            </section>

            <section id="names-26-50" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Names 26–50
              </h2>
              <p>
                Below is the second part of our list of beautiful girl names starting with F.
              </p>
              <TableOfNames data={NAMES_26_50} />
            </section>

            <section id="top-picks" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Our Top 5 Picks
              </h2>
              <p>
                If you're looking for our personal recommendations, here are the five names we believe combine the best of beauty, meaning, and spiritual significance:
              </p>
              <ol className="list-decimal pl-6 space-y-4 text-sm md:text-base">
                <li>
                  <strong className="text-text">Fatimah (فاطمة)</strong> — The most historically significant Islamic girl name. The daughter of the Prophet ﷺ, she is a role model of piety, strength, and grace. This name has been the most popular Muslim girl name for 14 centuries.
                </li>
                <li>
                  <strong className="text-text">Firdaus (فردوس)</strong> — The highest level of Jannah. Giving your daughter this name is like giving her a prayer — may she attain the highest Paradise. It is one of the most spiritually powerful names in Islam.
                </li>
                <li>
                  <strong className="text-text">Fajr (فجر)</strong> — Dawn. There is something profoundly beautiful about naming a child after the first light of day. It symbolises hope, new beginnings, and the mercy of Allah that arrives each morning.
                </li>
                <li>
                  <strong className="text-text">Farida (فريدة)</strong> — Unique, one of a kind. In a world where individuality matters, this name tells your daughter she is a rare and precious gem. It works beautifully in Arabic, English, French, and many other languages.
                </li>
                <li>
                  <strong className="text-text">Farah (فرح)</strong> — Pure joy. Simple, elegant, and universal. This name sounds beautiful in every language and carries an inherently positive energy.
                </li>
              </ol>
            </section>

            <section id="naming-tips" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Naming Tips from the Sunnah
              </h2>
              <p>
                Choosing a name is one of the first acts of love a parent gives their child. The Prophet Muhammad ﷺ emphasised the importance of giving good, meaningful names. Here are key guidelines from the Sunnah:
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl italic text-text my-6 space-y-2">
                <p className="text-sm md:text-base">"The most beloved of your names to Allah are Abdullah and Abdur-Rahman."</p>
                <span className="block text-right text-xs font-bold text-primary">— Sahih Muslim 2132</span>
              </div>

              <div className="space-y-3">
                <p>
                  <strong>1. Choose names with beautiful meanings.</strong> The Prophet ﷺ would sometimes change the names of people if their original names had negative meanings. A name should carry blessings, not burdens.
                </p>
                <p>
                  <strong>2. Names of Prophets and righteous people are recommended.</strong> Naming children after the Prophets and pious companions connects them to a legacy of piety and strength.
                </p>
                <p>
                  <strong>3. Names that show devotion to Allah are highly praised.</strong> For boys, names showing servitude like Abdullah (Servant of Allah) and Abdur-Rahman (Servant of the Most Merciful) are considered the most beloved to Allah.
                </p>
                <p>
                  <strong>4. Avoid names with negative or arrogant meanings.</strong> Islam discourages names that suggest self-glorification, sadness, or anything contrary to modesty and gratitude.
                </p>
                <p>
                  <strong>5. Consider the child's future.</strong> Choose a name your daughter will carry proudly as a child, a student, a professional, and a mother. A name is a lifelong companion.
                </p>
              </div>

              <div className="bg-gradient-to-r from-card to-primary/5 border border-border p-5 rounded-2xl text-sm leading-relaxed space-y-2 mt-6">
                <span className="text-primary font-black block">💡 Did You Know?</span>
                <p>The Prophet ﷺ named his own daughter Fatimah (فاطمة), meaning "one who abstains." She is known as Sayyidat Nisa' al-Jannah — "The Leader of the Women of Paradise." It remains the most popular Muslim girl name worldwide.</p>
              </div>
            </section>

            <section id="conclusion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Conclusion
              </h2>
              <p>
                The letter F (Fa) offers an incredibly rich selection of Islamic girl names — from the historically sacred <strong>Fatimah</strong> to the heavenly <strong>Firdaus</strong>, from the dawn-inspired <strong>Fajr</strong> to the joyful <strong>Farah</strong>. Each name on this list has been carefully selected for its authenticity, beauty, and spiritual depth.
              </p>
              <p>
                Remember, a name is more than just a label — in Islam, it is a <em>du'a</em> (prayer) for your child. Choose a name that you would be proud to call out on the Day of Judgement, one that carries the weight of meaning and the lightness of beauty.
              </p>
              <p>
                We pray that this list helps you find the perfect name for your little one. May Allah bless your family and grant your daughter a name that brings her barakah (blessings) throughout her life. <strong>Ameen.</strong>
              </p>

              <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 my-6">
                <div className="font-arabic text-2xl text-accent font-bold">رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ</div>
                <span className="block text-xs text-text-muted font-bold">— Surah Aal-e-Imran (3:38)</span>
                <p className="text-sm italic text-text">"My Lord, grant me from Yourself good offspring. Indeed, You are the Hearer of supplication."</p>
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
                  onClick={() => handleShare('twitter')}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  Twitter
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
                <Link to="/blog" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">50 Islamic Girl Names Starting with S — Sara, Safiya & More</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 10, 2025</span>
                </Link>
                <Link to="/blog" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Quranic</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Names Meaning Light in the Quran — Noor, Zia, and More</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 15, 2025</span>
                </Link>
                <Link to="/blog" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent inline-block">Guide</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">How to Choose an Islamic Name — Complete Guide for Parents</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 3, 2025</span>
                </Link>
              </div>
            </div>

          </article>

          {/* Right Column: Sidebar */}
          <aside className="space-y-6">
            
            {/* Table of Contents Widget */}
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-20 shadow-md">
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
                            top: el.offsetTop - 100,
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

            {/* Quick Facts Widget */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent border-b border-border pb-3 mb-4">
                📊 Quick Facts
              </h3>
              <ul className="divide-y divide-border/40 text-xs">
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Total Names</span><span className="text-text font-bold">50</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Category</span><span className="text-text font-bold">Girl Names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Starting Letter</span><span className="text-text font-bold">F (فـ)</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Quranic Names</span><span className="text-text font-bold">5 names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Origins</span><span className="text-text font-bold">Arabic, Persian, Urdu</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Most Popular</span><span className="text-text font-bold">Fatimah</span></li>
              </ul>
            </div>

            {/* Newsletter Subscription Widget */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent border-b border-border pb-3 mb-1">
                📬 Get Name Ideas Weekly
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Subscribe to receive curated Islamic name lists, guides, and naming tips delivered to your inbox every Friday.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed successfully!'); e.target.reset(); }} className="space-y-2">
                <input
                  required
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text placeholder-text-muted/50 focus:outline-none focus:border-primary text-xs shadow-inner"
                />
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-opacity-95 text-bg font-bold py-2 rounded-lg text-xs transition-opacity shadow-md"
                >
                  Subscribe — It's Free
                </button>
              </form>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Naming History</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ loved the name <strong className="text-text">Fatimah</strong> so much that he gave it to his own daughter. She is known as <em>"Az-Zahra"</em> (the Radiant One) and <em>"Sayyidat Nisa' al-Jannah"</em> (Leader of the Women of Paradise). It remains the absolute pinnacle of honor and piety in Islamic nomenclature.
              </p>
            </div>

          </aside>

        </div>
      </div>
    </>
  );
};

export default GirlNamesFArticle;
