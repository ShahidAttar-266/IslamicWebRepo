import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-medium mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Privacy Policy</h1>
            <p className="text-text-muted mt-1">Last Updated: May 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic">
            At IslamicNames, we value your privacy and are committed to protecting your personal information.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Information We Collect
            </h2>
            <p>We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Name and email address (when you sign up or contact us)</li>
              <li>Usage data (pages visited, interactions)</li>
              <li>Payment details (processed securely via third-party providers like Razorpay; we do not store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> How We Use Your Information
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide and improve our services</li>
              <li>Manage user accounts</li>
              <li>Process payments and subscriptions</li>
              <li>Respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> Data Protection
            </h2>
            <p>
              We implement appropriate security measures to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Third-Party Services
            </h2>
            <p>
              We may use trusted third-party services (e.g., payment gateways, analytics) which may collect limited data as per their policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Cookies
            </h2>
            <p>
              We may use cookies to enhance user experience and analyze website usage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">06.</span> Your Rights
            </h2>
            <p>
              You can request access, correction, or deletion of your data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">07.</span> Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Continued use of the website implies acceptance of changes.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Contact Us</p>
            <a 
              href="mailto:support@islamicnames.com" 
              className="text-primary hover:underline font-medium text-lg"
            >
              support@islamicnames.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
