import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const CanMuslimsUseNonArabicNamesArticle = () => {
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
        'foundation',
        'scholarly-consensus',
        'universal-religion',
        'what-is-prohibited',
        'permissible-names',
        'non-muslim-names',
        'special-status',
        'practical-guidance',
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
    const text = 'Can Muslims Use Non-Arabic Names? A Scholarly Perspective';
    
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
    { id: 'foundation', label: 'What Does Islam Say?' },
    { id: 'scholarly-consensus', label: 'Scholarly Consensus' },
    { id: 'universal-religion', label: 'Universal Religion' },
    { id: 'what-is-prohibited', label: 'What Is Prohibited?' },
    { id: 'permissible-names', label: 'Permissible Names' },
    { id: 'non-muslim-names', label: 'Western / English Names' },
    { id: 'special-status', label: 'Status of Arabic Names' },
    { id: 'practical-guidance', label: 'Guidance for Parents' },
    { id: 'conclusion', label: 'Conclusion' },
  ];

  return (
    <>
      <Helmet>
        <title>Can Muslims Use Non-Arabic Names? A Scholarly Perspective — IslamicNames</title>
        <meta name="description" content="Does a Muslim name have to be Arabic? Explore classical and contemporary scholarly perspectives on Turkish, Persian, Urdu, and Western names in Islam." />
        <meta name="keywords" content="non-arabic islamic names, is arabic name compulsory in islam, Persian names in Islam, Turkish names in Islam, Western names for Muslims" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.islamicnames.in/blog/can-muslims-use-non-arabic-names" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.islamicnames.in/blog/can-muslims-use-non-arabic-names" />
        <meta property="og:title" content="Can Muslims Use Non-Arabic Names? A Scholarly Perspective — IslamicNames" />
        <meta property="og:description" content="Does a Muslim name have to be Arabic? Explore classical and contemporary scholarly perspectives on Turkish, Persian, Urdu, and Western names in Islam." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/blog/can-muslims-use-non-arabic-names" />
        <meta name="twitter:title" content="Can Muslims Use Non-Arabic Names? A Scholarly Perspective — IslamicNames" />
        <meta name="twitter:description" content="Does a Muslim name have to be Arabic? Explore classical and contemporary scholarly perspectives on Turkish, Persian, Urdu, and Western names in Islam." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* JSON-LD Article Structured Data */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Can Muslims Use Non-Arabic Names? A Scholarly Perspective — IslamicNames",
  "description": "Does a Muslim name have to be Arabic? Explore classical and contemporary scholarly perspectives on Turkish, Persian, Urdu, and Western names in Islam.",
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
    "@id": "https://www.islamicnames.in/blog/can-muslims-use-non-arabic-names"
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
              { "@type": "ListItem", "position": 3, "name": "Can Muslims Use Non-Arabic Names?", "item": "https://www.islamicnames.in/blog/can-muslims-use-non-arabic-names" }
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
            <span className="text-text">Naming Perspective</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Naming Guide · Scholarly Perspective
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              Can Muslims Use Non-Arabic Names? A Scholarly Perspective
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              One of the most common questions asked by Muslim parents around the world — especially those living in non-Arab countries — is this: does my child's name have to be Arabic? Can I give my daughter a Turkish name, or my son a Persian one? What about names from Urdu, Swahili, Malay, or even English? Is there a rule in Islam that restricts names to Arabic only?
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> May 5, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 4 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 4,120 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#1C3A2E] via-[#2B5B46] to-[#3D7A5E] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            دـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            عربي & عجمي
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <p>
              The answer, according to classical Islamic scholarship, is both nuanced and reassuring. Islam does not require Muslims to use Arabic names. What Islam requires is that names carry good, wholesome meanings — and that they do not belong to categories that scholars have identified as prohibited. This article explores what Islamic scholarship actually says about naming, where the boundaries lie, and why this matter is far more flexible than many people assume.
            </p>

            <section id="foundation" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Foundation: What Does Islam Say About Names?
              </h2>
              <p>
                The starting point for any discussion on Islamic naming comes from the Sunnah of the Prophet Muhammad ﷺ. He is reported to have said:
              </p>
              <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 italic text-text bg-card/30 rounded-r-lg px-3">
                "You will be called on the Day of Resurrection by your names and the names of your fathers, so give yourselves good names."
                <cite className="block text-xs font-semibold text-text-muted mt-1 not-italic">— Abu Dawud (Hasan)</cite>
              </blockquote>
              <p>
                This hadith establishes the core Islamic principle around naming: the name should be good. The emphasis is on the quality of the meaning — not on the language the name comes from.
              </p>
              <p>
                The Prophet ﷺ himself changed names that carried bad meanings. He changed the name of a companion named Hazn (meaning rough or difficult) and suggested the name Sahl (meaning easy) instead. He changed Aasiyah (meaning one who disobeys) to Jamilah (meaning beautiful). He changed Harb (war) and similar names that had negative connotations.
              </p>
              <p>
                In none of these cases did the Prophet ﷺ say the name must be in Arabic. The concern was always about the meaning — whether the name reflected something good, noble, or beautiful.
              </p>
            </section>

            <section id="scholarly-consensus" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Scholarly Consensus: Language Is Not the Criterion
              </h2>
              <p>
                Scholars across all four major Sunni schools of thought — Hanafi, Maliki, Shafi'i, and Hanbali — agree that there is no requirement in Islamic law for a Muslim's name to be Arabic.
              </p>
              <p>
                Ibn al-Qayyim al-Jawziyyah, one of the most detailed classical scholars on the topic of names, wrote extensively in his book <em>Tuhfat al-Mawdud bi Ahkam al-Mawlud</em> (A Gift to the Newborn Regarding Islamic Rulings on Children). He discussed categories of names — recommended, permissible, disliked, and prohibited — and his classification is based entirely on meaning and association, not on linguistic origin.
              </p>
              <p>
                Imam al-Nawawi, the great Shafi'i scholar, similarly focused on the moral and spiritual quality of names when discussing their permissibility. He did not restrict good names to Arabic alone.
              </p>
              <p>
                Sheikh Ibn Uthaymeen (Rahimahullah), a prominent contemporary Saudi scholar, was asked directly whether Muslims outside the Arab world could use non-Arabic names. His response was clear: there is nothing wrong with using names from other languages, provided those names do not carry bad meanings or belong to one of the prohibited categories.
              </p>
              <p>
                Sheikh Yusuf al-Qaradawi, in his writings on Islamic culture and identity, also affirmed that Islam is a universal religion and that non-Arabic names are entirely permissible as long as their meanings are good and they do not carry religious or cultural associations that contradict Islamic belief.
              </p>
              <p>
                The scholarly position, therefore, is consistent and clear: the language of the name is irrelevant; the meaning and association of the name is what matters.
              </p>
            </section>

            <section id="universal-religion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                A Universal Religion for a Diverse Ummah
              </h2>
              <p>
                To understand why Islam does not restrict names to Arabic, it helps to remember the nature of the religion itself.
              </p>
              <p>
                Islam spread rapidly beyond the Arabian Peninsula — into Persia, Central Asia, the Indian subcontinent, Southeast Asia, East Africa, and eventually Europe and the Americas. At its peak, the Muslim world stretched from Morocco in the west to Indonesia in the east. The vast majority of Muslims throughout history have not been Arab.
              </p>
              <p>
                Persian Muslims gave their children beautiful Persian names — Shirin, Cyrus, Layla, Darius. Turkish Muslims carried names like Aylin, Yilmaz, and Bulent. South Asian Muslims used Urdu and Sanskrit-rooted names alongside Arabic ones. Malay Muslims used names drawn from Malay tradition. Sub-Saharan African Muslims used Swahili, Hausa, and Wolof names.
              </p>
              <p>
                All of these were Muslims of profound faith. Their non-Arabic names did not make their Islam lesser.
              </p>
              <p>
                The Prophet ﷺ himself had companions from diverse backgrounds — Salman al-Farisi (Salman the Persian), Bilal ibn Rabah (of Ethiopian origin), Suhayb al-Rumi (associated with Byzantine culture). Islam embraced this diversity from its earliest days.
              </p>
            </section>

            <section id="what-is-prohibited" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Categories of Names: What Is Actually Prohibited?
              </h2>
              <p>
                While any language is acceptable for a Muslim name, scholars have identified specific categories that are not permissible regardless of language. Understanding these helps clarify what the actual Islamic rules on naming are.
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-text text-sm md:text-base">1. Names that belong exclusively to Allah</h4>
                  <p className="text-xs md:text-sm text-text-muted">
                    Names like Al-Khaliq (The Creator), Al-Qahhaar (The Subduer), and other names that are attributes unique to Allah alone cannot be given to a human being. However, these names can be used with the prefix Abd (servant of) — so Abdur-Rahman, Abdullah, Abdul-Khaliq are all correct and beloved names.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-text text-sm md:text-base">2. Names that imply worship of other than Allah</h4>
                  <p className="text-xs md:text-sm text-text-muted">
                    Names that contain explicit devotion to idols, saints, or any being other than Allah are prohibited. For example, names that mean servant of an idol or slave of a false deity are not permissible — regardless of which language they come from.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-text text-sm md:text-base">3. Names with evil or ugly meanings</h4>
                  <p className="text-xs md:text-sm text-text-muted">
                    Names that mean something harmful, immoral, arrogant, or ugly are disliked or prohibited depending on the severity. This applies equally in Arabic and non-Arabic languages. A name meaning tyrant, oppressor, born of sin, or similar in any language would be problematic.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-text text-sm md:text-base">4. Names exclusive to non-Muslims in a religious sense</h4>
                  <p className="text-xs md:text-sm text-text-muted">
                    Scholars differ slightly here, but the general position is that names that are exclusively religious markers of non-Islamic faiths — names directly tied to the theology of another religion — should be avoided. For example, names meaning son of God in a theological sense, or names referring to specific deities of other faiths. This is different from names that simply originate from another culture or civilisation.
                  </p>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-text text-sm md:text-base">5. Names of arrogance</h4>
                  <p className="text-xs md:text-sm text-text-muted">
                    The Prophet ﷺ disliked names like Maalik al-Amlak (King of Kings) or names that claim supreme qualities that belong to Allah alone. This principle applies across all languages.
                  </p>
                </div>
              </div>
            </section>

            <section id="permissible-names" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Names That Are Permissible From Any Language
              </h2>
              <p>
                As long as a name does not fall into the prohibited categories above, names from any language are permissible. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong className="text-text">Persian names</strong> — Shirin (sweet), Farida (unique), Parisa (like a fairy), Dilnoza (heart-pleasing). Persian has contributed enormously to Muslim naming traditions, especially in South and Central Asia.
                </li>
                <li>
                  <strong className="text-text">Turkish names</strong> — Aylin (moonlight), Nalan (one who laments gently), Selin (river water), Yasemin (jasmine). Turkish names often carry natural and poetic meanings entirely consistent with Islamic values.
                </li>
                <li>
                  <strong className="text-text">Urdu names</strong> — Pakeeza (pure), Nargis (narcissus flower), Gulshan (garden of flowers), Mehwish (the moon). Many Urdu names are themselves Persian or Arabic in origin, but uniquely shaped by Urdu literature and culture.
                </li>
                <li>
                  <strong className="text-text">Swahili names</strong> — Amani (peace), Furaha (happiness), Imani (faith). Many Swahili names already reflect Islamic values directly.
                </li>
                <li>
                  <strong className="text-text">Malay names</strong> — Indah (beautiful), Cahaya (light), Bunga (flower). Malaysian and Indonesian Muslims have a long tradition of combining Malay names with Arabic ones.
                </li>
                <li>
                  <strong className="text-text">Names of uncertain or mixed origin</strong> — Many popular names among Muslims worldwide have origins that are debated or are shared between Arabic, Persian, Greek, or other languages. Names like Layla, Zara, Nadia, and Leila are used broadly by Muslims of all backgrounds and there is no scholarly objection to any of them.
                </li>
              </ul>
            </section>

            <section id="non-muslim-names" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                What About Completely Non-Muslim Culture Names?
              </h2>
              <p>
                A question that comes up frequently in Western Muslim communities is whether names from English, French, Spanish, or other Western European languages are permissible.
              </p>
              <p>
                The answer from scholars is generally: yes, if the meaning is acceptable.
              </p>
              <p>
                A name like Rose (meaning the flower) carries a beautiful meaning. A name like Victoria (meaning victory) carries a positive meaning. These names, in themselves, are not problematic. Scholars like Sheikh Ibn Uthaymeen stated that as long as the name is not a religious symbol of another faith and its meaning is not bad, a Muslim can use it.
              </p>
              <p>
                What scholars caution against is choosing a name solely out of cultural imitation or a desire to distance oneself from Muslim identity. The concern here is spiritual and social — not about the name itself, but about the intention behind abandoning meaningful Muslim names in favour of names chosen to blend in or to signal non-Muslim affiliation.
              </p>
              <p>
                This is a matter of personal and communal wisdom rather than a legal prohibition. A Muslim in a Western country who names their child Lily or Adam or Maryam is not violating any Islamic ruling. A Muslim who deliberately avoids all Islamic-origin names out of a sense of shame about their faith is engaging in something spiritually concerning — but that is a matter of the heart, not of the name itself.
              </p>
            </section>

            <section id="special-status" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Special Status of Certain Arabic Names
              </h2>
              <p>
                While Arabic names are not required, certain Arabic names carry a special recommended status in Islamic tradition.
              </p>
              <p>
                Names of the Prophets — Ibrahim, Ismail, Musa, Isa, Yusuf, Muhammad ﷺ, Idris, Yahya, and others — are deeply recommended. The Prophet ﷺ said:
              </p>
              <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 italic text-text bg-card/30 rounded-r-lg px-3">
                "Name yourselves with the names of the Prophets."
                <cite className="block text-xs font-semibold text-text-muted mt-1 not-italic">— Abu Dawud</cite>
              </blockquote>
              <p>
                Names that begin with Abd followed by one of Allah's beautiful names (Asma ul-Husna) — such as Abdullah (servant of Allah) and Abdur-Rahman (servant of the Most Merciful) — are among the most beloved names to Allah, as mentioned in authentic hadith.
              </p>
              <p>
                Names of the companions and early Muslim women — Khadijah, Aisha, Fatima, Ali, Omar, Uthman — are beloved because of the great people who bore them.
              </p>
              <p>
                None of this makes Arabic names mandatory, but it does explain why scholars particularly encourage them when parents are choosing names for their children. These names come with a legacy, a story, and a spiritual weight that connects the child to the greatest generation of Muslims.
              </p>
            </section>

            <section id="practical-guidance" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Practical Guidance for Parents
              </h2>
              <p>
                If you are a Muslim parent considering a non-Arabic name for your child, here is a practical framework drawn from the scholarly tradition:
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-text text-sm md:text-base">Step one: Check the meaning</h4>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                      Look up the meaning of the name carefully — not just in one source. Make sure the meaning is positive, neutral, or clearly beautiful. Avoid names with negative, aggressive, arrogant, or morally problematic meanings.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-text text-sm md:text-base">Step two: Check the religious associations</h4>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                      Is this name used exclusively as a religious identifier of another faith? Is it the name of a deity, idol, or theological concept of another religion? If yes, avoid it. If it is simply a cultural name with no specific religious meaning, it is likely fine.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-text text-sm md:text-base">Step three: Consider the practical effect</h4>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                      Will this name cause your child confusion about their identity? Will it be misunderstood in your community? These are social and family considerations, not religious ones — but they are worth thinking about.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-text text-sm md:text-base">Step four: Consider pairing</h4>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                      Many Muslim families use a non-Arabic first name alongside an Arabic middle name, or vice versa. This allows for cultural identity while also maintaining connection to Islamic naming tradition. There is nothing in Islamic law that restricts this approach.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                    5
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-text text-sm md:text-base">Step five: Make du'a</h4>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                      Ask Allah for guidance in choosing a name. This act of turning to Allah in even small decisions is itself an expression of faith.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="conclusion" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Conclusion
              </h2>
              <p>
                The question of whether Muslims can use non-Arabic names has a clear answer grounded in the scholarship of fourteen centuries of Islamic learning: yes, they can. Islam is not a religion that confines cultural expression to a single ethnicity or language. It is a universal message for all of humanity, and the diversity of Muslim names across the world is a reflection of that universality.
              </p>
              <p>
                What Islam asks of a name is that it be good — good in meaning, free from association with what is prohibited, and ideally connected to something noble, beautiful, or spiritually uplifting. Whether that name comes from Arabic, Persian, Turkish, Urdu, Malay, Swahili, or any other language is a secondary matter.
              </p>
              <p>
                The best names are those given with love, with knowledge of their meaning, and with a prayer that the child who bears them will live up to the beauty they represent.
              </p>
            </section>

            {/* Share Buttons */}
            <div className="bg-card border border-border p-6 rounded-2xl space-y-4 mt-8">
              <h3 className="text-sm font-black uppercase tracking-wider text-text flex items-center gap-2">
                <Share2 size={16} /> Share This Article
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-xs font-bold transition-all shadow-md"
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
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 font-arabic">
                أ
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-sm font-black text-text">IslamicNames.in Editorial Team</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Our team of researchers and scholars curates authentic Islamic name content with verified meanings, Arabic script, and scholarly references. We are dedicated to helping Muslim families around the world choose beautiful, meaningful names for their children.
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
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F0DEB0] text-[#7A5A10] inline-block">Naming Guide</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">How to Choose an Islamic Name — Complete Guide for Parents</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 3, 2026</span>
                </Link>
                <Link to="/blog/modern-arabic-girl-names-that-sound-beautiful" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Modern Arabic Girl Names That Sound Beautiful in English</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 28, 2026</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Requirement</span><span className="text-text font-bold">Good Meaning</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Arabic Required?</span><span className="text-text text-red-500 font-bold">No</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Permissible Languages</span><span className="text-text font-bold">All Languages</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Prohibited Types</span><span className="text-text font-bold">5 Categories</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Highly Recommended</span><span className="text-text font-bold">Prophets & Abd Names</span></li>
              </ul>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Core Hadith</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ said: <em className="text-text">"You will be called on the Day of Resurrection by your names and your fathers' names, so give yourselves good names."</em>
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

export default CanMuslimsUseNonArabicNamesArticle;
