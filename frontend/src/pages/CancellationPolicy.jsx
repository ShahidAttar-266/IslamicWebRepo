import { ArrowLeft, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const CancellationPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <title>Cancellation Policy | IslamicNames</title>
        <meta name="description" content="Read the cancellation policy for IslamicNames. Learn how to cancel subscriptions and understand cancellation terms." />
        <link rel="canonical" href="https://www.islamicnames.in/cancellation-policy" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Cancellation Policy | IslamicNames" />
        <meta property="og:description" content="Read the cancellation policy for IslamicNames. Learn how to cancel subscriptions and understand cancellation terms." />
        <meta property="og:url" content="https://www.islamicnames.in/cancellation-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cancellation Policy | IslamicNames" />
        <meta name="twitter:description" content="Read the cancellation policy for IslamicNames. Learn how to cancel subscriptions and understand cancellation terms." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />
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
            <XCircle size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Cancellation Policy</h1>
            <p className="text-text-muted mt-1">Last Updated: June 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
            At IslamicNames.in, we want to ensure transparency regarding subscription cancellations. This policy explains how cancellations work and what to expect.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Overview
            </h2>
            <p>
              This Cancellation Policy applies to all paid subscriptions and premium services offered on IslamicNames.in. Users who have subscribed to any paid plan may cancel their subscription at any time, subject to the terms outlined below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> How to Cancel
            </h2>
            <p>You can cancel your subscription through the following methods:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Log in to your account and navigate to <strong>Account Settings → Subscription</strong> to manage or cancel your plan</li>
              <li>Send a cancellation request to <a href="mailto:islamicnameshelp@gmail.com" className="text-primary hover:underline">islamicnameshelp@gmail.com</a> with your registered email and subscription details</li>
              <li>Contact our support team through the Report Bug / Support widget on the website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> Cancellation Effective Date
            </h2>
            <p>
              When you cancel a subscription, the cancellation will take effect at the end of the current billing cycle. You will continue to have access to premium features until the end of your paid period. No further charges will be applied after cancellation is processed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Auto-Renewal
            </h2>
            <p>
              All subscriptions on IslamicNames.in are set to auto-renew by default. If you do not wish to be charged for the next billing cycle, you must cancel your subscription before the renewal date. We recommend cancelling at least 24 hours before the renewal date to avoid being charged.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Effect of Cancellation
            </h2>
            <p>Upon cancellation of your subscription:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access to premium features will remain active until the end of the current billing period</li>
              <li>Your account will revert to a free plan after the billing period expires</li>
              <li>Any saved data, favorites, and account information will be retained</li>
              <li>You may resubscribe at any time to regain access to premium features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">06.</span> Free Trial Cancellation
            </h2>
            <p>
              If you are on a free trial, you must cancel before the trial period ends to avoid being charged. Cancellation during the trial period will immediately terminate access to trial features. No charges will be applied if cancellation is completed before the trial expires.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">07.</span> Cancellation by IslamicNames.in
            </h2>
            <p>
              IslamicNames.in reserves the right to cancel or suspend a subscription without prior notice in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Violation of our Terms &amp; Conditions</li>
              <li>Fraudulent or suspicious payment activity</li>
              <li>Misuse or abuse of premium services</li>
              <li>Account involved in automated scraping or unauthorized data extraction</li>
            </ul>
            <p className="mt-2">
              In such cases, refund eligibility will be evaluated on a case-by-case basis as per our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">08.</span> Refunds on Cancellation
            </h2>
            <p>
              Cancellation of a subscription does not automatically entitle the user to a refund. Refund requests related to cancellations will be handled according to our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a>. Please refer to the Refund Policy page for detailed information on eligibility and process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">09.</span> Policy Updates
            </h2>
            <p>
              IslamicNames.in reserves the right to modify this Cancellation Policy at any time. Any changes will be reflected on this page with an updated date. Continued use of the platform after changes are published constitutes acceptance of the revised policy.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Contact Us</p>
            <a 
              href="mailto:islamicnameshelp@gmail.com" 
              className="text-primary hover:underline font-medium text-lg"
            >
              islamicnameshelp@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CancellationPolicy };
