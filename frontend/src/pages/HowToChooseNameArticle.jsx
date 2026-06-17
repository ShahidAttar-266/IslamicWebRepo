import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const articleFaqs = [
  {
    q: 'Can I name my child after a non-Muslim relative as a sign of respect?',
    a: 'As long as the name itself doesn\'t carry a religious meaning tied to another faith (such as referring to a deity) and has no negative connotation, this is generally permissible. The focus is on the meaning of the name, not its cultural origin.'
  },
  {
    q: 'Is it true that a bad name can be changed later in life?',
    a: 'Yes. Islamic history includes multiple examples of the Prophet ﷺ renaming adults whose names had poor meanings. While changing a name as an adult is more complex practically (legal documents, family recognition), there\'s no religious barrier to doing so if the original name carries a genuinely negative meaning.'
  },
  {
    q: 'What if my child\'s name isn\'t found in any Islamic name dictionary?',
    a: 'That\'s fine — the requirement isn\'t that a name appears in a specific book or database. The requirement is that the meaning is good, doesn\'t imply shirk, and isn\'t offensive. Many beautiful names simply aren\'t widely catalogued.'
  },
  {
    q: 'Should I prioritize a name that\'s easy to pronounce in my country of residence?',
    a: 'This isn\'t a religious requirement, but it\'s a practical one worth weighing. A name your child will need to spell out and correct constantly for their whole life is worth thinking through — though many families happily embrace this as part of their identity.'
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

const HowToChooseNameArticle = () => {
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
        'why-weight',
        'when-named',
        'who-chooses',
        'core-guidelines',
        'beloved-and-avoid',
        'is-arabic-required',
        'tahnik-adhan',
        'step-by-step',
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
    const text = 'How to Choose an Islamic Name — Complete Guide for Parents';
    
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
    { id: 'why-weight', label: 'Why Naming Carries Weight' },
    { id: 'when-named', label: 'When Should a Baby Be Named?' },
    { id: 'who-chooses', label: 'Who Gets to Choose the Name?' },
    { id: 'core-guidelines', label: 'Core Islamic Guidelines' },
    { id: 'beloved-and-avoid', label: 'The Most Beloved Names & Ones to Avoid' },
    { id: 'is-arabic-required', label: 'Does It Have to Be Arabic?' },
    { id: 'tahnik-adhan', label: 'Tahnik and the Adhan' },
    { id: 'step-by-step', label: 'Step-by-Step Selection' },
    { id: 'faq', label: 'Frequently Asked Questions' },
    { id: 'conclusion', label: 'Final Thoughts' },
  ];

  return (
    <>
      <Helmet>
        <title>How to Choose an Islamic Name — Complete Guide for Parents — IslamicNames</title>
        <meta name="description" content="Learn how to choose a beautiful Islamic baby name: Sunnah timing, Aqiqah, parental rights, prohibited names, Arab vs. non-Arab names, and practical selection steps." />
        <meta name="keywords" content="Islamic naming guide, how to choose Islamic name, Aqiqah timing, Sunnah names, Haram baby names in Islam, Arabic names meaning" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.islamicnames.in/blog/how-to-choose-an-islamic-name" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.islamicnames.in/blog/how-to-choose-an-islamic-name" />
        <meta property="og:title" content="How to Choose an Islamic Name — Complete Guide for Parents — IslamicNames" />
        <meta property="og:description" content="Learn how to choose a beautiful Islamic baby name: Sunnah timing, Aqiqah, parental rights, prohibited names, Arab vs. non-Arab names, and practical selection steps." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/blog/how-to-choose-an-islamic-name" />
        <meta name="twitter:title" content="How to Choose an Islamic Name — Complete Guide for Parents — IslamicNames" />
        <meta name="twitter:description" content="Learn how to choose a beautiful Islamic baby name: Sunnah timing, Aqiqah, parental rights, prohibited names, Arab vs. non-Arab names, and practical selection steps." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* JSON-LD Article Structured Data */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose an Islamic Name — Complete Guide for Parents — IslamicNames",
  "description": "Learn how to choose a beautiful Islamic baby name: Sunnah timing, Aqiqah, parental rights, prohibited names, Arab vs. non-Arab names, and practical selection steps.",
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
    "@id": "https://www.islamicnames.in/blog/how-to-choose-an-islamic-name"
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
              { "@type": "ListItem", "position": 3, "name": "How to Choose an Islamic Name", "item": "https://www.islamicnames.in/blog/how-to-choose-an-islamic-name" }
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
            <span className="text-text">Naming Guide</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Naming Guide · Sunnah
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              How to Choose an Islamic Name — Complete Guide for Parents
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              Few decisions a parent makes carry as much weight as the name given to a newborn child. In Islam, a name is far more than a label — it is a lifelong companion, a daily prayer, and on the Day of Judgment, it is how a person will be called before Allah.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> June 3, 2026</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 5,400 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#7A5A10] via-[#A87E1E] to-[#C4922A] rounded-3xl overflow-hidden flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            نـ
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            جميل & طيب
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Article Content */}
          <article className="lg:col-span-2 space-y-8 text-text-muted leading-relaxed text-sm md:text-base pr-0 lg:pr-4">
            
            <section id="why-weight" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Why Naming Carries Such Weight in Islam
              </h2>
              <p>
                Giving a newborn a beautiful name is considered one of the Sunan (practices) of the Prophet ﷺ, and it is described as a right that belongs to the child, owed by the father. A name is not a temporary convenience — the name chosen for a son or daughter will be spoken by the family tens of thousands of times over the course of a single year, let alone a lifetime. It shapes how a child sees themselves and how the world responds to them.
              </p>
              <p>
                This is why Islamic scholarship treats naming as a matter worthy of careful thought, not a last-minute decision made in a hospital waiting room.
              </p>
            </section>

            <section id="when-named" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                When Should a Baby Be Named?
              </h2>
              <p>
                There is some flexibility here, and parents shouldn't feel pressured into rushing.
              </p>
              <p>
                It is Sunnah to name the child on the seventh day after birth, alongside shaving the baby's head and performing the Aqiqah, though naming on the day of birth is also permitted and supported by hadith. Classical scholars, including Imam Bukhari, reconcile these two positions by noting that both the first day and the seventh day are valid times to name a child — some traditions support one, some the other, and some say both are equally fine.
              </p>
              <p>
                The Aqiqah itself refers to the animal sacrificed on behalf of the newborn, traditionally offered on the seventh day of life. Many families combine the naming ceremony with the Aqiqah celebration, making it a meaningful gathering for relatives and friends.
              </p>
              <div className="bg-gradient-to-r from-card to-primary/5 border border-border p-5 rounded-2xl text-xs md:text-sm leading-relaxed space-y-2">
                <span className="text-primary font-black block flex items-center gap-1.5">
                  <Info size={16} /> Practical takeaway:
                </span>
                <p>
                  If you haven't decided on a name by the time your baby is born, you have at least a week — use it wisely rather than choosing under pressure.
                </p>
              </div>
            </section>

            <section id="who-chooses" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Who Gets to Choose the Name?
              </h2>
              <p>
                This is a common point of family tension, so it helps to know the actual position.
              </p>
              <p>
                Although there is no single explicit text that grants one parent the right to name a child over the other, the weight of Islamic evidence indicates that the father holds this right. However, this is not meant to sideline the mother. It is recommended for the father to show kindness to his wife by taking her suggested names into consideration, and many scholars describe involving the mother in the decision as mustahabb (encouraged, though not obligatory).
              </p>
              <p>
                In practice, the healthiest approach is what most modern Muslim families already do: both parents discuss and agree together, with the father having the final say only if there's genuine disagreement.
              </p>
            </section>

            <section id="core-guidelines" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Core Islamic Guidelines for a Good Name
              </h2>
              <p>
                Scholars have distilled the Islamic rulings on names into a short, clear set of principles. According to these guidelines, parents should:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Avoid names that imply servitude or worship of anything other than Allah.</li>
                <li>Avoid names of Allah that are befitting only for Him (e.g. Al-Khaliq, Al-Quddus).</li>
                <li>Avoid names with meanings that are off-putting, disliked, or carry bad omens.</li>
              </ul>
              <p>
                Beyond the religious do's and don'ts, there is also a simple human standard. Sheikh Yusuf Al-Qaradawi explained that a good name is one that is neither detestable to other people nor something the child himself might reject once he grows up — and gave examples like names carrying connotations of bad omens, or names of people known for oppression. He also noted that the Prophet ﷺ would change bad names into good ones whenever he encountered them — a practice that set the precedent for how seriously Muslims should take this decision.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl text-xs md:text-sm leading-relaxed space-y-2">
                <span className="text-primary font-bold block">A famous real-life example:</span>
                <p>
                  The Prophet ﷺ changed the name of a woman called Barrah — meaning "righteous" — because it sounded like she was praising her own piety. He gave her a more humble name instead. The lesson is that even a name with a "good" meaning can be inappropriate if it's arrogant or self-praising.
                </p>
              </div>
            </section>

            <section id="beloved-and-avoid" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                The Most Beloved Names — And the Ones to Avoid
              </h2>
              <p>
                If you want a definitive answer on what Islam considers the best possible names, there's a direct hadith for that:
              </p>
              <div className="bg-card border border-border p-5 rounded-2xl italic text-text my-4 text-center">
                "The best and most beloved names to Allah are Abdullah and Abd-ur-Rahman, the most truthful names are al-Harith and Hammam, and the ugliest names are Harb (meaning 'war') and Murrah (meaning 'bitter')."
              </div>
              <p>
                This single hadith gives parents a complete framework:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-card border border-border p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={16} /> Recommended categories
                  </h4>
                  <ul className="list-disc pl-5 text-xs space-y-1.5">
                    <li><strong>"Abd" + Names of Allah:</strong> e.g., Abdullah (servant of Allah), Abd al-Aziz (servant of the Mighty), or Abd al-Karim (servant of the Generous).</li>
                    <li><strong>Names of Prophets:</strong> Ibrahim, Musa, Isa, and Muhammad are all specifically encouraged.</li>
                    <li><strong>Names of righteous companions</strong> and people of good character.</li>
                    <li><strong>Names with virtuous meanings:</strong> such as Salih (righteous), Hasan (good), or Aminah (trustworthy).</li>
                  </ul>
                </div>
                
                <div className="bg-card border border-border p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-black text-danger uppercase tracking-wider flex items-center gap-1.5">
                    ⚠️ Names to avoid
                  </h4>
                  <ul className="list-disc pl-5 text-xs space-y-1.5">
                    <li><strong>Servitude to other than Allah:</strong> Names like "Abd al-Kaaba" (servant of the Kaaba) or "Abd al-Nabi" (servant of the Prophet) are explicitly forbidden.</li>
                    <li><strong>Names exclusive to Allah's attributes:</strong> Names that only Allah can rightfully hold.</li>
                    <li><strong>Negative meanings:</strong> Names carrying harsh, negative, or embarrassing connotations (e.g. war, bitterness, oppression).</li>
                    <li><strong>Arrogant suffixes:</strong> Names combined with "al-Din" or "al-Islam" (e.g. Nur al-Din or Shams al-Islam) are makruh (disliked), as they attribute more virtue to a person than they may deserve.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="is-arabic-required" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Does an Islamic Name Have to Be Arabic?
              </h2>
              <p>
                This is one of the most common misconceptions — and the answer is <strong>no</strong>.
              </p>
              <p>
                There is nothing in Islamic sources that restricts Muslims to only Arabic names, since Islam is a universal religion meant for all peoples. A name from any language or culture is acceptable, as long as it doesn't violate the core principles (no shirk, no bad meanings, no arrogance).
              </p>
              <p>
                That said, scholars also gently note that while any permissible name is fine, parents should try not to compromise their Islamic identity in the process — which is part of why Arabic, Persian, Turkish, and Urdu names with Islamic roots remain so popular across Muslim communities worldwide. They carry both meaning and a sense of continuity with the broader Ummah.
              </p>
              <p>
                There's also a practical angle worth considering, especially for families living outside Arab-majority countries: parents are cautioned against picking strange or meaningless names purely because they sound "modern" or Western, without understanding what they actually mean. A name doesn't need to be ancient or unusual to be good — it just needs a clear, positive, and dignified meaning in whatever language it comes from.
              </p>
            </section>

            <section id="tahnik-adhan" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                A Quick Note on Tahnik and the Adhan
              </h2>
              <p>
                Two related newborn practices are often mentioned alongside naming, and many parents like to do all three around the same time:
              </p>
              <ul className="space-y-3">
                <li className="bg-card/40 border border-border p-4 rounded-xl">
                  <strong className="text-text block mb-1">📢 Adhan in the ear</strong>
                  Many families recite the call to prayer (adhan) softly into the newborn's right ear shortly after birth, as one of the very first words the child hears.
                </li>
                <li className="bg-card/40 border border-border p-4 rounded-xl">
                  <strong className="text-text block mb-1">🌴 Tahnik</strong>
                  A small amount of a soft, sweet substance — traditionally a chewed date — is gently placed on the baby's tongue, following a practice associated with the Prophet ﷺ welcoming newborns into the community.
                </li>
                <li className="bg-card/40 border border-border p-4 rounded-xl">
                  <strong className="text-text block mb-1">🐏 Aqiqah</strong>
                  As mentioned earlier, the sacrificial offering — typically two animals for a boy and one for a girl — usually performed on the seventh day, often combined with the naming.
                </li>
              </ul>
              <p>
                None of these are strictly tied to the name itself, but they form part of the same loving welcome into the family and faith.
              </p>
            </section>

            <section id="step-by-step" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Step-by-Step: How to Actually Choose the Name
              </h2>
              <div className="space-y-3">
                {[
                  { step: 1, title: 'Start a shortlist early', desc: "Don't wait until the last week of pregnancy — give yourselves months, not days." },
                  { step: 2, title: 'Check the meaning carefully', desc: "Don't rely on a single website. Cross-check the Arabic root and meaning across two or three sources, since transliterations can be misleading." },
                  { step: 3, title: 'Say it out loud — a lot', desc: "Combine it with the surname/family name. Say the full name in the languages your family and community will use daily." },
                  { step: 4, title: 'Consider the future', desc: "Ask: would this name embarrass my child at 25, or at 60? A name that feels trendy now should still feel dignified decades later." },
                  { step: 5, title: 'Check spiritual weight', desc: "Consider a Prophet's name, a companion's name, or an 'Abd' name. These come with built-in spiritual weight and are universally accepted." },
                  { step: 6, title: 'Avoid double meanings in other languages', desc: "A name that's beautiful in Arabic might mean something awkward in the local language of the country you live in — worth checking." },
                  { step: 7, title: 'Involve both parents — and grandparents', desc: "It reduces future family friction and often surfaces meaningful family names worth reviving." },
                  { step: 8, title: "Don't feel rushed", desc: "You have until the seventh day, and even after that, names can technically be changed if a serious issue with the meaning is discovered later." },
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
                Choosing an Islamic name is ultimately a balance of three things: a meaning that pleases Allah, a sound that's dignified and pleasant to the ear, and a name your child will carry with pride for the rest of their life. Take your time, involve your family, check the meaning from more than one source, and remember — you're not just picking a word. You're giving your child their very first gift.
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
                <Link to="/blog/top-30-quranic-names-for-baby-boys-in-2026" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Quranic</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Top 30 Quranic Names for Baby Boys in 2026</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 11, 2026</span>
                </Link>
                <Link to="/blog" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Tips</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Topic</span><span className="text-text font-bold">Islamic Naming Rules</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Timing</span><span className="text-text font-bold">Day 1 or Day 7</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Aqiqah Sunnah</span><span className="text-text font-bold">Recommended</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Best Names</span><span className="text-text font-bold">Abdullah & Abdur-Rahman</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Non-Arabic names</span><span className="text-text font-bold">Permissible</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium font-arabic">Root Letter Focus</span><span className="text-text font-bold">نـ (Noor / Light)</span></li>
              </ul>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Naming Hadith</h3>
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

export default HowToChooseNameArticle;
