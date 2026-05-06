import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
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
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Terms & Conditions</h1>
            <p className="text-text-muted mt-1">Effective Date: May 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
            By using NoorNames, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Use of Website
            </h2>
            <p>
              You agree to use this website only for lawful purposes and not misuse the content or services. Any unauthorized use of the platform may result in suspension of access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> Content
            </h2>
            <p>
              All names, meanings, and content are provided for informational purposes. While we strive for excellence, we do not guarantee absolute accuracy, completeness, or reliability of any information provided.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information, including your password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Payments & Subscriptions
            </h2>
            <p>
              Premium features are provided after successful payment. All subscriptions are subject to our pricing tiers. Prices and availability of plans may change without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Intellectual Property
            </h2>
            <p>
              All content on NoorNames, including text, graphics, logos, and Arabic calligraphy, is the property of NoorNames and may not be copied, reproduced, or redistributed without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">06.</span> Limitation of Liability
            </h2>
            <p>
              We are not responsible for any decisions made based on the content provided on this website. Our liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">07.</span> Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access to NoorNames if misuse is detected or if these terms are violated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">08.</span> Changes
            </h2>
            <p>
              We may update these terms at any time to reflect changes in our services or legal obligations. Continued use of the website implies acceptance of these changes.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Contact</p>
            <a 
              href="mailto:support@noornames.com" 
              className="text-primary hover:underline font-medium text-lg"
            >
              support@noornames.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;