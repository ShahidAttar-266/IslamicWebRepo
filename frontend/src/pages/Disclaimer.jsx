import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Disclaimer = () => {
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
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <AlertCircle size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text">Disclaimer</h1>
            <p className="text-text-muted mt-1">Last Updated: May 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
          <p className="text-lg text-text font-medium italic border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/5 rounded-r-xl">
            The information provided on IslamicNames is for general informational purposes only. By using this website, you agree to this disclaimer.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-amber-500 text-sm font-black">01.</span> Content Accuracy
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>Name meanings and origins are based on historical and linguistic research and may vary significantly across different sources and traditions.</li>
              <li>While we strive for excellence, we do not guarantee the absolute accuracy, completeness, or reliability of any content provided on this platform.</li>
              <li>The use of any information obtained from this website is strictly at your own discretion and risk.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-amber-500 text-sm font-black">02.</span> Limitation of Responsibility
            </h2>
            <p>IslamicNames and its operators are not responsible for:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Any personal or familial decisions made based on the information provided here.</li>
              <li>Any inaccuracies, omissions, or typographical errors in the name database or historical descriptions.</li>
              <li>Any cultural or social implications resulting from the choice of a name found on our platform.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-amber-500 text-sm font-black">03.</span> Institutional Affiliation
            </h2>
            <p>
              We are an independent digital platform. We are not affiliated with, endorsed by, or representing any specific religious authority, educational institution, or government body. Our content is educational and informative in nature.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12 text-center">
            <p className="font-bold text-text mb-2">Legal Inquiry</p>
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

export default Disclaimer;
