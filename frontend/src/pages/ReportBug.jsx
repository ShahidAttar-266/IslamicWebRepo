import { useState, lazy, Suspense } from 'react';
import { 
  Bug, 
  Send, 
  Monitor, 
  Smartphone, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import useAuthStore from '../store/useAuthStore';

// Lazy load motion components for maximum bundle optimization
const MotionDiv = lazy(() => import('framer-motion').then(mod => ({ default: mod.m.div })));

const ReportBug = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

    return {
      name: user?.name || '',
      email: user?.email || '',
      title: '',
      description: '',
      deviceType: isMobile ? 'Mobile' : 'Desktop',
      browser,
      severity: 'medium'
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Prepare EmailJS params (Removed screenshot)
      const templateParams = {
        name: formData.name,
        email: formData.email,
        title: formData.title,
        description: formData.description,
        device: formData.deviceType,
        browser: formData.browser,
        severity: formData.severity,
        time: new Date().toLocaleString()
      };

      // 2. Send Email
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
      toast.success('Bug report sent successfully!');
      
      // Reset form after success
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          ...formData,
          title: '',
          description: ''
        });
      }, 5000);

    } catch (err) {
      console.error('[BUG_REPORT_ERROR]', err);
      toast.error(err.message || 'Failed to send report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Suspense fallback={<div className="bg-card border border-border p-10 rounded-[2.5rem] max-w-lg w-full text-center" />}>
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border p-10 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-black text-text mb-4">Thank You!</h1>
            <p className="text-text-muted mb-8 italic">
              Your bug report has been submitted successfully. Our technical team will investigate this issue, in sha Allah.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-bg px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-primary/20"
            >
              Back to Home
            </button>
          </MotionDiv>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <Helmet>
        <title>Report a Bug | IslamicNames</title>
        <meta name="description" content="Submit feedback or report issues to help us improve the IslamicNames platform." />
        <link rel="canonical" href="https://www.islamicnames.in/report-bug" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Report a Bug | IslamicNames" />
        <meta property="og:description" content="Submit feedback or report issues to help us improve the IslamicNames platform." />
        <meta property="og:url" content="https://www.islamicnames.in/report-bug" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Report a Bug | IslamicNames" />
        <meta name="twitter:description" content="Submit feedback or report issues to help us improve the IslamicNames platform." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
              { "@type": "ListItem", "position": 2, "name": "Report Bug", "item": "https://www.islamicnames.in/report-bug" }
            ]
          })}
        </script>
      </Helmet>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest mb-8">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-4 py-1.5 mb-6 text-rose-500">
          <Bug size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Bug Tracker</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text mb-4 tracking-tight">Report a <span className="text-rose-500">Bug</span></h1>
        <p className="text-text-muted max-w-lg mx-auto italic">
          Help us improve IslamicNames. Describe the issue you've encountered and we'll fix it as soon as possible.
        </p>
      </div>

      <Suspense fallback={<div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-10 h-[400px]" />}>
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] -z-10"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="nameInput" className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                <input 
                  id="nameInput"
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-bg/50 border border-border rounded-xl px-5 py-4 text-text outline-none focus:border-rose-500/50 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="emailInput" className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                <input 
                  id="emailInput"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-bg/50 border border-border rounded-xl px-5 py-4 text-text outline-none focus:border-rose-500/50 transition-all font-bold"
                />
              </div>
            </div>

            {/* Section: Bug Details */}
            <div className="space-y-6 pt-6 border-t border-border/50">
              <div className="space-y-2">
                <label htmlFor="titleInput" className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Bug Title</label>
                <input 
                  id="titleInput"
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Navigation drawer won't close on mobile"
                  className="w-full bg-bg/50 border border-border rounded-xl px-5 py-4 text-text outline-none focus:border-rose-500/50 transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="descInput" className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Description</label>
                <textarea 
                  id="descInput"
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Please provide steps to reproduce the bug..."
                  className="w-full bg-bg/50 border border-border rounded-xl px-5 py-4 text-text outline-none focus:border-rose-500/50 transition-all font-bold resize-none"
                ></textarea>
              </div>
            </div>

            {/* Section: Environment & Severity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
              <div className="space-y-2">
                <label htmlFor="deviceInput" className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Device Type</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    {formData.deviceType === 'Mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                  </div>
                  <select 
                    id="deviceInput"
                    name="deviceType"
                    value={formData.deviceType}
                    onChange={handleChange}
                    className="w-full bg-bg/50 border border-border rounded-xl pl-12 pr-5 py-4 text-text outline-none appearance-none focus:border-rose-500/50 transition-all font-bold"
                  >
                    <option value="Desktop">Desktop</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Tablet">Tablet</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="browserInput" className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Browser</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    <Globe size={18} />
                  </div>
                  <input 
                    id="browserInput"
                    type="text"
                    name="browser"
                    value={formData.browser}
                    onChange={handleChange}
                    className="w-full bg-bg/50 border border-border rounded-xl pl-12 pr-5 py-4 text-text outline-none focus:border-rose-500/50 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="severityInput" className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Severity</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500">
                    <AlertTriangle size={18} />
                  </div>
                  <select 
                    id="severityInput"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="w-full bg-bg/50 border border-border rounded-xl pl-12 pr-5 py-4 text-text outline-none appearance-none focus:border-rose-500/50 transition-all font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                disabled={loading}
                type="submit"
                className="relative w-full flex items-center justify-center gap-3 py-5 bg-rose-500 text-bg rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:opacity-90 shadow-xl shadow-rose-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Submit Bug Report
                  </>
                )}
              </button>
            </div>
          </form>
        </MotionDiv>
      </Suspense>
    </div>
  );
};

export default ReportBug;
