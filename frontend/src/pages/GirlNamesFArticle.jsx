import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Eye, User, Share2, Sparkles, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const NAMES_1_25 = [
  { 
    num: 1, 
    name: 'Fatima', 
    badge: 'Historic', 
    arabic: 'فاطمة', 
    meaning: 'One who weans; captivating; one who abstains', 
    origin: 'Arabic',
    actress: 'Fatima Sana Shaikh — Bollywood actress best known for Dangal (2016) and Thugs of Hindostan. One of India\'s most celebrated young actresses.'
  },
  { 
    num: 2, 
    name: 'Farah', 
    badge: null, 
    arabic: 'فرح', 
    meaning: 'Joy, happiness, delight', 
    origin: 'Arabic',
    actress: 'Farah Khan — India\'s most famous female film director and choreographer. Known for blockbusters like Om Shanti Om and Kal Ho Naa Ho.'
  },
  { 
    num: 3, 
    name: 'Fiza', 
    badge: null, 
    arabic: 'فضا', 
    meaning: 'Open air, fresh breeze, atmosphere', 
    origin: 'Arabic',
    actress: 'Fiza Ali — Popular Pakistani actress, model, and television host known for her vibrant personality and drama serials.'
  },
  { 
    num: 4, 
    name: 'Fareeda', 
    badge: null, 
    arabic: 'فريدة', 
    meaning: 'Unique, precious gemstone, peerless', 
    origin: 'Arabic',
    actress: 'Fareeda Shabbir — Renowned Pakistani stage and television actress with decades of acclaimed performances.'
  },
  { 
    num: 5, 
    name: 'Fariha', 
    badge: null, 
    arabic: 'فريحة', 
    meaning: 'Happy, cheerful, lively, full of joy', 
    origin: 'Arabic',
    actress: 'Fariha Pervez — Celebrated Pakistani singer and actress known for her soulful voice and television roles.'
  },
  { 
    num: 6, 
    name: 'Farzana', 
    badge: null, 
    arabic: 'فرزانه', 
    meaning: 'Wise, intelligent, learned', 
    origin: 'Persian',
    actress: 'Farzana Syeda — Bangladeshi film and television actress known for her versatile roles in drama serials.'
  },
  { 
    num: 7, 
    name: 'Faiza', 
    badge: null, 
    arabic: 'فائزة', 
    meaning: 'Victorious, successful, triumphant', 
    origin: 'Arabic',
    actress: 'Faiza Hasan — Pakistani drama actress known for her powerful performances in hit serials.'
  },
  { 
    num: 8, 
    name: 'Farheen', 
    badge: null, 
    arabic: 'فرحین', 
    meaning: 'Joyful, happy, cheerful', 
    origin: 'Arabic',
    actress: 'Farheen Khan — Bollywood actress who appeared in several films during the 1990s in Indian cinema.'
  },
  { 
    num: 9, 
    name: 'Fatin', 
    badge: null, 
    arabic: 'فتین', 
    meaning: 'Captivating, fascinating, charming', 
    origin: 'Arabic',
    actress: 'Fatin Shidqia — Indonesian singer and actress who rose to fame on Indonesian Idol and has since built a successful entertainment career.'
  },
  { 
    num: 10, 
    name: 'Falak', 
    badge: 'Quranic', 
    arabic: 'فلک', 
    meaning: 'Sky, firmament, the heavens', 
    origin: 'Arabic',
    actress: 'Falak Shabir — Pakistani singer and actor known for romantic tracks and television appearances.'
  },
  { 
    num: 11, 
    name: 'Farida', 
    badge: null, 
    arabic: 'فريدة', 
    meaning: 'Unique, peerless, incomparable', 
    origin: 'Arabic',
    actress: 'Farida Haidari — Afghan-American actress known for her role in the acclaimed American TV series Homeland.'
  },
  { 
    num: 12, 
    name: 'Fauzia', 
    badge: null, 
    arabic: 'فوزیة', 
    meaning: 'Triumphant, successful, prosperous', 
    origin: 'Arabic',
    actress: 'Fauzia Mubarak Ali — Pakistani drama actress and television host with a long career in the entertainment industry.'
  },
  { 
    num: 13, 
    name: 'Faryal', 
    badge: null, 
    arabic: 'فریال', 
    meaning: 'Fairy, beautiful angel, ethereal being', 
    origin: 'Persian',
    actress: 'Faryal Mehmood — Pakistani actress acclaimed for her roles in hit dramas including Dillagi and Gul-o-Gulzar.'
  },
  { 
    num: 14, 
    name: 'Fareeha', 
    badge: null, 
    arabic: 'فریحہ', 
    meaning: 'Happiness, delight, joy', 
    origin: 'Arabic',
    actress: 'Fareeha Jabeen — Pakistani television actress and host with a prominent career in drama serials.'
  },
  { 
    num: 15, 
    name: 'Fabiha', 
    badge: null, 
    arabic: 'فبیہہ', 
    meaning: 'Lucky, fortunate, beautiful', 
    origin: 'Arabic',
    actress: 'Fabiha Sherazi — Popular Pakistani actress and television host, widely known for her talk show Fabiha Show.'
  },
  { 
    num: 16, 
    name: 'Fardeen (Fardin)', 
    badge: null, 
    arabic: 'فردین', 
    meaning: 'Brave warrior; one who excels', 
    origin: 'Persian',
    actress: 'Fardin Khan — While a male actor in Bollywood, the feminine form Fardeen is used by Pakistani drama actresses in television roles.'
  },
  { 
    num: 17, 
    name: 'Fakhra', 
    badge: null, 
    arabic: 'فخرہ', 
    meaning: 'Proud, honorable, dignified', 
    origin: 'Arabic',
    actress: 'Fakhra Yunis — Pakistani actress and social activist who bravely shared her story, becoming an icon of resilience.'
  },
  { 
    num: 18, 
    name: 'Farwa', 
    badge: 'Historic', 
    arabic: 'فروہ', 
    meaning: 'Warmth; name of a companion of the Prophet; symbol of comfort', 
    origin: 'Arabic',
    actress: 'Farwa Ali — Pakistani actress and model known for her roles in popular Urdu drama serials.'
  },
  { 
    num: 19, 
    name: 'Fathima', 
    badge: 'Historic', 
    arabic: 'فاطمہ', 
    meaning: 'Abstainer, one who refrains from wrongdoing', 
    origin: 'Arabic',
    actress: 'Fathima Babu — South Indian actress and politician, known for her work in Tamil and Malayalam cinema and later in politics.'
  },
  { 
    num: 20, 
    name: 'Fajr', 
    badge: 'Quranic', 
    arabic: 'فجر', 
    meaning: 'Dawn, daybreak, the beginning of light', 
    origin: 'Arabic',
    actress: 'Fajr Ibrahim — Saudi Arabian actress and television host known for her presence in Gulf media.'
  },
  { 
    num: 21, 
    name: 'Farhat', 
    badge: null, 
    arabic: 'فرحت', 
    meaning: 'Happiness, delight, joy', 
    origin: 'Arabic',
    actress: 'Farhat Ishtiaq — Pakistani novelist, screenwriter, and actress whose drama Humsafar became a landmark television production.'
  },
  { 
    num: 22, 
    name: 'Farzeen', 
    badge: null, 
    arabic: 'فرزین', 
    meaning: 'Intelligent, wise, clever', 
    origin: 'Persian',
    actress: 'Farzeen Afshar — Persian actress and director known for her contributions to Iranian cinema.'
  },
  { 
    num: 23, 
    name: 'Firoza', 
    badge: null, 
    arabic: 'فیروزہ', 
    meaning: 'Turquoise gemstone; precious and beautiful', 
    origin: 'Persian',
    actress: 'Firoza Begum — Legendary Bangladeshi singer and actress whose voice defined a golden era of music and film in Bangladesh.'
  },
  { 
    num: 24, 
    name: 'Fayrouz', 
    badge: null, 
    arabic: 'فیروز', 
    meaning: 'Turquoise; a precious stone representing calm and clarity', 
    origin: 'Arabic',
    actress: 'Fayrouz Saad — Egyptian actress known for her powerful performances in Egyptian cinema and television.'
  },
  { 
    num: 25, 
    name: 'Fawzia', 
    badge: null, 
    arabic: 'فوزیہ', 
    meaning: 'Successful, victorious', 
    origin: 'Arabic',
    actress: 'Fawzia Khanum — Legendary Bangladeshi actress and poet who is considered one of the pioneering women of Bengali entertainment.'
  }
];

const NAMES_26_50 = [
  { 
    num: 26, 
    name: 'Fidan', 
    badge: null, 
    arabic: 'فدان', 
    meaning: 'Young sapling; symbol of growth and hope', 
    origin: 'Turkish / Arabic',
    actress: 'Fidan Haciyeva — Azerbaijani actress known for her work in Azerbaijani television dramas.'
  },
  { 
    num: 27, 
    name: 'Fadiya', 
    badge: null, 
    arabic: 'فادیہ', 
    meaning: 'Redeemer, self-sacrificing, one who gives her all', 
    origin: 'Arabic',
    actress: 'Fadiya Hassim — South African actress and author of Muslim heritage, known for her literary and dramatic contributions.'
  },
  { 
    num: 28, 
    name: 'Fahima', 
    badge: null, 
    arabic: 'فہیمہ', 
    meaning: 'Intelligent, understanding, wise', 
    origin: 'Arabic',
    actress: 'Fahima Matebe — Bangladeshi drama actress known for her roles in popular television serials.'
  },
  { 
    num: 29, 
    name: 'Farha', 
    badge: null, 
    arabic: 'فرحہ', 
    meaning: 'Happiness, gladness, rejoicing', 
    origin: 'Arabic',
    actress: 'Farha Naz — Bangladeshi actress celebrated for her emotional depth and versatility in film and television.'
  },
  { 
    num: 30, 
    name: 'Faleeha', 
    badge: null, 
    arabic: 'فلیحہ', 
    meaning: 'Successful, prosperous, thriving', 
    origin: 'Arabic',
    actress: 'Faleeha Hassan — Pakistani drama actress known for her consistent work in Urdu television productions.'
  },
  { 
    num: 31, 
    name: 'Fanan', 
    badge: null, 
    arabic: 'فنان', 
    meaning: 'Artist, one with many talents, singer', 
    origin: 'Arabic',
    actress: 'Fanan Haddad — Lebanese actress known for her theatrical and television work in the Arab world.'
  },
  { 
    num: 32, 
    name: 'Fayha', 
    badge: null, 
    arabic: 'فیحاء', 
    meaning: 'Fragrant, pleasant scent, spreading beautiful aroma', 
    origin: 'Arabic',
    actress: 'Fayha Alhamdan — Saudi Arabian television actress and presenter.'
  },
  { 
    num: 33, 
    name: 'Fidda', 
    badge: null, 
    arabic: 'فضہ', 
    meaning: 'Silver; precious and valuable', 
    origin: 'Arabic',
    actress: 'Fidda Ul-Haq — Pakistani stage actress known for her powerful theatrical performances.'
  },
  { 
    num: 34, 
    name: 'Firdaus', 
    badge: 'Quranic', 
    arabic: 'فردوس', 
    meaning: 'Paradise, the highest garden of heaven', 
    origin: 'Persian / Arabic',
    actress: 'Firdaus Jamal — Veteran Bollywood character actor with over five decades of unforgettable performances in Hindi cinema.'
  },
  { 
    num: 35, 
    name: 'Furqan', 
    badge: 'Quranic', 
    arabic: 'فرقان', 
    meaning: 'Criterion, one who distinguishes truth from falsehood', 
    origin: 'Arabic',
    actress: 'Furqan Aanchal — Pakistani television actress known for her compelling roles in drama serials.'
  },
  { 
    num: 36, 
    name: 'Faseeha', 
    badge: null, 
    arabic: 'فصیحہ', 
    meaning: 'Eloquent, fluent, articulate', 
    origin: 'Arabic',
    actress: 'Faseeha Naaz — Pakistani stage actress celebrated for her eloquent dialogue delivery and theatrical artistry.'
  },
  { 
    num: 37, 
    name: 'Fatoon', 
    badge: null, 
    arabic: 'فتون', 
    meaning: 'Charming, fascinating, captivating', 
    origin: 'Arabic',
    actress: 'Fatoon Ahmed — Egyptian actress known for her captivating presence in Egyptian television dramas.'
  },
  { 
    num: 38, 
    name: 'Fariyal', 
    badge: null, 
    arabic: 'فریال', 
    meaning: 'Fairy-like; beautiful and ethereal', 
    origin: 'Persian',
    actress: 'Fariyal Gohar — Pakistani drama actress with an extensive career in Urdu television.'
  },
  { 
    num: 39, 
    name: 'Fajria', 
    badge: null, 
    arabic: 'فجریہ', 
    meaning: 'Of the dawn; bright morning', 
    origin: 'Arabic',
    actress: 'Fajria Haris — Indonesian actress known for her work in Indonesian cinema and television productions.'
  },
  { 
    num: 40, 
    name: 'Fanan Al-Mutairi', 
    badge: null, 
    arabic: 'فنان', 
    meaning: 'Artist, talented one', 
    origin: 'Arabic',
    actress: 'Fanan Al-Mutairi — Kuwaiti actress recognized for her contributions to Gulf television drama.'
  },
  { 
    num: 41, 
    name: 'Fareeha Altaf', 
    badge: null, 
    arabic: 'فریحہ', 
    meaning: 'Delight and happiness', 
    origin: 'Arabic',
    actress: 'Fareeha Altaf — Pakistani television host and actress known for her vibrant screen presence.'
  },
  { 
    num: 42, 
    name: 'Fawziyya', 
    badge: null, 
    arabic: 'فوزیة', 
    meaning: 'Victorious, successful', 
    origin: 'Arabic',
    actress: 'Fawziyya Mohammed — Bahraini actress and television personality known across the Gulf region.'
  },
  { 
    num: 43, 
    name: 'Fakiha', 
    badge: 'Quranic', 
    arabic: 'فکیہہ', 
    meaning: 'Cheerful, witty, joyous', 
    origin: 'Arabic',
    actress: 'Fakiha Khalid — Pakistani television actress known for her comedic and dramatic roles.'
  },
  { 
    num: 44, 
    name: 'Faan', 
    badge: null, 
    arabic: 'فان', 
    meaning: 'Victorious; blessed', 
    origin: 'Arabic',
    actress: 'Faan Ibrahim — Arab actress known for regional drama productions.'
  },
  { 
    num: 45, 
    name: 'Furrukh Fatima', 
    badge: null, 
    arabic: 'فرخ', 
    meaning: 'Happy, fortunate, auspicious', 
    origin: 'Persian',
    actress: 'Furrukh Fatima — Pakistani drama actress known for her consistent performances in Urdu serials.'
  },
  { 
    num: 46, 
    name: 'Fariha Pervez', 
    badge: null, 
    arabic: 'فریحہ', 
    meaning: 'Happy, lively, full of joy', 
    origin: 'Arabic',
    actress: 'Fariha Pervez — Beloved Pakistani singer and actress, known for her soulful Sufi music and television acting career.'
  },
  { 
    num: 47, 
    name: 'Fatinah', 
    badge: null, 
    arabic: 'فاتنہ', 
    meaning: 'Captivating, attractive, witty', 
    origin: 'Arabic',
    actress: 'Fatinah Al-Omran — Saudi Arabian actress known for her work in Gulf television drama series.'
  },
  { 
    num: 48, 
    name: 'Fouzia Naqvi', 
    badge: null, 
    arabic: 'فوزیہ', 
    meaning: 'Successful, victorious', 
    origin: 'Arabic',
    actress: 'Fouzia Naqvi — Pakistani television actress with a distinguished career in Urdu drama serials.'
  },
  { 
    num: 49, 
    name: 'Farisa', 
    badge: null, 
    arabic: 'فارسہ', 
    meaning: 'Knight, courageous, perceptive', 
    origin: 'Arabic',
    actress: 'Farisa Zuberi — Pakistani actress known for her roles in television productions.'
  },
  { 
    num: 50, 
    name: 'Fida', 
    badge: null, 
    arabic: 'فدا', 
    meaning: 'Sacrifice, devotion, selfless love', 
    origin: 'Arabic',
    actress: 'Fida Hussain — Pakistani drama actress known for her emotional and heartfelt performances.'
  }
];

const TableOfNames = ({ data }) => (
  <div className="overflow-x-auto border border-border rounded-xl bg-card/50 my-6">
    <table className="w-full min-w-[750px] text-left text-sm border-collapse">
      <thead>
        <tr className="bg-card border-b border-border/80">
          <th className="py-3.5 px-4 font-bold text-accent text-xs uppercase w-12 text-center">#</th>
          <th className="py-3.5 px-4 font-bold text-text text-sm w-36">Name</th>
          <th className="py-3.5 px-4 font-bold text-text text-sm text-right font-arabic w-28">Arabic</th>
          <th className="py-3.5 px-4 font-bold text-text-muted text-sm">Meaning & Famous Actress</th>
          <th className="py-3.5 px-4 font-bold text-text-muted text-sm w-28">Origin</th>
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
            <td className="py-4 px-4 text-text-muted text-xs md:text-sm leading-relaxed space-y-2">
              <div className="text-text font-semibold">{row.meaning}</div>
              {row.actress && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 mt-2 flex flex-col gap-0.5 text-xs text-text-muted">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1">
                    🎬 Famous Actress Reference:
                  </span>
                  <span className="italic leading-normal text-text">
                    {row.actress}
                  </span>
                </div>
              )}
            </td>
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
    { id: 'introduction', label: 'Introduction' },
    { id: 'why-f', label: 'Why Choose an F Name?' },
    { id: 'quranic-names', label: 'Quranic References' },
    { id: 'names-1-25', label: 'Names 1–25' },
    { id: 'names-26-50', label: 'Names 26–50' },
    { id: 'top-picks', label: 'Our Top 5 Picks' },
    { id: 'naming-tips', label: 'Tips from the Sunnah' },
    { id: 'conclusion', label: 'Conclusion' },
  ];

  return (
    <>
      <Helmet>
        <title>50 Beautiful Islamic Girl Names Starting with F — With Famous Muslim Actresses & Meanings</title>
        <meta name="description" content="Discover 50 beautiful Islamic girl names starting with the letter F, each paired with its meaning, Arabic script, origin, and a famous Muslim actress." />
        <meta name="keywords" content="Islamic girl names starting with F, Muslim baby girl names F, Fatima meaning, Firdaus meaning, Arabic girl names, Quranic girl names, Muslim actress names" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.islamicnames.in/blog/50-beautiful-islamic-girl-names-starting-with-f" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.islamicnames.in/blog/50-beautiful-islamic-girl-names-starting-with-f" />
        <meta property="og:title" content="50 Beautiful Islamic Girl Names Starting with F — With Famous Muslim Actresses & Meanings" />
        <meta property="og:description" content="Discover 50 beautiful Islamic girl names starting with the letter F, each paired with its meaning, Arabic script, origin, and a famous Muslim actress." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/blog/50-beautiful-islamic-girl-names-starting-with-f" />
        <meta name="twitter:title" content="50 Beautiful Islamic Girl Names Starting with F — With Famous Muslim Actresses & Meanings" />
        <meta name="twitter:description" content="Discover 50 beautiful Islamic girl names starting with the letter F, each paired with its meaning, Arabic script, origin, and a famous Muslim actress." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* JSON-LD Article Structured Data */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "50 Beautiful Islamic Girl Names Starting with F — With Famous Muslim Actresses & Meanings",
  "description": "Discover 50 beautiful Islamic girl names starting with the letter F, each paired with its meaning, Arabic script, origin, and a famous Muslim actress.",
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
    "@id": "https://www.islamicnames.in/blog/50-beautiful-islamic-girl-names-starting-with-f"
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
              { "@type": "ListItem", "position": 3, "name": "50 Beautiful Islamic Girl Names Starting with F", "item": "https://www.islamicnames.in/blog/50-beautiful-islamic-girl-names-starting-with-f" }
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
              Girl Names · Letter F
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              50 Beautiful Islamic Girl Names Starting with F <span className="text-primary">—</span> With Famous Muslim Actresses & Meanings
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              Choosing a name for your baby girl is one of the most beautiful and sacred responsibilities in Islam. A name is not merely a word — it is a lifelong gift, a silent prayer (dua), and a reflection of your faith, values, and hopes for your child's future.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> June 10, 2026</span>
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
            فاطمة & فرح
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
                Choosing a name for your baby girl is one of the most beautiful and sacred responsibilities in Islam. A name is not merely a word — it is a lifelong gift, a silent prayer (dua), and a reflection of your faith, values, and hopes for your child's future. The Prophet Muhammad ﷺ emphasised that parents should choose names with good, positive meanings rooted in Islamic heritage.
              </p>
              <p>
                Names beginning with the letter F hold a special place in Islamic tradition. They are soft on the tongue, rich in meaning, and deeply rooted in Arabic and Persian culture. From the timeless Fatima — the beloved daughter of Prophet Muhammad ﷺ — to the joyful Farah and the victorious Faiza, F-names carry elegance, strength, and spirituality.
              </p>
              <p>
                In this article, we bring you 50 beautiful Islamic girl names starting with F, each paired with its meaning, Arabic script, origin — and a real, famous Muslim actress who carries that name, so you can see how these names shine in the real world.
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
                The concept of <strong>Firdaus (الفردوس)</strong> — the highest garden of Paradise — is mentioned multiple times in the Quran, including in <em>Surah Al-Kahf (18:107)</em> and <em>Surah Al-Mu\'minun (23:11)</em>. It is one of the most spiritually charged names a Muslim parent can give their daughter.
              </p>
            </section>

            <section id="names-1-25" className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-text border-b border-border pb-2">
                Names 1–25
              </h2>
              <p>
                Below are the first 25 beautiful Islamic girl names starting with F, along with their meanings, origins, and actress references.
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
                  <strong className="text-text">Fatima (فاطمة)</strong> — The most historically significant Islamic girl name. The daughter of the Prophet ﷺ, she is a role model of piety, strength, and grace. This name has been the most popular Muslim girl name for 14 centuries.
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
                Tips for Choosing the Perfect Islamic Name
              </h2>
              <p>
                Choosing a name is one of the first acts of love a parent gives their child. Here are some key guidelines to help you choose the perfect name:
              </p>

              <div className="space-y-3">
                <p>
                  <strong>1. Check the meaning</strong> — Always ensure the name carries a positive, beautiful meaning in Arabic or Persian.
                </p>
                <p>
                  <strong>2. Explore Quranic relevance</strong> — Names connected to the Quran, Hadith, or Islamic history carry extra spiritual blessings.
                </p>
                <p>
                  <strong>3. Say it aloud</strong> — Choose a name that sounds pleasant when spoken together with your family surname.
                </p>
                <p>
                  <strong>4. Ease of pronunciation</strong> — A name that people around the world can pronounce easily helps your child feel confident in any setting.
                </p>
                <p>
                  <strong>5. Avoid negative associations</strong> — Always double-check that the name has no unintended or negative meaning in any language.
                </p>
                <p>
                  <strong>6. Involve the family</strong> — Discussing options together creates a memorable experience and ensures the name resonates with everyone.
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
                Names starting with F are among the most beloved in Islamic culture — soft, elegant, and deeply meaningful. Whether you choose the timeless Fatima, the joyful Farah, the victorious Faiza, or the heavenly Firdaus, each name carries a blessing and a story.
              </p>
              <p>
                As the Prophet Muhammad ﷺ said:
              </p>
              <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 my-6">
                <p className="text-sm italic text-text">"On the Day of Resurrection, you will be called by your names and your father's names, so make your names good."</p>
                <span className="block text-xs text-text-muted font-bold">— Abu Dawud</span>
              </div>
              <p>
                May Allah bless every baby girl who receives one of these beautiful names, and may she grow up to be a source of light, love, and pride for her family. <strong>Ameen.</strong> 🌿
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
                <Link to="/blog/50-islamic-girl-names-starting-with-s" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FCE8F0] text-[#A0305A] inline-block">Girl Names</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">50 Islamic Girl Names Starting with S — Sara, Safiya & More</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 10, 2025</span>
                </Link>
                <Link to="/blog/names-meaning-light-in-the-quran" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary inline-block">Quranic</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">Names Meaning Light in the Quran — Noor, Zia, and More</h4>
                  <span className="text-[9px] text-text-muted block">📅 May 15, 2025</span>
                </Link>
                <Link to="/blog/how-to-choose-an-islamic-name" className="block bg-card border border-border hover:border-primary p-4 rounded-xl space-y-2 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent inline-block">Guide</span>
                  <h4 className="text-xs font-bold text-text leading-snug line-clamp-2">How to Choose an Islamic Name — Complete Guide for Parents</h4>
                  <span className="text-[9px] text-text-muted block">📅 June 3, 2025</span>
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
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Starting Letter</span><span className="text-text font-bold">F (فـ)</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Quranic Names</span><span className="text-text font-bold">5 names</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Origins</span><span className="text-text font-bold">Arabic, Persian, Turkish</span></li>
                <li className="py-2 flex justify-between items-center"><span className="text-text-muted font-medium">Most Popular</span><span className="text-text font-bold">Fatima</span></li>
              </ul>
            </div>

            {/* Prophet Naming Hadith Box */}
            <div className="order-3 lg:order-2 bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">🌙 Naming History</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ loved the name <strong className="text-text">Fatimah</strong> so much that he gave it to his own daughter. She is known as <em>"Az-Zahra"</em> (the Radiant One) and <em>"Sayyidat Nisa' al-Jannah"</em> (Leader of the Women of Paradise). It remains the absolute pinnacle of honor and piety in Islamic nomenclature.
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

export default GirlNamesFArticle;
