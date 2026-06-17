import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqs = [
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
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(q => ({
    "@type": "Question",
    "name": q.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.a
    }
  }))
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

const HomeFAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggle = (key) => setOpenItem(prev => prev === key ? null : key);

  return (
    <section className="py-12 md:py-20">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
          <HelpCircle size={14} className="text-primary" />
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">Islamic Naming Guide</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-text mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Learn more about the significance of Islamic names, naming conventions, and find answers to common questions.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-2 px-4">
        {faqs.map((item, idx) => (
          <FAQItem
            key={idx}
            q={item.q}
            a={item.a}
            isOpen={openItem === idx}
            onClick={() => toggle(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeFAQ;