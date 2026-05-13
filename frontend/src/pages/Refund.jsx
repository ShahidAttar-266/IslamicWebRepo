import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Refund = () => {
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
            <CreditCard size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Refund Policy</h1>
            <p className="text-text-muted mt-1">Last Updated: May 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic">
            At IslamicNames, we strive to provide quality services. By purchasing a subscription, you agree to the following policy.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> No Refund Policy
            </h2>
            <p>
              All purchases are final. We do not offer refunds once a payment is completed and premium access has been granted to your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> Exceptions
            </h2>
            <p>Refunds may be considered only in specific cases of:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Duplicate payments for the same subscription period</li>
              <li>Verified technical errors from our side that prevent service access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> Request Process
            </h2>
            <p>
              To request a refund (if applicable), you must contact our support team within <strong>3 days</strong> of the purchase date. Please include your transaction ID and account email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Processing Time
            </h2>
            <p>
              Approved refunds will be processed within <strong>7–10 business days</strong>. Note that bank processing times may vary.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Payment Gateway
            </h2>
            <p>
              Refunds will be issued through the original payment method via our secure payment provider. We cannot issue refunds to alternative bank accounts or credit cards.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Support Contact</p>
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

export default Refund;
