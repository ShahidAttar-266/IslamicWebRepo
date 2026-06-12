import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const CORE_LIGHT_NAMES = [
  { num: 1, name: 'Noor / Nur', badge: 'Quranic', arabic: 'نور', meaning: 'Light, illumination, radiance. Unisex name directly mentioned in Surah An-Nur 24:35, giving it the highest spiritual standing.', origin: 'Arabic' },
  { num: 2, name: 'Misbah', badge: 'Quranic', arabic: 'مصباح', meaning: 'Lamp, light source. Originates from Ayat an-Nur, representing the vehicle of divine light.', origin: 'Arabic' },
  { num: 3, name: 'Kawkab', badge: 'Quranic', arabic: 'كوكب', meaning: 'Star, especially a brilliant or pearly star. Refers to reflected brilliance in Ayat an-Nur.', origin: 'Arabic' }
];

const CELESTIAL_LIGHT_NAMES = [
  { num: 4, name: 'Siraj', badge: 'Quranic', arabic: 'سراج', meaning: 'Lamp, torch, blazing light. Used in the Quran to describe the sun as a blazing lamp (Surah An-Naba 78:13).', origin: 'Arabic' },
  { num: 5, name: 'Shams', badge: 'Quranic', arabic: 'شمس', meaning: 'Sun. Symbolizes radiance, energy, and vitality. Title of Surah 91 in the Quran.', origin: 'Arabic' },
  { num: 6, name: 'Qamar', badge: 'Quranic', arabic: 'قمر', meaning: 'Moon, moonlight. Serene name representing soft beauty. Title of Surah 54 in the Quran.', origin: 'Arabic' },
  { num: 7, name: 'Hilal', badge: 'Classic', arabic: 'هلال', meaning: 'Crescent moon, new moon. Refers to the thin sliver marking the start of Islamic months.', origin: 'Arabic' }
];

const RADIANCE_LIGHT_NAMES = [
  { num: 8, name: 'Diya / Ziya', badge: 'Quranic', arabic: 'ضياء', meaning: 'Splendour, radiance, brilliant self-generated light (such as the sun in Surah Yunus 10:5).', origin: 'Arabic' },
  { num: 9, name: 'Munir / Muneer', badge: 'Prophetic', arabic: 'منير', meaning: 'Illuminating, shining, radiant. Used to describe the Prophet ﷺ as a "shining lamp" (Surah Al-Ahzab 33:46).', origin: 'Arabic' },
  { num: 10, name: 'Munira', badge: 'Feminine', arabic: 'منيرة', meaning: 'Shining, luminous, bright. The feminine form of Munir.', origin: 'Arabic' },
  { num: 11, name: 'Anwar', badge: 'Classic', arabic: 'أنور', meaning: 'Brighter, more luminous. Comparative form of Noor.', origin: 'Arabic' },
  { num: 12, name: 'Anwara', badge: 'Feminine', arabic: 'أنوارة', meaning: 'Luminous, glowing, radiant. Feminine form of Anwar.', origin: 'Arabic' }
];

const RARE_LIGHT_NAMES = [
  { num: 13, name: 'Sana', badge: 'Classic', arabic: 'سناء', meaning: 'Radiance, brilliance, splendour; "to glow, to be resplendent."', origin: 'Arabic' },
  { num: 14, name: 'Bazigh', badge: 'Quranic', arabic: 'بازغ', meaning: 'Shining, rising to radiate light (used for the sun or moon in the Quran).', origin: 'Arabic' },
  { num: 15, name: 'Bazigha', badge: 'Feminine', arabic: 'بازغة', meaning: 'Shining like the rising sun or moon. Feminine form of Bazigh.', origin: 'Arabic' },
  { num: 16, name: 'Nayyir / Nayyar', badge: 'Classic', arabic: 'نیّر', meaning: 'Luminous, shining, brilliant source of light.', origin: 'Arabic' },
  { num: 17, name: 'Nayyira', badge: 'Feminine', arabic: 'نیّرة', meaning: 'Luminous, shining bright. Feminine form of Nayyir.', origin: 'Arabic' },
  { num: 18, name: 'Athir / Atheer', badge: 'Rare', arabic: 'أثير', meaning: 'Light reflected from a sword; a specific flash or gleam.', origin: 'Arabic' },
  { num: 19, name: 'Bareeq / Bariq', badge: 'Rare', arabic: 'بریق / بارق', meaning: 'Glow, sheen, brilliance; brilliant and glittering. Indirect Quranic terms.', origin: 'Arabic' }
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

const NamesMeaningLightArticle = () => {
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
        'an-noor',
        'inside-verse',
        'three-lights',
        'diya',
        'munir',
        'anwar',
        'radiant-names',
        'noor-ud-din',
        'practical-tips',
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
    const text = 'Names Meaning Light in the Quran — Noor, Zia, and More';
    
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
    { id: 'introduction', label: 'Light in the Quran' },
    { id: 'an-noor', label: 'An-Noor: The Core Root' },
    { id: 'inside-verse', label: 'Verse of Light: Misbah & Kawkab' },
    { id: 'three-lights', label: 'The Three Great Lights' },
    { id: 'diya', label: 'Diya: Splendour vs. Noor' },
    { id: 'munir', label: 'Munir: The Prophetic Lamp' },
    { id: 'anwar', label: 'Anwar: Noor Intensified' },
    { id: 'radiant-names', label: 'More Radiant & Rare Names' },
    { id: 'noor-ud-din', label: 'Note on Noor-ud-Din Names' },
    { id: 'practical-tips', label: 'Tips for Choosing Light Names' },
    { id: 'faq', label: 'Frequently Asked Questions' },
    { id: 'conclusion', label: 'Final Thoughts' },
  ];

  return (
    <>
      <Helmet>
        <title>Names Meaning Light in the Quran — Noor, Zia, and More — IslamicNames</title>
        <meta
          name="description"
          content="Explore beautiful Islamic baby names meaning light, radiance, and splendour from the Quran. Understand Ayat an-Nur and names like Noor, Zia, Munir, and Sana."
        />
        <meta name="keywords" content="names meaning light in quran, Noor meaning, Ziya meaning, Munir meaning, Ayat an-Nur baby names, Quranic baby names light" />
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
            <span className="text-text">Quranic Names</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Quranic Names · Theme of Light
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              Names Meaning Light in the Quran — Noor, Zia, and More
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              Light is one of the most powerful and sacred themes in the Holy Quran. Discover the etymology and verse references for names representing radiance, guidance, and beauty.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> May 15, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 7,200 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#3D3D1E] via-[#525227] to-[#6B6B2E] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            عـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            الله نور السموات
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="introduction" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Introduction: Light in the Quran
              </h2>
              <p>
                Light is one of the most powerful images in the entire Quran. It's used to describe Allah Himself, the Quran as a book, the Prophet ﷺ as a person, and even the state of a believer's heart. For parents, a "light" name isn't just pretty — it's one of the most spiritually loaded categories of names available, with almost every variation tracing back to specific verses.
              </p>
              <p>
                This guide walks through the major "light" names — for both boys and girls — and shows exactly where each one comes from in the Quran.
              </p>
            </section>

            <section id="an-noor" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                An-Noor — Where Every "Light" Name Begins
              </h2>
              <p>
                Every name on this list ultimately traces back to one root: <strong>An-Noor (النور)</strong>, meaning "The Light."
              </p>
              <p>
                An-Noor is one of the names of Allah, mentioned in the Quran in the famous "Ayat an-Nur" (The Light Verse) of Surah An-Nur, chapter 24, verse 35. The verse itself is breathtaking:
              </p>
              
              <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 my-6">
                <div className="font-arabic text-2xl text-accent font-bold">اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ...</div>
                <span className="block text-xs text-text-muted font-bold">— Surah An-Nur (24:35)</span>
                <p className="text-sm italic text-text">
                  "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a pearly white star lit from the oil of a blessed olive tree, neither of the east nor of the west... Light upon light. Allah guides to His light whom He wills."
                </p>
              </div>

              <p>
                This verse is so central that the entire 24th chapter of the Quran — 64 verses long — takes its name, An-Nur, directly from it.
              </p>
              
              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl my-4 text-xs md:text-sm">
                <strong>Noor / Nur (نور)</strong> is directly mentioned in this verse, and this connection gives the name the highest possible standing in Islamic naming tradition. It's used as a unisex name across the Muslim world — for boys, girls, and as a middle/compound element in countless other names.
              </div>
            </section>

            <section id="inside-verse" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Inside the Verse of Light: Misbah & the Brilliant Star
              </h2>
              <p>
                The Ayat an-Nur doesn't just mention light in the abstract — it paints an actual picture: a niche, a lamp, glass, and a star. Two names come directly from this imagery.
              </p>

              <TableOfNames data={CORE_LIGHT_NAMES} />

              <div className="space-y-3 mt-4 text-xs md:text-sm">
                <p>
                  <strong>Misbah (مصباح)</strong> meaning "lamp" or "light source," originates directly from the Ayat an-Nur — in the verse, Allah's light is likened to a niche containing a lamp enclosed in glass that shines like a radiant star. Commentators describe this imagery as representing the light of divine guidance penetrating into the heart of a believer. While a lamp might sound modest, in this verse, the lamp is the very vehicle through which divine light reaches the world.
                </p>
                <p>
                  <strong>Kawkab (كوكب)</strong> translates to "star," especially a brilliant or pearly star. The Ayat an-Nur describes the glass surrounding the lamp as shining "like a brilliant star" (kawkabun durriyyun). While Kawkab is used more often as a name component or nickname, it carries this same imagery of brilliance reflected and amplified.
                </p>
              </div>
            </section>

            <section id="three-lights" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Siraj, Shams & Qamar — The Three Great Lights
              </h2>
              <p>
                Beyond the Verse of Light itself, the Quran uses several other specific words for "light-givers" — each tied to its own chapter or verse.
              </p>

              <TableOfNames data={CELESTIAL_LIGHT_NAMES} />

              <div className="space-y-3 mt-4 text-xs md:text-sm">
                <p>
                  <strong>Siraj (سراج)</strong> translates to "lamp," "torch," or "blazing light" in Arabic, carrying connotations of a guiding beacon reminiscent of divine wisdom. The Quran uses this exact word to describe the sun itself as a "blazing lamp" (sirajan wahhaja) in Surah An-Naba (78:13) — meaning this isn't a soft, gentle light, but a powerful, energising one.
                </p>
                <p>
                  <strong>Shams (شمس)</strong> is the Arabic word for "sun," symbolising radiance, energy, and vitality. An entire chapter of the Quran — Surah Ash-Shams, the 91st — opens by swearing an oath by the sun and its brightness, making this one of the most direct "light" names tied to a complete Surah.
                </p>
                <p>
                  <strong>Qamar (قمر)</strong> means "moon" and is a poetic, serene name signifying beauty and soft light. Like Shams, this word gives its name to an entire chapter — Surah Al-Qamar, the 54th — which opens with the splitting of the moon as a sign of divine power.
                </p>
                <p>
                  <strong>Hilal (هلال)</strong> specifically describes the crescent — the thin sliver of moon that marks the start of each Islamic month. It's a softer, more delicate light image: the very first glimmer after total darkness.
                </p>
              </div>
            </section>

            <section id="diya" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Diya — "The Sun's Own Light"
              </h2>
              <p>
                There's a subtle but beautiful distinction in the Quran between two different Arabic words for light — and it gives us one of the most elegant names on this list.
              </p>
              <p>
                <strong>Diya / Ziya (ضياء)</strong> translates to "splendour," "radiance," or "brilliant light." The Diya and Ziya spellings represent the same Arabic word, simply transliterated differently depending on regional pronunciation.
              </p>
              
              <div className="bg-gradient-to-r from-card to-primary/5 border border-border p-5 rounded-2xl text-xs md:text-sm leading-relaxed space-y-2">
                <span className="text-primary font-black block flex items-center gap-1.5">
                  <Info size={16} /> The Quranic Distinction:
                </span>
                <p>
                  What makes Diya special is its specific Quranic usage: in <strong>Surah Yunus (10:5)</strong>, Allah describes the sun as having <strong>"diya"</strong> while the moon has <strong>"nur"</strong> — the sun's light is the source, blazing and self-generated, while the moon's light (nur) is reflected. In Urdu and South Asian naming traditions, Ziya is understood simply as "splendor, light, or radiance."
                </p>
              </div>
              <p>
                So while Noor describes light in general (including reflected light), Diya/Ziya specifically evokes the sun's own, original brilliance — a subtle but meaningful difference for parents who want precision in their name's meaning.
              </p>
            </section>

            <section id="munir" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Munir — "A Shining Lamp" That Described the Prophet ﷺ
              </h2>
              <p>
                <strong>Munir / Muneer (منير)</strong> means "bright, illuminating, radiant" in Arabic, related to the root <em>nawwara</em>, meaning "to illuminate."
              </p>
              <p>
                This word carries extra weight because of where else it appears in the Quran: in <strong>Surah Al-Ahzab (33:46)</strong>, Allah describes sending the Prophet Muhammad ﷺ as "a caller to Allah by His permission, and as a shining lamp" — using the phrase <strong>"sirajan munira."</strong> Munir, then, isn't just "shiny" — it's the specific word used to describe the illuminating role of the final Messenger ﷺ himself.
              </p>
              <p>
                <strong>Munira (منيرة)</strong> is the feminine form, meaning "shining" or "luminous" — highly valued in Islamic naming traditions.
              </p>
            </section>

            <section id="anwar" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Anwar — "Brighter Than Light Itself"
              </h2>
              <p>
                <strong>Anwar (أنور)</strong> means "brighter, more luminous" in Arabic, directly related to the root word nur, meaning "light."
              </p>
              <p>
                What's elegant about Anwar is the grammar itself: in Arabic, it's the comparative/superlative form — meaning "more full of light" or "brightest" rather than simply "light." It's Noor, intensified.
              </p>
              <p>
                <strong>Anwara (أنوارة)</strong> is the feminine counterpart, representing light, radiance, and a beautiful glow.
              </p>
              <TableOfNames data={RADIANCE_LIGHT_NAMES} />
            </section>

            <section id="radiant-names" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                More Radiant Names Worth Knowing
              </h2>
              <p>
                For parents wanting something rarer, these names all sit within the same "light family" but are far less commonly used:
              </p>

              <TableOfNames data={RARE_LIGHT_NAMES} />

              <div className="space-y-3 mt-4 text-xs md:text-sm">
                <p>
                  <strong>Sana (سناء)</strong> means "radiance, brilliance, splendour" or "to glow, to be resplendent." It is a short, elegant girl's name that works beautifully across languages.
                </p>
                <p>
                  <strong>Bazigh / Bazigha (بازغ / بازغة)</strong> is a direct Quranic name for boys (Bazigh) and girls (Bazigha) meaning "shining" and "radiating light" — used specifically in the Quran to describe the sun or moon rising and beginning to shine. This word specifically captures the moment of first light — a sunrise or moonrise — making it a beautiful choice for a firstborn child.
                </p>
                <p>
                  <strong>Nayyir / Nayyira (نیّر / نيّرة)</strong> carries the meaning of "luminous, shining." A softer, less common alternative with an identical core meaning.
                </p>
                <p>
                  <strong>Athir / Atheer (أثير)</strong> is a Quranic-rooted name meaning "light reflected from a sword." This represents a specific, almost cinematic image of a gleam or flash of light.
                </p>
                <p>
                  <strong>Bareeq / Bariq (بریق / بارق)</strong> mean "glow" and "sheen" (Bareeq) and "brilliant" and "glittering" (Bariq) — both are indirect Quranic names.
                </p>
              </div>
            </section>

            <section id="noor-ud-din" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                A Quick Note on "Noor-ud-Din" Style Names
              </h2>
              <p>
                You may come across compound names like Nuruddin or Noor-ul-Haq ("Light of the Religion" / "Light of Truth"). These have a long, respected history — the 12th-century ruler Nur ad-Din Zangi being one famous example.
              </p>
              <p>
                However, it's worth knowing that some scholars consider compound names ending in "-ud-Din" (of the religion) or similar constructions to be <em>makruh</em> (discouraged), on the basis that they may attribute more virtue to a person than they possess. If you're drawn to this style of name, it's worth a quick conversation with a local scholar — opinions genuinely differ, and many families use these names without any concern.
              </p>
            </section>

            <section id="practical-tips" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Choosing a "Light" Name — Practical Tips
              </h2>
              
              <div className="space-y-3">
                {[
                  { tip: 1, title: 'Decide between general light vs. a specific source', desc: "Noor represents light in general. Diya/Ziya is the sun's own brilliant light. Qamar represents moonlight. Choose the imagery that resonates most." },
                  { tip: 2, title: 'Check the transliteration carefully', desc: "Diya, Ziya, Zia, and Dia are often the same underlying Arabic word — pick the spelling that's easiest in your country, but know they're not different names." },
                  { tip: 3, title: 'Consider unisex options', desc: "Noor, Sana, and Nur work beautifully for both boys and girls, which some parents prefer for simplicity." },
                  { tip: 4, title: 'Pair with a second name for balance', desc: "Light names are often combined to create balanced, double names — e.g., Noor Fatima, Muhammad Munir — giving a name that's both radiant and grounded." },
                  { tip: 5, title: 'Think about "first light" names for a firstborn', desc: "Bazigh/Bazigha (the moment light first appears, like sunrise or moonrise) carries lovely symbolism for an eldest child." }
                ].map((item) => (
                  <div key={item.tip} className="flex gap-4 items-start p-4 bg-card/60 border border-border rounded-xl">
                    <span className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {item.tip}
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
                    q: "Is Noor only used for girls?",
                    a: "No — Noor is genuinely unisex across the Muslim world. It's extremely common for boys, girls, and as a middle name or part of compound names for either."
                  },
                  {
                    q: "What's the actual difference between Noor and Diya?",
                    a: "Noor refers to light generally — including reflected light, like moonlight. Diya specifically refers to a brilliant, self-generated light source, like the sun. In Surah Yunus 10:5, the Quran uses exactly this distinction — the sun has diya, the moon has nur."
                  },
                  {
                    q: "Is it okay to name a child 'Shams' or 'Qamar' — aren't these just describing objects, not qualities?",
                    a: "Yes, this is fine. Naming after celestial objects mentioned reverently in the Quran (sun, moon, stars) is a long-established tradition and doesn't imply worship of those objects — the names simply borrow their beauty and the symbolism of light and guidance."
                  },
                  {
                    q: "Are Zia and Ziya the same name?",
                    a: "Yes — these are different transliterations of the exact same Arabic word and root, simply reflecting different regional pronunciations of the Arabic letter ض."
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
                Few themes run as deep through the Quran as light — as guidance, as revelation, as the very description of Allah Himself. Whether you choose Noor for its universal recognition, Diya for its precise meaning, or something rarer like Bazigha or Athir, every name in this list connects your child to one of the Quran's most luminous and recurring images.
              </p>
              <p>
                In every case, you're not just naming a child "light" — you're connecting them to a verse, a chapter, or a description that has illuminated hearts for over 1,400 years.
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
                <Link to="/blog/top-30-quranic-names-for-baby-boys-in-2026" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Boy Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Top 30 Quranic Names for Baby Boys in 2026</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 11, 2026</span>
                </Link>
                <Link to="/blog/how-to-choose-an-islamic-name" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent inline-block">Guide</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">How to Choose an Islamic Name — Complete Guide for Parents</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 3, 2026</span>
                </Link>
                <Link to="/blog/modern-arabic-girl-names-that-sound-beautiful" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Modern Arabic Girl Names That Sound Beautiful in English Too</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 28, 2026</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Topic Focus</span><span className="text-text font-bold">Theme of Light (Noor)</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Core Verse Reference</span><span className="text-text font-bold">Surah An-Nur 24:35</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Unisex Names</span><span className="text-text font-bold">Noor, Sana</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Sun vs. Moon Light</span><span className="text-text font-bold">Diya vs. Noor</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Total Names Catalogued</span><span className="text-text font-bold">19 Names</span></li>
              </ul>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Quranic Light</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                In Surah Yunus (10:5), Allah describes the sun as a <em className="text-text font-bold">Diya</em> (source of brilliant light) and the moon as a <em className="text-text font-bold">Noor</em> (reflected light), highlighting the scientific and poetic precision of Arabic root words.
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

export default NamesMeaningLightArticle;
