import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navigate',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Browse Names', path: '/search' },
        { name: 'Popular Names', path: '/search?sort=-views' },
        { name: 'Help & FAQ', path: '/faq' },
        { name: 'Premium Plans', path: '/pricing' },
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Boy Names', path: '/search?gender=boy' },
        { name: 'Girl Names', path: '/search?gender=girl' },
        { name: 'Quranic Names', path: '/search?quranic=true' },
        { name: 'Arabic Roots', path: '/search?origin=arabic' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Refund Policy', path: '/refund' },
        { name: 'Disclaimer', path: '/disclaimer' },
      ]
    }
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto pt-10 pb-6 md:pt-16 md:pb-8 text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 mb-10 md:mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="IslamicNames" width="150" height="150" loading="lazy" className="h-9 w-auto md:h-10 group-hover:scale-105 transition-transform" />
              <span className="font-black text-xl md:text-2xl tracking-tight text-primary">IslamicNames</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-sm italic">
              "Discover meaningful Islamic names with history and authenticity. Helping families build a timeless legacy for their children."
            </p>
            <div className="flex items-center gap-4 text-text-muted">
              <button 
                type="button"
                className="p-3 bg-bg border border-border rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Website"
                onClick={(e) => e.preventDefault()}
              >
                <Globe size={20} />
              </button>
              <a 
                href="mailto:support@islamicnames.com" 
                className="p-3 bg-bg border border-border rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-text-muted hover:text-text transition-colors flex items-center group gap-1 py-1"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 text-primary font-black">•</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA Section */}
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
              Premium Access
            </h3>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 md:p-6 space-y-4 shadow-inner">
              <p className="text-xs text-text-muted leading-relaxed font-medium italic">
                Unlock full history, Quranic ayah texts, and comparison tools.
              </p>
              <Link 
                to="/pricing" 
                className="flex items-center justify-center gap-2 bg-primary text-bg px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-primary/10 min-h-[44px]"
              >
                Go Pro <ArrowRight size={14} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-text-muted text-[10px] md:text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={16} className="text-primary" />
            <span>Secure SSL Encrypted Platform</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
              © {currentYear} IslamicNames. All rights reserved.
            </p>
            <p className="text-[9px] text-text-muted mt-2 font-bold italic">
              "Handcrafted for the Ummah with love."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
