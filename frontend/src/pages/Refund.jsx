import { ArrowLeft, CreditCard, XCircle } from 'lucide-react';
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

      {/* Refund Policy Section */}
      <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 mb-12">
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
          <p className="text-lg text-text font-medium italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
            IslamicNames.in provides digital services and subscription-based access. By purchasing a subscription, users acknowledge they are purchasing access to digital content.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Digital Services & Subscriptions
            </h2>
            <p>
              IslamicNames.in provides digital services, premium features, and subscription-based access. By purchasing a subscription or premium plan, users acknowledge that they are purchasing access to digital content and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> Refund Eligibility
            </h2>
            <p>Refund requests may be considered only in cases of:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Duplicate transactions</li>
              <li>Failed payments where access was not provided</li>
              <li>Technical issues directly caused by our platform</li>
              <li>Unauthorized transactions verified by investigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> Non-Refundable Services
            </h2>
            <p>Refunds will generally not be provided for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Change of mind after purchase</li>
              <li>Partial usage of subscription period</li>
              <li>Failure to cancel subscription before renewal</li>
              <li>User dissatisfaction unrelated to technical issues</li>
              <li>Violation of platform terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Refund Request Process
            </h2>
            <p>Users requesting a refund must contact support with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Registered email address</li>
              <li>Transaction ID</li>
              <li>Payment details</li>
              <li>Reason for refund request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Refund Processing Time
            </h2>
            <p>
              Approved refunds are generally processed within 5–10 business days depending on the payment provider and banking partner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">06.</span> Subscription Renewals
            </h2>
            <p>
              Certain subscriptions may renew automatically unless cancelled before the renewal date. Users are responsible for managing their active subscriptions.
            </p>
          </section>
        </div>
      </div>

      {/* Cancellation Policy Section */}
      <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
            <XCircle size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Cancellation Policy</h1>
            <p className="text-text-muted mt-1">Last Updated: May 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-red-500 text-sm font-black">01.</span> Subscription Cancellation
            </h2>
            <p>
              Users may cancel their active subscriptions at any time through their account settings or by contacting support before the next billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-red-500 text-sm font-black">02.</span> Effect of Cancellation
            </h2>
            <p>Once a subscription is cancelled:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Future recurring charges will stop</li>
              <li>Current subscription benefits may remain active until the end of the billing period</li>
              <li>No partial refunds will be issued for unused subscription periods unless required under applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-red-500 text-sm font-black">03.</span> Auto-Renewal
            </h2>
            <p>
              Some premium plans may renew automatically for uninterrupted access. Users are responsible for cancelling subscriptions before the renewal date if they do not wish to continue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-red-500 text-sm font-black">04.</span> Cancellation Requests
            </h2>
            <p>Users experiencing difficulty cancelling subscriptions may contact support with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Registered email address</li>
              <li>Subscription details</li>
              <li>Transaction reference</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-red-500 text-sm font-black">05.</span> Platform Rights
            </h2>
            <p>
              IslamicNames.in reserves the right to suspend or terminate subscriptions in cases of fraud, abuse, policy violations, or suspicious activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-red-500 text-sm font-black">06.</span> Changes to Cancellation Policy
            </h2>
            <p>
              We may modify this Cancellation Policy at any time to reflect changes in services or legal requirements.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Policy Support</p>
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

export default Refund;
