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
          <p className="text-lg text-text font-medium italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
            At IslamicNames.in, we value your privacy and are committed to protecting your personal information.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Introduction
            </h2>
            <p>
              At IslamicNames.in, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard user data when you access our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> Information We Collect
            </h2>
            <p>
              We may collect personal information including your name, email address, account details, payment-related information, device information, IP address, browser type, and usage data when you interact with our platform or subscribe to premium services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> Use of Information
            </h2>
            <p>The information collected is used to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide and improve our services</li>
              <li>Process payments and subscriptions</li>
              <li>Manage user accounts</li>
              <li>Send important notifications and updates</li>
              <li>Improve website performance and user experience</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Payments & Payment Security
            </h2>
            <p>
              Payments on IslamicNames.in are securely processed through authorized third-party payment gateways such as Razorpay. We do not store complete debit card, credit card, UPI PIN, or banking credentials on our servers. Payment information is handled securely by certified payment providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Cookies & Tracking Technologies
            </h2>
            <p>
              We may use cookies, analytics tools, and similar technologies to enhance user experience, analyze website traffic, remember preferences, and improve platform functionality. Users may disable cookies through their browser settings if desired.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">06.</span> Data Sharing
            </h2>
            <p>
              We do not sell or rent personal information to third parties. However, we may share limited information with trusted service providers including payment gateways, cloud hosting providers, email delivery services, and analytics platforms strictly for operational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">07.</span> Data Protection
            </h2>
            <p>
              We implement reasonable technical and organizational security measures to protect user information from unauthorized access, misuse, disclosure, or alteration. Despite our efforts, no online platform can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">08.</span> Third-Party Services
            </h2>
            <p>
              IslamicNames.in may contain links or integrations with third-party services. We are not responsible for the privacy practices, policies, or content of external websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">09.</span> User Rights
            </h2>
            <p>
              Users may request access, correction, or deletion of their personal data by contacting us through the official support channels provided on the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">10.</span> Children's Privacy
            </h2>
            <p>
              IslamicNames.in is not intended for children under the age required by applicable laws without parental supervision. We do not knowingly collect sensitive information from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">11.</span> Policy Updates
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our services, technologies, or legal requirements. Continued use of the website after updates constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">12.</span> Contact Information
            </h2>
            <p>
              For questions regarding this Privacy Policy or data-related concerns, users may contact us using the contact details available on IslamicNames.in.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Contact Us</p>
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

export default Privacy;
