import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navigate',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Browse Names', path: '/search' },
        { name: 'Popular Names', path: '/search?sort=-views' },
        { name: 'Articles', path: '/blog', external: false },
        { name: 'Help & FAQ', path: '/faq' },
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
        { name: 'Disclaimer', path: '/disclaimer' },
        { name: 'Refund Policy', path: '/refund-policy' },
        { name: 'Cancellation Policy', path: '/cancellation-policy' },
      ]
    }
  ];

  return (
    <footer className="bg-card border-t border-border pt-10 pb-6 md:pt-16 md:pb-8 text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-10 md:mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/logo-40.webp 40w, /logo-80.webp 80w, /logo-120.webp 120w"
                  sizes="(min-resolution: 2dppx) 80px, 40px"
                />
                <img 
                  src="/logo-40.png" 
                  srcSet="/logo-40.png 40w, /logo-80.png 80w"
                  alt="" 
                  width={40} 
                  height={40} 
                  loading="lazy" 
                  decoding="async"
                  className="h-9 w-9 md:h-10 md:w-10 group-hover:scale-105 transition-transform object-cover" 
                />
              </picture>
              <span className="font-black text-xl md:text-2xl tracking-tight text-primary">IslamicNames</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-sm italic">
              "Discover meaningful Islamic names with history and authenticity. Helping families build a timeless legacy for their children."
            </p>
            <div className="flex items-center gap-4 text-text-muted">
              <button 
                type="button"
                className="p-3 bg-bg border border-border rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Visit our official website"
                onClick={(e) => e.preventDefault()}
              >
                <Globe size={20} aria-hidden="true" />
              </button>
              <a 
                href="mailto:islamicnameshelp@gmail.com" 
                className="p-3 bg-bg border border-border rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Send us an email"
              >
                <Mail size={20} aria-hidden="true" />
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
                    {link.external ? (
                      <a 
                        href={link.path} 
                        className="text-sm text-text-muted hover:text-text transition-colors flex items-center group gap-2 py-1"
                      >
                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary font-black">•</span>
                        {link.name}
                      </a>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="text-sm text-text-muted hover:text-text transition-colors flex items-center group gap-2 py-1"
                      >
                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary font-black">•</span>
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
