"use client";
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';


const faqs = [
  {
    category: 'Names & Meanings',
    icon: '☽',
    questions: [
      {
        q: 'What is the importance of name meanings in Islam?',
        a: 'In Islam, a name is considered a prayer and a lifelong identity. The Prophet Muhammad (peace be upon him) emphasized giving children good, meaningful names as they impact a person\'s character and are the names by which they will be called on the Day of Judgment.'
      },
      {
        q: 'What are some unique Muslim baby boy names with meaning?',
        a: 'Some unique and meaningful names for boys include: Zayd (Growth), Arham (Merciful), Shahzain (Brave), and Rayyan (Gate of Paradise). Our database features thousands of such unique options with verified meanings.'
      },
      {
        q: 'Are these names suitable for Indian Muslim families?',
        a: 'Yes, our collection is curated to include names that are widely accepted and popular among Indian Muslim families, balancing traditional Arabic roots with names that are easy to pronounce and culturally resonant in India.'
      },
      {
        q: 'When should a Muslim baby be named?',
        a: 'According to Sunnah, a baby is ideally named on the seventh day after birth, often accompanying the Aqiqah ceremony. However, naming can also be done on the day of birth or any time thereafter.'
      },
      {
        q: 'Can modern or unique names be used in Islam?',
        a: 'Yes, as long as the name has a good meaning and does not contradict Islamic beliefs or values. Islam encourages names that signify positive traits, devotion to Allah, or honor the Prophets and righteous predecessors.'
      },
      {
        q: 'Is it Sunnah to give a child a meaningful name?',
        a: 'Absolutely. It is a highly recommended Sunnah (practice of the Prophet) to choose names with beautiful meanings. The Prophet (pbuh) himself changed names of individuals that carried negative or un-Islamic connotations to better, meaningful ones.'
      },
      {
        q: 'What is the best islamic name for a girl names?',
        a: 'While "best" is subjective, names of the Sahabiyat and mothers of the believers like Khadija, Aisha, Maryam, and Fatima are considered highly blessed. Other beautiful options include Sarah, Hawa, and Zaynab.'
      },
      {
        q: 'What is the best islamic name for a boy names?',
        a: 'The Prophet (pbuh) mentioned that the most beloved names to Allah are Abdullah and Abdur-Rahman. Other excellent choices include Muhammad, Ahmad, and the names of other Prophets like Ibrahim and Yusuf.'
      },
      {
        q: 'What are the names of islamic months?',
        a: 'The twelve months of the Islamic Hijri calendar are: 1. Muharram, 2. Safar, 3. Rabi\' al-Awwal, 4. Rabi\' ath-Thani, 5. Jumada al-Ula, 6. Jumada al-Akhira, 7. Rajab, 8. Sha\'ban, 9. Ramadan, 10. Shawwal, 11. Dhu al-Qi\'dah, and 12. Dhu al-Hijjah.'
      },
      {
        q: 'What is the best islamic names for a boy in urdu?',
        a: 'Popular and meaningful Islamic names for boys in Urdu-speaking communities include Shahzain, Zohan, Ayan, Hamza, and Bilal. These names carry deep spiritual significance and have a beautiful Urdu phonetic appeal.'
      },
    ]
  },
  {
    category: 'Features',
    icon: '❋',
    questions: [
      {
        q: 'Is everything on IslamicNames free?',
        a: 'Yes! We have made our entire database, including historical backgrounds, Quranic references, and name comparison features, completely free for all users.'
      },
      {
        q: 'Can I save my favorite names?',
        a: 'Yes, by creating a free account, you can save unlimited names to your personal favorites list and access them from any device.'
      },
      {
        q: 'How does the name comparison feature work?',
        a: 'Our side-by-side comparison tool allows you to select any two names and see their meanings, origins, and historical contexts next to each other to help you decide.'
      },
      {
        q: 'Can I export my favorite names as a PDF?',
        a: 'Yes, once you have saved names to your favorites, you can export your entire list as a beautifully formatted PDF document for printing or sharing.'
      },
    ]
  }
];

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

  // Generate JSON-LD Schema
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

  return (
    <div className="min-h-screen bg-bg">
      

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
            Everything you need to know about Islamic names — meanings, traditions, and our library.
            Can't find an answer?{' '}
            <a href="mailto:support@islamicnames.in" className="text-primary hover:underline">
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
            href="mailto:support@islamicnames.in"
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
