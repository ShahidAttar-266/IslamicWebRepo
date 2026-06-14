import React, { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  Bug, 
  ChevronRight 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const openWidget = () => setIsOpen(true);
  const closeWidget = () => setIsOpen(false);

  // Auto-close on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleEsc = useCallback((event) => {
    if (event.keyCode === 27) closeWidget();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, handleEsc]);

  const supportOptions = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      description: 'Instant chat with our team',
      icon: <MessageCircle className="text-emerald-500" size={20} />,
      action: () => {
        window.open('https://wa.me/919011531687?text=Hello%20I%20need%20help%20with%20IslamicNames', '_blank', 'noopener,noreferrer');
        closeWidget();
      },
      color: 'hover:bg-emerald-500/10'
    },
    {
      id: 'email',
      title: 'Email Us',
      description: 'shahidattar266@gmail.com',
      icon: <Mail className="text-blue-500" size={20} />,
      action: () => {
        const email = 'shahidattar266@gmail.com';
        const subject = encodeURIComponent('Support Request - IslamicNames');
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        closeWidget();
      },
      color: 'hover:bg-blue-500/10'
    },
    {
      id: 'faq',
      title: 'Help Center & FAQ',
      description: 'Quick answers to common questions',
      icon: <HelpCircle className="text-purple-500" size={20} />,
      action: () => navigate('/faq'),
      color: 'hover:bg-purple-500/10'
    },
    {
      id: 'bug',
      title: 'Report a Bug',
      description: 'Help us improve your experience',
      icon: <Bug className="text-rose-500" size={20} />,
      action: () => navigate('/report-bug'),
      color: 'hover:bg-rose-500/10'
    }
  ];

  const quickHelp = [
    { q: "Can I save names as a guest?", a: "No, you must create a free account to save names to your favorites list." },
    { q: "Is there a mobile app?", a: "We are currently a web-app, but you can 'Add to Home Screen' for a native-like experience." }
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <m.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="mb-4 px-4 py-2 bg-text text-bg rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl pointer-events-none whitespace-nowrap relative"
            >
              Need Help?
              <div className="absolute -bottom-1 right-5 w-2 h-2 bg-text rotate-45"></div>
            </m.div>
          )}
        </AnimatePresence>

        <m.button
          onClick={openWidget}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Help and Support"
          className="relative group flex items-center justify-center gap-3 w-14 h-14 sm:w-auto sm:h-auto sm:px-6 sm:py-4 bg-gradient-to-r from-primary to-emerald-700 text-bg rounded-full shadow-[0_20px_50px_rgba(45,184,122,0.3)] overflow-hidden"
        >
          {/* Subtle Glow Animation */}
          <m.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-white/20 blur-xl"
          ></m.div>
          
          <div className="relative z-10 flex items-center justify-center gap-3">
            <MessageSquare size={22} strokeWidth={2.5} className="shrink-0" />
            <span className="font-black text-xs uppercase tracking-[0.15em] hidden sm:inline-block whitespace-nowrap">Help & Support</span>
          </div>

          {/* Unread Badge */}
          <div className="absolute top-3 right-3 sm:top-3.5 sm:right-4 w-2.5 h-2.5 bg-accent rounded-full border-2 border-primary shadow-sm z-20">
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75"></div>
          </div>
        </m.button>
      </div>

      {/* Backdrop & Modal Container */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
            {/* Dark Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeWidget}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Centered Modal */}
            <m.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[420px] max-h-[85vh] bg-card/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="shrink-0 p-6 sm:p-8 border-b border-white/5 bg-gradient-to-br from-primary/20 via-transparent to-transparent">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-primary/20 rounded-2xl text-primary shadow-inner">
                      <HelpCircle size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight leading-tight">Support Center</h2>
                    </div>
                  </div>
                  <button 
                    onClick={closeWidget}
                    className="p-3 hover:bg-white/10 rounded-2xl text-text-muted hover:text-text transition-all active:scale-90"
                    aria-label="Close Support"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div className="grid grid-cols-1 gap-3">
                  {supportOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={opt.action}
                      className={`flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl transition-all duration-300 group ${opt.color} hover:border-primary/40 hover:translate-x-1 active:scale-[0.98]`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-bg/80 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                          {React.cloneElement(opt.icon, { size: 22 })}
                        </div>
                        <div className="text-left">
                          <p className="text-sm sm:text-base font-bold text-text group-hover:text-primary transition-colors">{opt.title}</p>
                          <p className="text-[10px] sm:text-xs text-text-muted font-medium italic">{opt.description}</p>
                        </div>
                        </div>
                        <ChevronRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </button>
                        ))}
                        </div>

                        <div className="pt-4 border-t border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary px-2 mb-4 flex items-center gap-2">
                        <MessageSquare size={12} /> Quick Answers
                        </h3>
                        <div className="space-y-3">
                        {quickHelp.map((item, i) => (
                        <div 
                        key={i} 
                        className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-colors hover:bg-white/[0.04]"
                        >
                        <button
                          onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left transition-colors"
                        >
                          <span className="text-xs sm:text-sm font-bold text-text/90 leading-snug">{item.q}</span>
                          <m.div
                            animate={{ rotate: activeAccordion === i ? 180 : 0, color: activeAccordion === i ? '#2db87a' : '#a1c2b3' }}
                          >                            <ChevronRight size={16} />
                          </m.div>
                        </button>
                        <AnimatePresence>
                          {activeAccordion === i && (
                            <m.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-5"
                            >
                              <div className="p-3 bg-bg/40 rounded-xl border border-white/5">
                                <p className="text-xs text-text-muted leading-relaxed italic">
                                  {item.a}
                                </p>
                              </div>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-5 sm:p-6 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3">
                <p className="text-[9px] text-center text-text-muted font-bold uppercase tracking-tighter opacity-80">                  Secured by IslamicNames Cloud Support
                </p>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(45, 184, 122, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 184, 122, 0.2);
        }
      `}</style>
    </>
  );
};

export default SupportWidget;
