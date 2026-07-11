import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const TheNameIbrahimArticle = () => {
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
        'man',
        'title',
        'father',
        'sacrifice',
        'namesake',
        'famous',
        'faiths',
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
    const text = 'The Name Ibrahim — Meaning, History, and Why It Matters';
    
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
    { id: 'man', label: 'The Man Behind the Name' },
    { id: 'title', label: 'His Title: Khalilullah' },
    { id: 'father', label: 'Father of the Prophets' },
    { id: 'sacrifice', label: 'The Trial of Sacrifice' },
    { id: 'namesake', label: "Ibrahim ibn Muhammad ﷺ" },
    { id: 'famous', label: 'Famous Men Named Ibrahim' },
    { id: 'faiths', label: 'The Name Across Faiths' },
    { id: 'pairing', label: 'Pairing the Name' },
    { id: 'conclusion', label: 'Final Thoughts' },
  ];

  return (
    <>
      <Helmet>
        <title>The Name Ibrahim — Meaning, History, and Why It Matters — IslamicNames</title>
        <meta name="description" content="Explore the deep meaning, linguistic roots, historical significance, and legacy of the name Ibrahim — Khalilullah, builder of the Kaaba, and father of the prophets." />
        <meta name="keywords" content="Ibrahim meaning, Ibrahim name, Islamic names, Muslim boy names, Arabic name Ibrahim, Abraham Islam, Khalilullah, father of prophets" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.islamicnames.in/blog/the-name-ibrahim-meaning-history" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.islamicnames.in/blog/the-name-ibrahim-meaning-history" />
        <meta property="og:title" content="The Name Ibrahim — Meaning, History, and Why It Matters — IslamicNames" />
        <meta property="og:description" content="Explore the deep meaning, linguistic roots, historical significance, and legacy of the name Ibrahim — Khalilullah, builder of the Kaaba, and father of the prophets." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/blog/the-name-ibrahim-meaning-history" />
        <meta name="twitter:title" content="The Name Ibrahim — Meaning, History, and Why It Matters — IslamicNames" />
        <meta name="twitter:description" content="Explore the deep meaning, linguistic roots, historical significance, and legacy of the name Ibrahim — Khalilullah, builder of the Kaaba, and father of the prophets." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* JSON-LD Article Structured Data */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Name Ibrahim — Meaning, History, and Why It Matters — IslamicNames",
  "description": "Explore the deep meaning, linguistic roots, historical significance, and legacy of the name Ibrahim — Khalilullah, builder of the Kaaba, and father of the prophets.",
  "image": "https://www.islamicnames.in/og-image.png",
  "datePublished": "2026-07-11",
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
    "@id": "https://www.islamicnames.in/blog/the-name-ibrahim-meaning-history"
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
              { "@type": "ListItem", "position": 3, "name": "The Name Ibrahim: Meaning & History", "item": "https://www.islamicnames.in/blog/the-name-ibrahim-meaning-history" }
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
            <span className="text-text">Ibrahim Legacy</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Boy Names · Names of the Prophets
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              The Name Ibrahim — Meaning, History, and Why It Matters
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              Few men in human history are claimed as a father by three entire religions at once. Ibrahim is one of them — Khalil of Allah, builder of the Kaaba, and the man whose complete submission to God is re-enacted by over a billion Muslims every year at Eid al-Adha.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> July 11, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 7 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 1,200 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#3A2A0A] via-[#6B4F1A] to-[#8A6A2A] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            إبراهيم
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            إبراهيم خليل الله
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <p>
              Jews call him Abraham, father of Isaac and the Israelite line. Christians call him Abraham, the model of faith. Muslims call him Ibrahim — Khalil of Allah, builder of the Kaaba, and the man whose complete submission to God is re-enacted by over a billion Muslims every year at Eid al-Adha.
            </p>

            <p>
              This article traces the meaning of the name Ibrahim, its history across languages and faiths, the extraordinary trials of Ibrahim (AS), and why it remains one of the most enduring names given to Muslim boys today.
            </p>

            {/* Meaning of the Name */}
            <section id="meaning" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Meaning of the Name Ibrahim
              </h2>
              <p>
                Unlike many Arabic names, Ibrahim (إبراهيم) does not come from a native Arabic triliteral root — it entered Arabic from older Semitic languages, most likely Aramaic or ancient Hebrew, long before Islam. Because of this, scholars have carried forward a few interpretations side by side rather than a single fixed meaning:
              </p>
              
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h3 className="font-bold text-text text-sm md:text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-black">1</span>
                    Father of Many Nations
                  </h3>
                  <p className="text-xs md:text-sm mt-1">
                    The most widely cited interpretation, echoing the promise that his descendants — through both Ismail and Ishaq — would spread across the earth as founders of nations and lines of prophets.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h3 className="font-bold text-text text-sm md:text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-black">2</span>
                    Exalted Father
                  </h3>
                  <p className="text-xs md:text-sm mt-1">
                    An older, shorter form of the name (corresponding to &ldquo;Abram&rdquo; before &ldquo;Abraham&rdquo; in the Hebrew tradition) is understood to mean a father held in high esteem.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h3 className="font-bold text-text text-sm md:text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-black">3</span>
                    Compassionate Father
                  </h3>
                  <p className="text-xs md:text-sm mt-1">
                    Some scholars connect the name to the tenderness Ibrahim (AS) showed throughout his life — toward his son, toward strangers he hosted, and even toward his own father, whom he never stopped gently inviting to the truth.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-card to-primary/5 border border-border p-5 rounded-2xl text-xs md:text-sm leading-relaxed space-y-2 mt-4">
                <span className="text-primary font-black block flex items-center gap-1.5">
                  <Info size={16} /> Theological Context:
                </span>
                <p>
                  The Quran itself doesn&apos;t dwell on etymology — it dwells on character. Ibrahim (AS) is described in Surah An-Nahl as &ldquo;a nation unto himself,&rdquo; a man whose devotion was so complete that his name became less about its literal roots and more about what it came to represent: total submission to God.
                </p>
              </div>
            </section>

            {/* Linguistic Root and Variants */}
            <section id="linguistic" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Linguistic Roots &amp; Variants Across Cultures
              </h2>
              <p>
                Because the name predates Arabic, it has been adapted into virtually every language family that the Abrahamic faiths have touched. Here are the major regional variants:
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
                      <td className="py-3 px-4 font-bold text-text">Ibrahim</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Qur&apos;anic Arabic form</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">The spelling used throughout the Quran; standard across the Arab world, Turkey, and South Asia.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Abraham</td>
                      <td className="py-3 px-4 text-text-muted text-xs">English-speaking world</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">The universally recognised English form, shared with the Jewish and Christian traditions.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">İbrahim</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Turkey</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">Retains the Quranic spelling closely, one of the most enduringly popular names in Turkish history.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Ibraheem</td>
                      <td className="py-3 px-4 text-text-muted text-xs">South Asia</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">A common transliteration variant across Pakistan, India, and Bangladesh.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Ebrahim</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Iran &amp; Persian-speaking regions</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">The Persian rendering, widely used across Iran and Afghanistan.</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Ibrahima</td>
                      <td className="py-3 px-4 text-text-muted text-xs">West Africa</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">Popular across Senegal, Guinea, and Mali, often shortened affectionately to &ldquo;Ibra.&rdquo;</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-text">Avraham</td>
                      <td className="py-3 px-4 text-text-muted text-xs">Hebrew, Jewish tradition</td>
                      <td className="py-3 px-4 text-text-muted text-xs md:text-sm">The original Hebrew form, foundational to Jewish identity as father of the covenant.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* The Man Behind the Name */}
            <section id="man" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Man Behind the Name — Ibrahim (AS)
              </h2>
              <p>
                To understand why this name carries such weight, you have to know the life behind it — a life defined almost entirely by trial after trial, each one met with unwavering submission.
              </p>
              <p>
                Ibrahim (AS) was born into a family and society steeped in idol worship. His own father, Azar, carved idols for a living. From a young age, Ibrahim questioned what everyone around him accepted without thought — how could something carved by human hands deserve worship? The Quran describes him gently reasoning with his father, calling him &ldquo;O my father&rdquo; with tenderness even while rejecting everything his father stood for.
              </p>
              <p>
                His defiance eventually became action. While the town was away at a festival, Ibrahim (AS) broke every idol in the temple but the largest one, hanging his axe on it so the blame would fall unmistakably on the idols&apos; own uselessness — if they were gods, surely they could have defended themselves. When his people confronted him in fury, he asked them plainly to question the idol itself. Unable to answer, they turned to the only response available to them: force.
              </p>
              
              <div className="bg-card border-l-4 border-accent p-5 rounded-r-xl my-4 text-xs md:text-sm leading-relaxed space-y-2">
                <span className="font-bold text-accent block">A Trial by Fire:</span>
                <p className="italic">
                  &ldquo;They built an enormous pyre and cast Ibrahim (AS) into it, certain the flames would end his defiance. Instead, the Quran records Allah&apos;s command directly to the fire itself — &lsquo;O fire, be coolness and safety upon Ibrahim&rsquo; (Surah Al-Anbiya, 21:69). He walked out unharmed, and the trial that was meant to break him instead became one of the most famous demonstrations of divine protection in the entire Quran.&rdquo;
                </p>
              </div>

              <p>
                This quality defined him throughout his life. Every test, every loss, every impossible command — met the same way: complete, unwavering submission.
              </p>
            </section>

            {/* His Title — Khalilullah */}
            <section id="title" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                His Title — Khalilullah, the Friend of Allah
              </h2>
              <p>
                Of every prophet mentioned in the Quran, only Ibrahim (AS) is given this specific title: <strong>Khalilullah</strong> — the intimate friend of Allah. The Quran states it directly:
              </p>

              <div className="bg-card border border-border p-5 rounded-2xl space-y-4 my-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <BookOpen size={16} /> Quranic Reference
                </div>
                <blockquote className="border-l-2 border-primary pl-4 text-xs md:text-sm italic leading-relaxed text-text">
                  &ldquo;And Allah took Ibrahim as a khalil (an intimate friend).&rdquo; — Surah An-Nisa, 4:125
                </blockquote>
              </div>

              <p>
                <em>Khalil</em> is a deeper word than ordinary friendship — it describes a love that has penetrated entirely through a person, leaving no part of them untouched by it. No other prophet, not even Musa (AS), who spoke directly to Allah, is given this exact title in the Quran.
              </p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Khalil (خليل)</strong> — an intimate, devoted friend; one whose love permeates every fibre of their being.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Khalilullah (خليل الله)</strong> — the Friend of Allah; a title unique to Ibrahim (AS) among all of creation.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Abul Anbiya (أبو الأنبياء)</strong> — the Father of the Prophets; nearly every prophet after him descends from his line.
                  </div>
                </li>
              </ul>
            </section>

            {/* Father of the Prophets — Building the Kaaba */}
            <section id="father" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Father of the Prophets — Building the Kaaba
              </h2>
              <p>
                Ibrahim (AS) had two sons through two wives: Ismail, born to Hajar, and Ishaq, born to Sarah in her old age after decades of waiting. Nearly every prophet who came after Ibrahim (AS) — including Musa, Dawud, Isa, and finally Muhammad ﷺ — descends from one of these two sons, which is why he is so often called <strong>Abul Anbiya</strong>, the Father of the Prophets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h4 className="font-bold text-text text-sm">Ismail (AS)</h4>
                  <p className="text-xs text-text-muted mt-1">
                    Born to Hajar. Ancestor of the Arab nations and of Prophet Muhammad ﷺ. Settled in Makkah and helped his father raise the Kaaba.
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                  <h4 className="font-bold text-text text-sm">Ishaq (AS)</h4>
                  <p className="text-xs text-text-muted mt-1">
                    Born to Sarah in her old age. Father of Yaqub (Jacob), from whose twelve sons came the Israelite line and nearly every prophet of the Torah.
                  </p>
                </div>
              </div>

              <p className="mt-4">
                It was alongside Ismail that Ibrahim (AS) completed one of his most enduring acts: raising the foundations of the Kaaba in Makkah. The Quran preserves their prayer together as they worked, brick by brick:
              </p>

              <div className="bg-card border border-border p-5 rounded-2xl space-y-4 my-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <BookOpen size={16} /> Quranic Reference
                </div>
                <blockquote className="border-l-2 border-primary pl-4 text-xs md:text-sm italic leading-relaxed text-text">
                  &ldquo;Our Lord, accept this from us. Indeed You are the Hearing, the Knowing.&rdquo; — Surah Al-Baqarah, 2:127
                </blockquote>
              </div>

              <p>
                A father and son building the house that Muslims would face in prayer for the rest of human history, asking for nothing more than that their effort be accepted.
              </p>
            </section>

            {/* The Trial of Sacrifice */}
            <section id="sacrifice" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Trial of Sacrifice — The Story Behind Eid al-Adha
              </h2>
              <p>
                The defining test of Ibrahim&apos;s (AS) life came in a dream. He saw himself sacrificing his beloved son — and understood a vision given to a prophet to be a command from Allah. Rather than concealing it, he brought it to his son directly and asked what he thought.
              </p>

              <div className="bg-card border-l-4 border-accent p-5 rounded-r-xl my-4 text-xs md:text-sm leading-relaxed space-y-2">
                <span className="font-bold text-accent block">A Son&apos;s Answer:</span>
                <p className="italic">
                  According to the Quran, the son did not hesitate. &ldquo;O my father, do what you are commanded. You will find me, if Allah wills, among the steadfast.&rdquo; (Surah As-Saffat, 37:102). Both father and son submitted completely — and at the final moment, Allah stopped Ibrahim&apos;s (AS) hand and ransomed the boy with a great sacrifice instead.
                </p>
              </div>

              <p>
                This moment is re-enacted by Muslims worldwide every year during <strong>Eid al-Adha</strong>, when families sacrifice an animal and distribute the meat to those in need — a yearly reminder that the name Ibrahim carries not just history, but a living tradition still practiced today.
              </p>
            </section>

            {/* A Father's Namesake */}
            <section id="namesake" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                A Father&apos;s Namesake — Ibrahim ibn Muhammad ﷺ
              </h2>
              <p>
                One detail often overlooked: Prophet Muhammad ﷺ himself had a son named Ibrahim, born to Maria al-Qibtiyya. The child died in infancy, and it is recorded in Sahih al-Bukhari that on the day he passed, a solar eclipse occurred, leading some to say it happened out of grief for the Prophet&apos;s ﷺ loss.
              </p>
              <p>
                The Prophet ﷺ corrected this immediately, saying the sun and moon do not eclipse for anyone&apos;s death. It&apos;s a quiet, human detail — that even the final Prophet ﷺ chose this name for his own son.
              </p>
            </section>

            {/* Famous Men Named Ibrahim */}
            <section id="famous" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Famous Men Named Ibrahim
              </h2>
              <p>
                The name has been carried by remarkable figures across Islamic history and into the modern world:
              </p>
              
              <div className="space-y-4 mt-2">
                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Ibrahim ibn Adham</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">8th Century · Balkh</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    Born a prince of Balkh (in modern Afghanistan), he famously renounced his throne after a moment of spiritual awakening during a hunting trip, becoming one of early Islam&apos;s most revered ascetics and a foundational figure in Sufi tradition.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Ibrahim al-Fazari</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">8th Century · Astronomer</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    One of the earliest Muslim astronomers, credited with building the first astrolabe in the Islamic world and translating major astronomical works from Sanskrit into Arabic during the Abbasid era.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Ibrahim Pasha of Egypt</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">19th Century · Military Leader</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    Son of Muhammad Ali Pasha and a brilliant military commander who expanded Egyptian influence across the Levant and modernised much of the Ottoman province during the early 1800s.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-bold text-text text-base">Zlatan Ibrahimović</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Modern Era · Football</span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    One of football&apos;s greatest strikers. His surname literally means &ldquo;son of Ibrahim,&rdquo; tracing back to his Bosnian Muslim heritage — a reminder that the name has travelled well beyond the traditional Muslim world.
                  </p>
                </div>
              </div>
            </section>

            {/* The Name Across Faiths */}
            <section id="faiths" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Name Across Faiths and Cultures
              </h2>
              <p>
                Perhaps no name illustrates shared Abrahamic heritage more clearly than this one. Ibrahim is Abraham to Jews and Christians alike — the man both traditions call the father of monotheistic faith.
              </p>
              <ul className="space-y-3 pl-2 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Judaism:</strong> Avraham is the patriarch of the Jewish people, the man who entered into a covenant with God and was promised that his descendants through Isaac would become a great nation.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Christianity:</strong> Abraham is called the &ldquo;father of faith&rdquo; — his willingness to trust God&apos;s promises is held up as the model of belief in the New Testament.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <strong className="text-text">Islam:</strong> Ibrahim is the Khalil of Allah, the builder of the Kaaba, and a <em>hanif</em> — one who submitted purely to God before Judaism or Christianity existed in their later forms (Surah Ali &lsquo;Imran, 3:67).
                  </div>
                </li>
              </ul>
              <p className="mt-2">
                The Quran itself addresses this directly, describing Ibrahim (AS) as belonging to no single later religion but as a hanif who submitted purely to God. It is a name that, in a real sense, three faiths trace their spiritual ancestry back to.
              </p>
            </section>

            {/* Pairing the Name Ibrahim */}
            <section id="pairing" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Pairing the Name Ibrahim
              </h2>
              <p>
                Ibrahim pairs naturally with other strong, meaningful names. Popular combinations include:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Ibrahim Ismail</span>
                    <p className="text-xs text-text-muted">Honouring both Ibrahim (AS) and the son who helped him build the Kaaba.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Muhammad Ibrahim</span>
                    <p className="text-xs text-text-muted">Combining the name of the final Prophet ﷺ with the friend of Allah.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Ibrahim Khalil</span>
                    <p className="text-xs text-text-muted">Letting the name double as a tribute to the very title Allah gave him.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Ibrahim Yusuf</span>
                    <p className="text-xs text-text-muted">Pairing two prophetic names — the friend of Allah and the beautiful one.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl sm:col-span-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Ahmad Ibrahim</span>
                    <p className="text-xs text-text-muted">Another name of the Prophet ﷺ paired with his great ancestor — a strong, reverent combination.</p>
                  </div>
                </div>
              </div>

              <p className="mt-4">
                Many families choose to pair it with Khalil directly, letting the name double as a quiet tribute to the very title Allah gave him.
              </p>
            </section>

            {/* Final Thoughts */}
            <section id="conclusion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Final Thoughts
              </h2>
              <p>
                Ibrahim is not simply a name passed down through generations — it is a name built entirely out of trial. A father who defied his own people, walked out of fire unharmed, waited decades for a son, and then submitted to sacrificing that very son without hesitation. Every trial met the same way: complete, unwavering submission.
              </p>
              <p>
                To name a son Ibrahim is to hand him a legacy older than Islam itself — a legacy shared by three religions, sealed by the Kaaba he built with his own hands, and still lived out every year at Eid al-Adha. It is a name that has mattered for thousands of years, and it isn&apos;t going anywhere.
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
                <Link to="/blog/names-of-the-prophets-in-islam" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E3EEF9] text-[#1A4F8A] inline-block">Boy Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Names of the Prophets in Islam — Meanings and Stories</h4>
                  <span className="text-[9px] text-text-muted block">📅 April 28, 2026</span>
                </Link>
                <Link to="/blog/the-name-fatima-meaning-history" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">The Name Fatima — Meaning, History, and Why It Matters</h4>
                  <span className="text-[9px] text-text-muted block">📅 April 20, 2026</span>
                </Link>
                <Link to="/blog/top-30-quranic-names-for-baby-boys-in-2026" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] inline-block">Quranic Names</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Topic</span><span className="text-text font-bold">The Name Ibrahim</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Arabic Script</span><span className="text-text font-bold font-arabic text-sm">إبراهيم</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Meaning</span><span className="text-text font-bold">Father of many nations</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Unique Title</span><span className="text-text font-bold">Khalilullah (خليل الله)</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Quranic Surah</span><span className="text-text font-bold">Surah 14 — Ibrahim</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Sons</span><span className="text-text font-bold">Ismail & Ishaq (AS)</span></li>
              </ul>
            </div>

            {/* Hadith / Quran Quote Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Quranic Verse</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                <em className="text-text">&ldquo;Indeed, Ibrahim was a nation unto himself, devoutly obedient to Allah, inclining toward truth, and he was not of those who associate others with Allah.&rdquo;</em> — Surah An-Nahl, 16:120
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

export default TheNameIbrahimArticle;
