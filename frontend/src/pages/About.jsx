import { ArrowLeft, Info, BookOpen, Database, Users, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <title>About Us | IslamicNames</title>
        <meta name="description" content="Learn about IslamicNames — our mission to help Muslim parents find meaningful, authentic Islamic names with Arabic script, Quranic references, and scholarly-verified meanings." />
        <link rel="canonical" href="https://www.islamicnames.in/about" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="About Us | IslamicNames" />
        <meta property="og:description" content="Learn about IslamicNames — our mission to help Muslim parents find meaningful, authentic Islamic names with Arabic script, Quranic references, and scholarly-verified meanings." />
        <meta property="og:url" content="https://www.islamicnames.in/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | IslamicNames" />
        <meta name="twitter:description" content="Learn about IslamicNames — our mission to help Muslim parents find meaningful, authentic Islamic names with Arabic script, Quranic references, and scholarly-verified meanings." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
              { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://www.islamicnames.in/about" }
            ]
          })}
        </script>
      </Helmet>

      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-medium mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Info size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">About IslamicNames</h1>
            <p className="text-text-muted mt-1">Our mission, our story</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
            Helping Muslim parents across the globe discover beautiful, meaningful, and authentic Islamic names for their children.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span>
              <BookOpen size={20} className="text-primary" />
              Our Mission
            </h2>
            <p>
              At <strong>IslamicNames.in</strong>, our mission is simple yet profound: to be the most trusted, comprehensive, and 
              scholarly-accurate resource for Islamic baby names on the internet. Naming a child is one of the most sacred 
              responsibilities in Islam — the Prophet Muhammad (PBUH) taught that parents should give their children good, 
              beautiful names. We are here to make that journey joyful, informed, and deeply meaningful.
            </p>
            <p className="mt-3">
              We believe every child deserves a name that carries blessings, conveys noble qualities, and connects them to a 
              rich spiritual heritage. Whether you are a first-time parent or looking for the perfect name for a new addition 
              to your family, IslamicNames is your companion in this beautiful journey.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span>
              <Database size={20} className="text-primary" />
              Our Database
            </h2>
            <p>
              Our database contains <strong>thousands of carefully curated Islamic names</strong>, each enriched with detailed 
              information to help you make an informed choice:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Arabic Script</strong> — Authentic Arabic calligraphy for every name, ensuring correct representation.</li>
              <li><strong>Detailed Meanings</strong> — Thorough, scholar-verified explanations of each name's significance and connotations.</li>
              <li><strong>Quranic References</strong> — Exact Surah and Ayah citations for names found in the Holy Quran.</li>
              <li><strong>Historical Background</strong> — Context about notable historical figures and companions who carried the name.</li>
              <li><strong>Pronunciation Guide</strong> — Phonetic transliterations so you can pronounce each name with confidence.</li>
              <li><strong>Name Variants</strong> — Related spellings and variations across different Muslim cultures and regions.</li>
            </ul>
            <p className="mt-3">
              Every entry is rigorously <strong>cross-referenced with classical Arabic lexicons and reputable scholarly sources</strong> to 
              ensure the meanings, origins, and references you find are accurate, culturally respectful, and Islamically sound.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span>
              <Users size={20} className="text-primary" />
              Who We Are
            </h2>
            <p>
              IslamicNames is run by a <strong>passionate team dedicated to preserving and sharing Islamic heritage and naming traditions</strong>. 
              Our team includes researchers with backgrounds in Arabic linguistics, Islamic studies, and web development — all united by a 
              common love for the rich diversity of Muslim naming culture.
            </p>
            <p className="mt-3">
              We are committed to building a platform that is not only academically rigorous but also beautiful, user-friendly, and 
              accessible to families of all backgrounds. From South Asia to the Middle East, from Africa to the Western diaspora — 
              this platform is built for the entire Ummah.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span>
              <Mail size={20} className="text-primary" />
              Get in Touch
            </h2>
            <p>
              We love hearing from our users. Whether you have a suggestion, found an error, or simply want to share the name 
              you chose for your child — we would love to hear from you!
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <Link
                to="/report-bug"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors border border-primary/20"
              >
                <Mail size={18} />
                Report a Bug or Contact Us
              </Link>
              <a
                href="mailto:islamicnameshelp@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-text-muted font-medium hover:text-text hover:border-primary/50 transition-colors"
              >
                islamicnameshelp@gmail.com
              </a>
            </div>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Jazakallahu Khairan</p>
            <p className="text-text-muted text-sm italic">
              Thank you for trusting IslamicNames on your naming journey. May Allah bless your family with a name that brings joy, meaning, and barakah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
