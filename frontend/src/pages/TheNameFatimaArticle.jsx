import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const TheNameFatimaArticle = () => {
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
        'meaning',
        'linguistic',
        'woman',
        'title',
        'relationship',
        'marriage',
        'famous',
        'cultures',
        'pairing',
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
    const text = 'The Name Fatima — Meaning, History, and Why It Matters';
    
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
    { id: 'meaning', label: 'Meaning of the Name' },
    { id: 'linguistic', label: 'Linguistic Roots & Variants' },
    { id: 'woman', label: 'Fatima al-Zahra (RA)' },
    { id: 'title', label: 'Her Title: Al-Zahra' },
    { id: 'relationship', label: 'Relationship with the Prophet ﷺ' },
    { id: 'marriage', label: 'Marriage and Family' },
    { id: 'famous', label: 'Famous Women Named Fatima' },
    { id: 'cultures', label: 'The Name Across Cultures' },
    { id: 'pairing', label: 'Pairing the Name' },
    { id: 'conclusion', label: 'Final Thoughts' },
  ];

  return (
    <>
      <Helmet>
        <title>The Name Fatima — Meaning, History, and Why It Matters — IslamicNames</title>
        <meta
          name="description"
          content="Explore the deep meaning, linguistic roots, historical significance, and legacy of the beloved name Fatima and Fatima al-Zahra (RA)."
        />
        <meta name="keywords" content="Fatima meaning, Fatima al-Zahra, Islamic names, Muslim girl names, Arabic name Fatima, Zahra meaning, Ahl al-Bayt" />
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
            <span className="text-text">Fatima Legacy</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Featured Article · Legacy
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              The Name Fatima — Meaning, History, and Why It Matters
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              There are names that are simply names. And then there are names that carry entire worlds within them — names that hold history, love, faith, grief, and honour all at once. Fatima is one of those names.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> April 20, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 5 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 12,800 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#5A1A2A] via-[#7D2235] to-[#A0304A] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            فاطمة
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            فاطمة الزهراء
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <p>
              It is one of the most widely used names in the Muslim world. From Morocco to Malaysia, from Turkey to Pakistan, from Nigeria to Indonesia, you will find women named Fatima in every generation and in every corner of the earth where Islam has taken root. It is a name that has never gone out of style, never felt ordinary, and never lost its meaning. For Muslims, it is deeply personal — because the woman who bore this name first was not just a historical figure. She was the beloved daughter of the Prophet Muhammad ﷺ, and her story touches the heart of every Muslim who knows it.
            </p>

            <p>
              This article explores the meaning of the name Fatima, its linguistic roots, its history, the remarkable life of Fatima al-Zahra (RA), and why this name continues to matter so deeply to Muslims across the world.
            </p>

            {/* Meaning of the Name */}
            <section id="meaning" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Meaning of the Name Fatima
              </h2>
              <p>
                The name Fatima (فاطمة) comes from the Arabic root <em>fatama</em> (ف-ط-م), which means to wean — specifically, to wean a child from milk. More broadly, the root carries the meaning of to separate, to cut off, or to abstain from something.
              </p>
              <p>
                From this root, the name Fatima takes on a deeper interpretive meaning that scholars have unpacked over centuries:
              </p>
              
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h3 className="font-bold text-text text-sm md:text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-black">1</span>
                    One who weans or separates
                  </h3>
                  <p className="text-xs md:text-sm mt-1">
                    In the most literal sense, Fatima is one who weans a child — a name historically associated with motherhood and nurturing.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h3 className="font-bold text-text text-sm md:text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-black">2</span>
                    One who is weaned or protected from evil
                  </h3>
                  <p className="text-xs md:text-sm mt-1">
                    Many scholars interpret the name as carrying the meaning of one who has been cut off from evil, fire, or harm. In this sense it becomes a name of divine protection — one whom Allah has separated from what is harmful.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h3 className="font-bold text-text text-sm md:text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-black">3</span>
                    One who abstains
                  </h3>
                  <p className="text-xs md:text-sm mt-1">
                    Some scholars explain the name as one who abstains from what is forbidden — a name of moral purity and restraint.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-card to-primary/5 border border-border p-5 rounded-2xl text-xs md:text-sm leading-relaxed space-y-2 mt-4">
                <span className="text-primary font-black block flex items-center gap-1.5">
                  <Info size={16} /> Theological Context:
                </span>
                <p>
                  The most commonly cited interpretation in Islamic tradition is that Fatima means one who is protected from the fire of Hell — a meaning reinforced by the authentic hadith in which the Prophet ﷺ said that his daughter Fatima and her descendants would be protected from the fire because of their connection to him and their faith. This interpretation has made the name feel like a blessing and a prayer in one.
                </p>
              </div>
            </section>

            {/* Linguistic Root and Variants */}
            <section id="linguistic" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Linguistic Root and Variants
              </h2>
              <p>
                The Arabic root <strong>F-T-M (ف-ط-م)</strong> gives rise to several related words:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2 text-xs md:text-sm">
                <li><strong>Fatm</strong> — the act of weaning or separating.</li>
                <li><strong>Fatiim</strong> — a child who has been weaned.</li>
                <li><strong>Fatoom</strong> — an informal affectionate form used in some Arab dialects.</li>
              </ul>
              <p>
                As the name traveled around the globe, variant spellings and regional forms emerged, adapting to local phonetics while preserving the original Arabic meaning:
              </p>

              {/* Variant Spellings Table */}
              <div className="overflow-x-auto border border-border rounded-xl bg-card/50 my-6">
                <table className="w-full min-w-[500px] text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-card border-b border-border/80">
                      <th className="py-3 px-4 font-bold text-text text-xs uppercase w-32">Variant</th>
                      <th className="py-3 px-4 font-bold text-text text-xs uppercase w-48">Regional Usage</th>
                      <th className="py-3 px-4 font-bold text-text-muted text-xs uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Fatimah</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Classical Arabic</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">Classically correct transliteration, reflecting the final <em>ha</em> (ة) of the Arabic feminine ending.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Fatima</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Global / International</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">The most widely used international spelling across South Asia, Turkey, the Arab world, and the West.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Fatouma / Fatoumata</td>
                      <td className="py-3 px-4 text-text-muted text-xs">West Africa</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">Popular in Senegal, Guinea, Mali, and surrounding countries, where it is among the most common female names.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Fatma</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Turkey & Egypt</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">Used widely in Turkey, Egypt, North Africa, and the Balkans. It has a shorter, more informal quality.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Fatemeh</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Iran & Central Asia</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">The Persian form of the name, widely used in Iran and among Persian-speaking communities.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* The Woman Behind the Name */}
            <section id="woman" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Woman Behind the Name — Fatima al-Zahra (RA)
              </h2>
              <p>
                To understand why this name matters so deeply, you have to know the woman who made it immortal.
              </p>
              <p>
                Fatima bint Muhammad (RA) was born in Makkah, most likely around the fifth year before the Hijra, though scholars differ on the exact date. She was the youngest daughter of the Prophet Muhammad ﷺ and his beloved first wife Khadijah bint Khuwaylid (RA). She had older sisters — Zaynab, Ruqayyah, and Umm Kulthum — but Fatima (RA) was the one who would outlive them all, and the one who would become uniquely tied to the Prophet's ﷺ legacy.
              </p>
              <p>
                She grew up witnessing everything. She saw the early persecution of the Muslims in Makkah. She saw her mother Khadijah — her first source of love and strength — die when Fatima was still young. She saw her father face mockery, threats, and physical harm.
              </p>
              
              <div className="bg-card border-l-4 border-accent p-5 rounded-r-xl my-4 text-xs md:text-sm leading-relaxed space-y-2">
                <span className="font-bold text-accent block">A Story of Courage:</span>
                <p className="italic">
                  "There is a famous narration that when the enemies of Islam poured the entrails of a slaughtered animal on the Prophet ﷺ while he was in sujud (prostration), it was Fatima (RA) who came running, removed the filth from her father's back, and wept with fury and love. She was a child then — and yet she stood."
                </p>
              </div>

              <p>
                This quality defined her throughout her life. She stood — for her father, for truth, for her family, and for her faith.
              </p>
            </section>

            {/* Her Title — Al-Zahra */}
            <section id="title" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Her Title — Al-Zahra
              </h2>
              <p>
                Fatima (RA) is known by the title <strong>al-Zahra (الزهراء)</strong> — the radiant one, the luminous, the one who shines. This title speaks of a spiritual brightness — a purity and luminosity of character that those around her recognised and honoured.
              </p>
              <p>
                She is also referred to by other honourable titles:
              </p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Al-Batul</strong> — the pure, the chaste, the one devoted entirely to worship.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Sayyidat Nisa al-Alamin</strong> — the Leader of the Women of All the Worlds. This is taken from the authentic hadith of the Prophet ﷺ who said: <em>"Fatima is the leader of the women of Paradise."</em> (Bukhari)
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Al-Muhaddatha</strong> — one to whom the angels speak. Some scholars have applied this title to her based on narrations of her spiritual closeness.
                  </div>
                </li>
              </ul>
            </section>

            {/* Relationship With the Prophet */}
            <section id="relationship" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Her Relationship With the Prophet ﷺ
              </h2>
              <p>
                The relationship between the Prophet Muhammad ﷺ and his daughter Fatima (RA) is one of the most tender and moving in Islamic history. It is preserved in authentic hadith that show us a father and daughter bound by the deepest love.
              </p>
              
              <div className="bg-card border border-border p-5 rounded-2xl space-y-4 my-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <BookOpen size={16} /> Hadith References
                </div>
                <blockquote className="border-l-2 border-primary pl-4 text-xs md:text-sm italic leading-relaxed text-text">
                  The Prophet ﷺ said: "Fatima is a part of me. Whoever angers her angers me, and whoever pleases her pleases me." (Bukhari)
                </blockquote>
                <blockquote className="border-l-2 border-primary pl-4 text-xs md:text-sm italic leading-relaxed text-text">
                  He said: "Fatima is the leader of the women of the people of Paradise." (Bukhari)
                </blockquote>
              </div>

              <p>
                Whenever Fatima (RA) came to visit the Prophet ﷺ, he would stand up to greet her, kiss her forehead, and seat her in his own place. And whenever he travelled, she was the last person he bid farewell to, and the first he visited upon returning. This was not merely sentiment — it was a deliberate public demonstration of his love and respect for her.
              </p>
              <p>
                In the final days of his life, the Prophet ﷺ called Fatima (RA) close and whispered something to her that made her weep. Then he whispered again, and she smiled. After his passing, she revealed what he had said: first, that he would die during that illness — which made her cry. Then, that she would be the first of his family to follow him — which made her smile, because it meant she would see him again soon.
              </p>
              <p className="font-semibold text-text">
                That smile through tears is one of the most affecting images in Islamic history.
              </p>
            </section>

            {/* Marriage to Ali ibn Abi Talib */}
            <section id="marriage" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Her Marriage to Ali ibn Abi Talib (RA)
              </h2>
              <p>
                Fatima (RA) married Ali ibn Abi Talib (RA) — the cousin of the Prophet ﷺ and one of the earliest and most devoted Muslims. Their marriage was simple by worldly standards but immense in spiritual significance. The Prophet ﷺ himself conducted the nikah, and their wedding was famously modest — a reflection of their shared indifference to the material world.
              </p>
              <p>
                Together they had four children whose names became central to Islamic history:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h4 className="font-bold text-text text-sm">Hasan ibn Ali (RA)</h4>
                  <p className="text-xs text-text-muted mt-1">
                    The elder grandson of the Prophet ﷺ, known for his wisdom, peace-making, and noble character.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h4 className="font-bold text-text text-sm">Husayn ibn Ali (RA)</h4>
                  <p className="text-xs text-text-muted mt-1">
                    The younger grandson, whose martyrdom at Karbala is one of the most significant events in Islamic history.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h4 className="font-bold text-text text-sm">Zaynab bint Ali (RA)</h4>
                  <p className="text-xs text-text-muted mt-1">
                    A woman of extraordinary courage, strength, and eloquence, who stood firm in the face of tyranny.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h4 className="font-bold text-text text-sm">Umm Kulthum bint Ali (RA)</h4>
                  <p className="text-xs text-text-muted mt-1">
                    Named after her maternal aunt, she carried the family's legacy of devotion and piety.
                  </p>
                </div>
              </div>

              <p className="mt-4">
                Hasan and Husayn (RA) are described in the Prophet's own words: <em>"Hasan and Husayn are the leaders of the youth of Paradise."</em> (Tirmidhi) The Prophet ﷺ loved them with a visible, demonstrative, and joyful love — carrying them on his shoulders, playing with them, and allowing them to climb on his back while he was in sujud.
              </p>
              <p>
                The family of Fatima (RA) — known as the <strong>Ahl al-Bayt</strong> (People of the House) — holds a special sanctified place in Islamic tradition. The Prophet ﷺ commanded love and respect for them, and their names have been carried forward through generations as symbols of devotion, courage, and faith.
              </p>
            </section>

            {/* Famous Women Named Fatima Throughout History */}
            <section id="famous" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Famous Women Named Fatima Throughout History
              </h2>
              <p>
                The name Fatima has been borne by remarkable women across Islamic history who have left an indelible mark on scholarship, education, spirituality, and social change:
              </p>
              
              <div className="space-y-4 mt-2">
                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Fatima al-Fihri</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">9th Century · Morocco</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    A visionary Muslim woman who founded the <strong>University of al-Qarawiyyin</strong> in Fez in 859 CE. Widely recognized by UNESCO and the Guinness World Records as the oldest continuously operating university in the world, her contribution to global education and Islamic scholarship is extraordinary.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Fatima bint Muhammad</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Early Islam</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    Multiple women across the early Muslim community bore this name in honor of the Prophet's ﷺ daughter, cementing it as a beacon of high character and spiritual beauty.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Fatima of Nishapur</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Sufi Scholar</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    An early female Sufi mystic, scholar, and teacher. She was spoken of with immense respect by major scholars of her era, including Dhul-Nun al-Misri and Bayazid Bastami, who considered her an authority on spiritual knowledge.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Fatima Jinnah</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Independence Leader</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    The sister of Pakistan's founder Muhammad Ali Jinnah. Revered as <em>Madar-e-Millat</em> (Mother of the Nation), she was a leading figure in the Pakistani independence movement and an advocate for women's political empowerment.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Fatima Mernissi</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Sociologist & Scholar</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    A pioneering Moroccan sociologist, writer, and Islamic scholar. Her intellectual work analyzing women's roles in Islamic history and modern society was highly influential worldwide.
                  </p>
                </div>
              </div>

              <p className="pt-2">
                Throughout history and across continents, the name has consistently been borne by women of substance, intellect, courage, and faith.
              </p>
            </section>

            {/* The Name Across Cultures */}
            <section id="cultures" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Name Across Cultures
              </h2>
              <p>
                One of the remarkable things about the name Fatima is how deeply it has embedded itself across entirely different cultures while retaining its core identity:
              </p>
              <ul className="space-y-3 pl-2 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">North Africa:</strong> In Morocco, Algeria, Tunisia, and Libya, Fatima and Fatma are among the most common women's names across all generations.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Turkey & Balkans:</strong> In Turkey, Fatma has been consistently one of the most popular women's names for centuries, retaining its strong presence even through periods of secular cultural change.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">West Africa:</strong> Particularly in Senegal, Guinea, Mali, and Gambia, Fatouma and Fatoumata are beloved forms of the name, reflecting the deep Islamic tradition of the Sahel region.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Iran & Afghanistan:</strong> Fatemeh is used with the same reverence, deeply tied to Shia Islamic tradition and love for the Prophet's family.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">South Asia:</strong> In Pakistan, India, and Bangladesh, Fatima is used both as a standalone name and as part of compound names.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Southeast Asia:</strong> In Indonesia and Malaysia, Fatimah is a classic and respected name, often paired with other Malay or Arabic names.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Western World:</strong> Muslim families continue to choose Fatima for their daughters as a name that travels across cultures — easily pronounced, immediately recognisable, and carrying an unmistakable identity.
                  </div>
                </li>
              </ul>
            </section>

            {/* Pairing the Name Fatima */}
            <section id="pairing" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Pairing the Name Fatima
              </h2>
              <p>
                Many families choose to pair Fatima with a second name, creating a full name that is both meaningful and beautiful. Common pairings include:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Fatima Zahra</span>
                    <p className="text-xs text-text-muted">Directly honouring the title of the Prophet's daughter, meaning the radiant Fatima.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Fatima Noor</span>
                    <p className="text-xs text-text-muted">Combining Fatima with Noor (light), meaning the luminous protected one.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Fatima Zainab</span>
                    <p className="text-xs text-text-muted">Honouring both Fatima (RA) and her courageous daughter Zaynab (RA).</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Fatima Hana</span>
                    <p className="text-xs text-text-muted">Pairing the classic name with Hana (happiness or bliss) for a modern touch.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl sm:col-span-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Fatima Rida</span>
                    <p className="text-xs text-text-muted">Meaning the Fatima of contentment or divine pleasure.</p>
                  </div>
                </div>
              </div>

              <p className="mt-4">
                Any pairing that carries a good meaning sits beautifully alongside Fatima, and many families find that giving the full two-part name provides both a formal name and an everyday shortened version.
              </p>
            </section>

            {/* Final Thoughts */}
            <section id="conclusion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Final Thoughts
              </h2>
              <p>
                The name Fatima is not simply a popular name. It is a name weighted with meaning — linguistic, historical, spiritual, and personal. It connects the child who bears it to one of the most beloved women in Islamic history, to the household of the Prophet ﷺ, and to a tradition of Muslim women who have carried it with grace across fourteen centuries.
              </p>
              <p>
                To name a daughter Fatima is to make a statement about what you value — faith, purity, resilience, simplicity, and love. It is to offer her a name she can grow into, a story she can learn from, and an identity she can be proud of for her entire life. It is the story not of a distant, untouchable legend, but of a woman who ground flour, raised children, grieved publicly, stood firm in adversity, and worshipped her Lord with everything she had.
              </p>
              <p>
                It is a name that has mattered for over fourteen hundred years. It will continue to matter for as long as Muslims walk this earth and love the Prophet ﷺ and his family.
              </p>

              <div className="mt-8 pt-6 border-t border-border/40 text-center">
                <p className="text-sm text-text-muted">
                  Discover more names from Islamic history — their meanings, origins, and stories — at <Link to="/" className="text-primary hover:underline font-bold">IslamicNames.in</Link>.
                </p>
              </div>
            </section>

            {/* Share Buttons */}
            <div className="flex flex-col gap-4 border-t border-b border-border/40 py-6 mt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Share This Article</span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Share2 size={12} /> WhatsApp
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="px-4 py-2 bg-[#1877F2] hover:bg-[#156bec] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Share2 size={12} /> Facebook
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
                <Link to="/blog/modern-arabic-girl-names-that-sound-beautiful" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Modern Arabic Girl Names That Sound Beautiful in English</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 28, 2026</span>
                </Link>
                <Link to="/blog/how-to-choose-an-islamic-name" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F0DEB0] text-[#7A5A10] inline-block">Naming Guide</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Topic</span><span className="text-text font-bold">The Name Fatima</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Arabic Script</span><span className="text-text font-bold font-arabic text-sm">فاطمة</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Root Word</span><span className="text-text font-bold">F-T-M (ف-ط-م)</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Meaning</span><span className="text-text font-bold">One who abstains / weans</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Famous Nickname</span><span className="text-text font-bold">Al-Zahra (The Radiant)</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Paradise Title</span><span className="text-text font-bold">Leader of Paradise Women</span></li>
              </ul>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Hadith Quote</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ said: <em className="text-text">"Fatima is a part of me. Whoever angers her angers me, and whoever pleases her pleases me."</em>
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

export default TheNameFatimaArticle;
