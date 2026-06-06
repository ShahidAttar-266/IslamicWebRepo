import { useState } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_NUMBER = '918275360063';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Assalamu Alaikum! I am interested in getting personal Islamic name suggestions for my baby. Please help me.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

/**
 * A premium, dismissible sticky announcement bar displayed above the site header.
 * Matches the green Islamic theme defined in tailwind.config.js.
 */
const AnnouncementBar = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      role="banner"
      aria-label="Special announcement"
      className="
        relative z-[60] w-full
        bg-gradient-to-r from-[#1a3328] via-[#1f3d30] to-[#1a3328]
        border-b border-[#2db87a]/30
        overflow-hidden
      "
    >
      {/* Subtle shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2db87a] to-transparent opacity-70" />

      {/* Decorative blur circles */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#2db87a]/5 blur-2xl" />
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#d4a843]/5 blur-2xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-4 pr-8 sm:pr-10">

          {/* Message block */}
          <div className="flex flex-col xs:flex-row items-center gap-1.5 xs:gap-3 text-center xs:text-left">
            <p className="text-[#e8f5ef] text-xs sm:text-sm font-medium leading-snug">
              <span className="mr-1" aria-hidden="true">📱</span>
              <span className="font-semibold text-[#2db87a]">Personal Paid Name Suggestions Available</span>
              {' – '}
              <span className="text-[#a1c2b3]">Get expert help choosing the perfect Islamic name for your baby.</span>
            </p>
            <span
              className="hidden sm:inline-flex items-center text-[#a1c2b3] text-xs font-medium shrink-0 whitespace-nowrap"
              aria-label="WhatsApp contact number"
            >
              <span className="inline-block w-px h-3.5 bg-[#2d4a3e] mx-3" aria-hidden="true" />
              WhatsApp:&nbsp;
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2db87a] font-semibold hover:text-[#d4a843] transition-colors duration-200 underline underline-offset-2 decoration-dotted"
                aria-label="WhatsApp us at +91 82753 60063"
              >
                +91 82753 60063
              </a>
            </span>
          </div>

          {/* WhatsApp CTA Button */}
          <a
            id="announcement-whatsapp-cta"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get personal Islamic name suggestions via WhatsApp"
            className="
              inline-flex items-center justify-center gap-2
              bg-[#2db87a] hover:bg-[#25a068]
              active:bg-[#1e8a58]
              text-[#0d1f1a] font-bold
              text-xs sm:text-sm
              px-4 sm:px-5 py-1.5 sm:py-2
              rounded-full
              shadow-lg shadow-[#2db87a]/25
              hover:shadow-[#2db87a]/40
              transition-all duration-200
              shrink-0
              whitespace-nowrap
            "
          >
            <span className="text-base leading-none" aria-hidden="true">💬</span>
            <span className="hidden xs:inline">Get Personal Name Suggestions</span>
            <span className="xs:hidden">WhatsApp Us</span>
          </a>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss announcement"
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          p-1.5 rounded-full
          text-[#a1c2b3] hover:text-[#e8f5ef]
          hover:bg-[#2d4a3e]/60
          transition-all duration-200
          flex items-center justify-center
        "
        style={{ minWidth: '32px', minHeight: '32px' }}
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
};

export { AnnouncementBar };
