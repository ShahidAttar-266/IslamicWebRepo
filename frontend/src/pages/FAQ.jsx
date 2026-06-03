import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
        a: 'All names in our database are researched from classical Arabic lexicons and reputable Islamic naming references. Each entry is carefully curated to ensure accuracy in meaning and permissibility.'
      },
      {
        q: 'Can I search for names by meaning or personality trait?',
        a: 'Yes! You can search by name, meaning, origin, or letter. Our comprehensive search lets you find names that carry specific traits or qualities in Arabic.'
      },
      {
        q: 'Do you include names from the Quran and Hadith?',
        a: 'Absolutely. You can filter names by Quranic reference. Each name shows the exact ayah or context it is drawn from, so you can verify the source yourself.'
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
  },
  {
    category: 'General',
    icon: '◈',
    questions: [
      {
        q: 'How can I contribute a new name or report an error?',
        a: 'We welcome community contributions! Please use our "Report a Bug" feature or email us at support@islamicnames.in if you find any inaccuracies or want to suggest a new name.'
      },
      {
        q: 'Is there a mobile app?',
        a: 'We are currently a web-app, but you can "Add to Home Screen" on your mobile browser for a native-like experience on your phone.'
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
            Everything you need to know about IslamicNames — our library and features.
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
