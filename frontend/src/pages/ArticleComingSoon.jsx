import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Calendar, Eye, User, Sparkles, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import { ARTICLES } from '../utils/articles-data';

const WHATSAPP_NUMBER = '918275360063';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Assalamu Alaikum! I am interested in getting personal Islamic name suggestions for my baby. Please help me.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const EMAIL_ADDRESS = 'islamicnameshelp@gmail.com';
const EMAIL_SUBJECT = encodeURIComponent('Islamic Baby Name Suggestion Request');
const EMAIL_BODY = encodeURIComponent(
  'Assalamu Alaikum! I am interested in getting personal Islamic name suggestions for my baby. Please help me.'
);
const EMAIL_URL = `mailto:${EMAIL_ADDRESS}?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`;

const ArticleComingSoon = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const foundArticle = ARTICLES.find((a) => a.slug === slug);
    if (foundArticle) {
      setArticle(foundArticle);
    } else {
      // Fallback/Redirect to blog if slug is invalid
      navigate('/blog', { replace: true });
    }
  }, [slug, navigate]);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-text-muted animate-pulse">Loading article information...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} — IslamicNames</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="space-y-8">
        {/* Breadcrumb & Meta */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-primary transition-colors">Articles</Link>
            <ChevronRight size={12} />
            <span className="text-text truncate max-w-[150px] md:max-w-none">{article.tag}</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              {article.tag} · Coming Soon
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              {article.title}
            </h1>

            <p className="text-base md:text-xl text-text-muted leading-relaxed max-w-4xl">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted border-t border-b border-border/40 py-4 mt-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readTime} read</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> 1,200 views</span>
              <span className="flex items-center gap-1.5"><User size={14} /> IslamicNames Team</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Area */}
        <div 
          className="relative h-48 md:h-64 rounded-3xl overflow-hidden flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${article.gradientFrom}, ${article.gradientTo})`,
          }}
        >
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <span className="font-arabic text-9xl md:text-[14rem] text-white/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {article.arabicLetter}
          </span>
          <span className="font-arabic text-6xl md:text-8xl text-white drop-shadow-2xl font-bold select-none">
            {article.arabicLetter}
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Coming Soon Template */}
          <article className="lg:col-span-2 space-y-8 pr-0 lg:pr-4">
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
                <BookOpen size={32} />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-black text-text">
                  Article Coming Soon
                </h2>
                <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                  Our research scholars and editors are currently compiling and verifying the details for this guide, including direct Quranic references, accurate meanings, and historical significance.
                </p>
              </div>

              <div className="h-px bg-border max-w-md mx-auto" />

              <div className="space-y-4 max-w-md mx-auto">
                <p className="text-xs font-bold text-accent uppercase tracking-wider">
                  Need Immediate Suggestion Help?
                </p>
                <p className="text-xs text-text-muted leading-relaxed">
                  You can get direct premium personalized name suggestions for your baby today from our experts. Contact us directly:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    💬 WhatsApp Us
                  </a>
                  <a
                    href={EMAIL_URL}
                    className="px-6 py-2.5 bg-accent hover:bg-opacity-95 text-bg font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    ✉️ Email Us
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  <ArrowLeft size={14} /> Back to Articles
                </Link>
              </div>
            </div>
          </article>

          {/* Right Column: Sidebar */}
          <aside className="space-y-6">
            {/* Quick Facts Widget */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent border-b border-border pb-3 mb-4">
                📊 Topic Overview
              </h3>
              <ul className="divide-y divide-border/40 text-xs">
                <li className="py-2 flex justify-between items-center">
                  <span className="text-text-muted font-medium">Status</span>
                  <span className="text-accent font-bold">Researching</span>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <span className="text-text-muted font-medium">Category</span>
                  <span className="text-text font-bold">{article.tag}</span>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <span className="text-text-muted font-medium">Estimated Reading</span>
                  <span className="text-text font-bold">{article.readTime}</span>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <span className="text-text-muted font-medium font-arabic">Root Letter</span>
                  <span className="text-text font-bold font-arabic text-sm">{article.arabicLetter}</span>
                </li>
              </ul>
            </div>

            {/* Hadith Box */}
            <div className="bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">Naming Sunnah</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ said: <em className="text-text">"Verily, on the Day of Resurrection you will be called by your names and your fathers' names, so give yourselves good names."</em> Good names are those with positive meanings, Quranic connections, or referencing prophets and companions.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
};

export default ArticleComingSoon;
