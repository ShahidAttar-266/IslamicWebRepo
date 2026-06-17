import { ArrowLeft, HeartHandshake, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SUPPORT_EMAIL } from '../utils/contact';

const FreeService = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <title>Free Service Policy | IslamicNames</title>
        <meta name="description" content="IslamicNames is completely free. We do not charge any fees, subscriptions, or payments for browsing or finding beautiful Islamic names." />
        <link rel="canonical" href="https://www.islamicnames.in/free-service" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Free Service Policy | IslamicNames" />
        <meta property="og:description" content="IslamicNames is completely free. We do not charge any fees, subscriptions, or payments for browsing or finding beautiful Islamic names." />
        <meta property="og:url" content="https://www.islamicnames.in/free-service" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Service Policy | IslamicNames" />
        <meta name="twitter:description" content="IslamicNames is completely free. We do not charge any fees, subscriptions, or payments for browsing or finding beautiful Islamic names." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
              { "@type": "ListItem", "position": 2, "name": "Free Service", "item": "https://www.islamicnames.in/free-service" }
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
            <HeartHandshake size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Free Service Policy</h1>
            <p className="text-text-muted mt-1">Last Updated: June 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-xl">
            IslamicNames is completely free to use. We do not charge any fees, subscriptions, or payments for browsing, searching, or saving names on our platform.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Our Mission
            </h2>
            <p>
              Our primary goal is to help parents find meaningful, authentic, and beautiful Islamic names for their children. We believe this knowledge should be freely accessible to everyone without any financial barriers. 
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> No Payments & No Subscriptions
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Zero Cost:</strong> Every feature on IslamicNames—including advanced search, filter options, name comparison, and bookmarking—is 100% free.</li>
              <li><strong>No Premium Tiers:</strong> There are no locked features, paywalls, or premium memberships.</li>
              <li><strong>No Financial Info:</strong> We will never ask you for your credit card details, bank information, or payment credentials.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> How We Support the Platform
            </h2>
            <p>
              To cover server maintenance costs, domain fees, and continuous development, we rely on optional ads and/or voluntary contributions. We strive to ensure advertisements are non-intrusive and family-friendly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Security and Trust
            </h2>
            <div className="flex items-start gap-3 bg-card border border-border p-4 rounded-2xl mt-2">
              <ShieldCheck className="text-green-500 shrink-0 mt-1" size={20} />
              <p className="text-sm">
                Since we do not process payments, your financial details are completely safe. We prioritize your privacy and do not sell user data to third parties.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Frequently Asked Questions
            </h2>
            <div className="space-y-4 pl-2">
              <div className="border-b border-border/50 pb-3">
                <p className="font-bold text-text mb-1 flex items-center gap-2">
                  <HelpCircle size={16} className="text-primary" /> Will IslamicNames ever introduce a subscription model?
                </p>
                <p className="text-sm">
                  Our core lookup tools and name database will always remain completely free of charge.
                </p>
              </div>
              <div className="border-b border-border/50 pb-3">
                <p className="font-bold text-text mb-1 flex items-center gap-2">
                  <HelpCircle size={16} className="text-primary" /> Do I need to register an account to use the service?
                </p>
                <p className="text-sm">
                  No, registration is entirely optional and only needed if you wish to sync your favorite names list across multiple devices.
                </p>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2 flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-primary" /> Handcrafted for the Ummah
            </p>
            <p className="text-xs text-text-muted max-w-md mx-auto mb-4">
              If you have any questions or feedback regarding our platform, please feel free to reach out to us.
            </p>
            <a 
              href={`mailto:${SUPPORT_EMAIL}`} 
              className="text-primary hover:underline font-medium text-lg"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeService;
