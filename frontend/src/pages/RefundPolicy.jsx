import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <title>Refund Policy | IslamicNames</title>
        <meta name="description" content="Read the refund policy for IslamicNames. Understand our refund eligibility, process, and timelines." />
        <link rel="canonical" href="https://www.islamicnames.in/refund-policy" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Refund Policy | IslamicNames" />
        <meta property="og:description" content="Read the refund policy for IslamicNames. Understand our refund eligibility, process, and timelines." />
        <meta property="og:url" content="https://www.islamicnames.in/refund-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Refund Policy | IslamicNames" />
        <meta name="twitter:description" content="Read the refund policy for IslamicNames. Understand our refund eligibility, process, and timelines." />
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
            <RotateCcw size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Refund Policy</h1>
            <p className="text-text-muted mt-1">Last Updated: June 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-xl">
            At IslamicNames.in, we strive to provide the best experience. This Refund Policy outlines the conditions under which refunds may be issued.
          </p>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">01.</span> Overview
            </h2>
            <p>
              IslamicNames.in is primarily a free platform offering Islamic name information, meanings, and related educational content. Certain premium features or services may be offered through paid subscriptions or one-time purchases. This Refund Policy applies to all paid transactions made on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">02.</span> Eligibility for Refund
            </h2>
            <p>Refund requests may be considered under the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Duplicate or accidental payment for the same service</li>
              <li>Payment was charged but the service or feature was not delivered</li>
              <li>Technical issues on our end that prevented access to paid features</li>
              <li>Unauthorized transaction reported within 7 days of the charge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">03.</span> Non-Refundable Situations
            </h2>
            <p>Refunds will not be issued in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Change of mind after purchasing a subscription or premium feature</li>
              <li>Failure to use the service during the subscription period</li>
              <li>Violation of our Terms &amp; Conditions leading to account suspension</li>
              <li>Requests made after 30 days from the date of purchase</li>
              <li>Partial usage of a subscription period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">04.</span> Refund Request Process
            </h2>
            <p>To request a refund, please follow these steps:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Send an email to <a href="mailto:islamicnameshelp@gmail.com" className="text-primary hover:underline">islamicnameshelp@gmail.com</a> with the subject line &quot;Refund Request&quot;</li>
              <li>Include your registered email address, transaction ID, and date of purchase</li>
              <li>Provide a brief description of the reason for the refund request</li>
              <li>Attach any relevant screenshots or documentation if applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">05.</span> Processing Time
            </h2>
            <p>
              Once a refund request is received, our team will review it within 5–7 business days. If the refund is approved, the amount will be credited back to the original payment method within 7–14 business days, depending on the payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">06.</span> Partial Refunds
            </h2>
            <p>
              In certain cases, partial refunds may be granted at the sole discretion of IslamicNames.in. This may apply when a user has used a portion of a paid service before requesting a refund. The refund amount will be calculated on a pro-rata basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">07.</span> Payment Gateway Fees
            </h2>
            <p>
              Any transaction fees or processing charges imposed by third-party payment gateways (such as Razorpay, Stripe, or other payment processors) are non-refundable. Refund amounts will be the original payment amount minus applicable gateway charges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">08.</span> Dispute Resolution
            </h2>
            <p>
              If a refund request is denied and you believe the decision was incorrect, you may escalate the matter by contacting us again with additional supporting evidence. We will re-evaluate the request in good faith and provide a final decision within 10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <span className="text-primary text-sm font-black">09.</span> Policy Updates
            </h2>
            <p>
              IslamicNames.in reserves the right to modify this Refund Policy at any time. Changes will be reflected on this page with an updated date. Continued use of the platform after changes are published constitutes acceptance of the revised policy.
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

export { RefundPolicy };
