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
            By accessing and using IslamicNames.in, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Use of Website
            </h2>
            <p>
              By accessing and using IslamicNames.in, you agree to use the website only for lawful purposes and in compliance with all applicable laws and regulations. Unauthorized use of the platform, including misuse of content, data scraping, fraudulent activities, or attempts to disrupt services, may result in suspension or permanent termination of access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> Content Accuracy
            </h2>
            <p>
              IslamicNames.in provides Islamic names, meanings, translations, and related informational content for educational and informational purposes only. While we strive to maintain accurate and updated information, we do not guarantee the completeness, reliability, or absolute accuracy of any content published on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> User Accounts
            </h2>
            <p>
              Users are responsible for maintaining the confidentiality of their account credentials, including passwords and login information. Any activity performed through a user account shall be considered the responsibility of the account holder. IslamicNames.in reserves the right to suspend accounts involved in suspicious, abusive, or fraudulent activities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Free Service
            </h2>
            <p>
              IslamicNames.in is a completely free service dedicated to providing accessible Islamic name information. We do not charge subscriptions, hide content behind paywalls, or collect payment information. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Intellectual Property
            </h2>
            <p>
              All content available on IslamicNames.in, including but not limited to text, graphics, logos, Arabic calligraphy, website design, branding elements, and software components, is the intellectual property of IslamicNames.in and is protected under applicable copyright and intellectual property laws. Unauthorized reproduction or redistribution is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">06.</span> Limitation of Liability
            </h2>
            <p>
              IslamicNames.in shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of the website, its content, or premium services. Users access and use the platform at their own discretion and risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">07.</span> Third-Party Services
            </h2>
            <p>
              The website may integrate third-party services including payment gateways, analytics tools, cloud hosting providers, and communication services. IslamicNames.in is not responsible for the policies, practices, or service interruptions of third-party providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">08.</span> Termination of Access
            </h2>
            <p>
              We reserve the right to suspend, restrict, or terminate access to the website or premium services without prior notice if any misuse, violation of terms, fraudulent transaction, or suspicious activity is detected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">09.</span> Changes to Terms
            </h2>
            <p>
              IslamicNames.in reserves the right to modify or update these Terms & Conditions at any time. Continued use of the platform after changes are published constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">10.</span> Contact Information
            </h2>
            <p>
              For support, payment-related issues, or legal concerns, users may contact us through the official contact details provided on the website.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Contact</p>
            <a 
              href="mailto:support@islamicnames.in" 
              className="text-primary hover:underline font-medium text-lg"
            >
              support@islamicnames.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
