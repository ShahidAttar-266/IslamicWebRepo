import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqs = [
  {
    category: 'Names & Meanings',
    icon: '☽',
    questions: [
      {
        q: 'How many Islamic names are in the IslamicNames database?',
        a: 'IslamicNames currently has thousands of verified Islamic names for boys and girls, each with Arabic script, phonetic pronunciation, root meaning, and origin. We add new names regularly based on classical sources and scholarly references.'
      },
      {
        q: 'Are the meanings of names verified by Islamic scholars?',
        a: 'All names in our database are researched from classical Arabic lexicons and reputable Islamic naming references.'
      },
      {
        q: 'Can I search for names by meaning or personality trait?',
        a: 'Yes! You can search by name, meaning, origin, or letter.'
      },
      {
        q: 'Do you include names from the Quran and Hadith?',
        a: 'Absolutely. You can filter names by Quranic reference and Prophetic Hadith. Each name shows the exact ayah or hadith it is drawn from, so you can verify the source yourself.'
      },
    ]
  },
  {
    category: 'General Islamic Naming',
    icon: '☪',
    questions: [
      {
        q: 'What is the importance of name meanings in Islam?',
        a: 'In Islam, a name is considered a significant part of a person\'s identity and is believed to have a profound impact on their life and character. Prophet Muhammad (PBUH) emphasized choosing names with good and noble meanings, as people will be called by their names and their fathers\' names on the Day of Resurrection.'
      },
      {
        q: 'What are some unique Muslim baby boy names with meaning?',
        a: 'Some unique Muslim baby boy names include Aydin (Brilliant, Enlightened), Zayd (Growth, Abundance), Rayyan (Gates of Heaven), and Ihsan (Perfection, Excellence). You can explore our database to find more unique names tailored to your preferences.'
      },
      {
        q: 'Are these names suitable for Indian Muslim families?',
        a: 'Yes, our collection includes a wide variety of names that are perfectly suitable for Indian Muslim families. We offer names that are popular across different cultures and regions, including traditional, modern, and Urdu-origin names that are widely used in India.'
      },
      {
        q: 'When should a Muslim baby be named?',
        a: 'According to Islamic tradition (Sunnah), it is recommended to name a baby on the first day of birth, or on the seventh day during the Aqiqah ceremony. Both practices are accepted and widely followed in the Muslim community.'
      },
      {
        q: 'Can modern or unique names be used in Islam?',
        a: 'Yes, modern or unique names can be used in Islam as long as they hold a good meaning, do not contradict Islamic monotheism (Tawheed), and are not associated with negative traits or polytheism.'
      },
      {
        q: 'Is it Sunnah to give a child a meaningful name?',
        a: 'Yes, it is highly recommended and considered a Sunnah to give a child a beautiful and meaningful name. The Prophet (PBUH) often changed names of people and places if they had negative or unpleasant meanings.'
      },
      {
        q: 'What is the best Islamic name for a girl?',
        a: 'The "best" name is subjective, but some of the most highly regarded Islamic names for girls include Maryam, Fatima, Aisha, and Khadija, who were significant women in Islamic history. Other beautiful names include Aayat (Sign/Miracle), Noor (Light), and Inaya (Care/Concern).'
      },
      {
        q: 'What is the best Islamic name for a boy?',
        a: 'The Prophet Muhammad (PBUH) mentioned that the most beloved names to Allah are Abdullah (Servant of Allah) and Abdur-Rahman (Servant of the Most Merciful). Other excellent choices include Muhammad, Ibrahim, Umar, and Ali.'
      },
      {
        q: 'What are the names of the Islamic months?',
        a: 'The 12 Islamic (Hijri) months are: Muharram, Safar, Rabi\' al-Awwal, Rabi\' al-Thani, Jumada al-Awwal, Jumada al-Thani, Rajab, Sha\'ban, Ramadan, Shawwal, Dhu al-Qi\'dah, and Dhu al-Hijjah.'
      },
      {
        q: 'What is the best Islamic name for a boy in Urdu?',
        a: 'Some of the best Islamic names for boys popular in Urdu-speaking cultures include Arham (Merciful), Zeeshan (Dignified), Faizan (Grace/Beneficence), and Shahzaib (Crown of a King).'
      }
    ]
  },
  {
    category: 'Features',
    icon: '❋',
    questions: [
      {
        q: 'What does the name certificate include?',
        a: 'The digital name certificate is a beautifully designed card featuring the name in Arabic calligraphy, its transliteration, full meaning, and a short Islamic blessing — perfect for sharing on WhatsApp, framing, or printing.'
      },
      {
        q: 'How does the name pronunciation audio work?',
        a: 'Each name includes a phonetic pronunciation guide to help in understanding the proper articulation.'
      },
      {
        q: 'Is there an API for developers?',
        a: 'Currently, we focus on providing the best experience through our web application. Enterprise or API access for developers is part of our future roadmap.'
      },
    ]
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.flatMap(section => 
    section.questions.map(q => ({
      "@type": "Question",
      "name": q.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.a
      }
    }))
  )
};

const FAQItem = ({ q, a, isOpen, onClick }) => (
  <div
    className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${
      isOpen ? 'bg-card shadow-lg shadow-black/30' : 'bg-transparent hover:bg-card/40'
    }`}
  >
    <button
      className="w-full text-left px-5 py-4 flex items-start gap-4 group"
      onClick={onClick}
    >
      <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? 'border-primary bg-primary/20 text-primary'
          : 'border-border text-text-muted group-hover:border-primary/50'
      }`}>
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </span>
      <span className={`font-semibold text-sm leading-snug flex-1 transition-colors duration-200 ${
        isOpen ? 'text-text' : 'text-text-muted group-hover:text-text'
      }`}>
        {q}
      </span>
    </button>

    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
      <div className="overflow-hidden">
        <p className="px-5 pb-5 pl-14 text-text-muted text-sm leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  </div>
);

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null); // "catIdx-qIdx"

  const toggle = (key) => setOpenItem(prev => prev === key ? null : key);

  return (
    <div className="min-h-screen bg-bg">
      <Helmet>
        <title>Frequently Asked Questions About Islamic Names | IslamicNames</title>
        <meta name="description" content="Frequently Asked Questions about Islamic names, meanings, scholars verification, and how to choose the right name." />
        <link rel="canonical" href="https://www.islamicnames.in/faq" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Frequently Asked Questions About Islamic Names | IslamicNames" />
        <meta property="og:description" content="Frequently Asked Questions about Islamic names, meanings, scholars verification, and how to choose the right name." />
        <meta property="og:url" content="https://www.islamicnames.in/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Frequently Asked Questions About Islamic Names | IslamicNames" />
        <meta name="twitter:description" content="Frequently Asked Questions about Islamic names, meanings, scholars verification, and how to choose the right name." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
              { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://www.islamicnames.in/faq" }
            ]
          })}
        </script>
      </Helmet>
      {/* Arabic geometric background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232db87a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-16 md:py-24">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <HelpCircle size={14} className="text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Help Centre</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text mb-4 leading-tight tracking-tight">
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </h1>

          <p className="text-text-muted text-base max-w-md mx-auto leading-relaxed">
            Everything you need to know about IslamicNames — names and features.
            Can't find an answer?{' '}
            <a href="mailto:islamicnameshelp@gmail.com" className="text-primary hover:underline">
              Contact us
            </a>.
          </p>

          <p className="font-arabic text-accent/50 text-3xl mt-6 tracking-widest">
            بِسْمِ اللّهِ
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((section, catIdx) => (
            <div key={catIdx}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-accent text-lg">{section.icon}</span>
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-text-muted">
                  {section.category}
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-2">
                {section.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  return (
                    <FAQItem
                      key={key}
                      q={item.q}
                      a={item.a}
                      isOpen={openItem === key}
                      onClick={() => toggle(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center bg-card border border-border rounded-3xl p-10">
          <p className="text-2xl font-black text-text mb-2">Still have questions?</p>
          <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            Our team is happy to help. Reach out and we'll respond within 24 hours, in sha Allah.
          </p>
          <a
            href="mailto:islamicnameshelp@gmail.com"
            className="inline-block bg-primary text-bg font-black text-sm uppercase tracking-widest px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Email Support
          </a>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
