

const WHATSAPP_NUMBER = '918275360063';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Assalamu Alaikum! I am interested in getting personal Islamic name suggestions for my baby. Please help me.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const EMAIL_ADDRESS = 'islamicnameshelp@gmail.com';
const EMAIL_URL = `mailto:${EMAIL_ADDRESS}`;

/**
 * A premium sticky announcement bar displayed above the site header.
 * Mobile: single compact row with icon buttons.
 * Desktop: full rich layout with text links and labelled buttons.
 */
const AnnouncementBar = () => {
  return (
    <div
      role="banner"
      aria-label="Special announcement"
      className="relative z-[60] w-full bg-gradient-to-r from-[#1a3328] via-[#1f3d30] to-[#1a3328] border-b border-[#2db87a]/30 overflow-hidden"
    >
      {/* Shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2db87a] to-transparent opacity-70" />

      {/* Decorative blur circles */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#2db87a]/5 blur-2xl" />
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#d4a843]/5 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-3">

        {/* ── MOBILE layout (hidden on sm+) ── */}
        <div className="flex sm:hidden flex-col items-center gap-2 text-center py-0.5">

          {/* Row 1 – message */}
          <p className="text-[#e8f5ef] text-xs font-medium leading-snug">
            <span className="mr-0.5" aria-hidden="true">📱</span>
            <span className="font-semibold text-[#2db87a]">Personal Paid Name Suggestions Available</span>
            {' – '}
            <span className="text-[#a1c2b3]">Expert help choosing the perfect Islamic name for your baby.</span>
          </p>

          {/* Row 2 – contact buttons */}
          <div className="flex items-center gap-2">
            <a
              id="announcement-whatsapp-cta-mobile"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="inline-flex items-center justify-center gap-1.5 bg-[#2db87a] hover:bg-[#25a068] active:bg-[#1e8a58] text-[#0d1f1a] font-bold text-[11px] px-3 py-1.5 rounded-full shadow shadow-[#2db87a]/30 transition-all duration-200 whitespace-nowrap"
            >
              <span aria-hidden="true">💬</span>
              <span>WhatsApp Us</span>
            </a>
            <a
              id="announcement-email-cta-mobile"
              href={EMAIL_URL}
              aria-label="Email us at islamicnameshelp@gmail.com"
              className="inline-flex items-center justify-center gap-1.5 bg-[#d4a843] hover:bg-[#c49a38] active:bg-[#b08830] text-[#0d1f1a] font-bold text-[11px] px-3 py-1.5 rounded-full shadow shadow-[#d4a843]/30 transition-all duration-200 whitespace-nowrap"
            >
              <span aria-hidden="true">✉️</span>
              <span>Email Us</span>
            </a>
          </div>

        </div>

        {/* ── DESKTOP layout (hidden on mobile) ── */}
        <div className="hidden sm:flex items-center justify-center gap-4">

          {/* Message + contact links */}
          <div className="flex items-center gap-3 text-left">
            <p className="text-[#e8f5ef] text-sm font-medium leading-snug">
              <span className="mr-1" aria-hidden="true">📱</span>
              <span className="font-semibold text-[#2db87a]">Personal Paid Name Suggestions Available</span>
              {' – '}
              <span className="text-[#a1c2b3]">Get expert help choosing the perfect Islamic name for your baby.</span>
            </p>

            <span className="inline-flex items-center text-[#a1c2b3] text-xs font-medium shrink-0 whitespace-nowrap" aria-label="WhatsApp contact number">
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

            <span className="inline-flex items-center text-[#a1c2b3] text-xs font-medium shrink-0 whitespace-nowrap" aria-label="Email contact">
              <span className="inline-block w-px h-3.5 bg-[#2d4a3e] mx-3" aria-hidden="true" />
              ✉️&nbsp;Email:&nbsp;
              <a
                href={EMAIL_URL}
                className="text-[#2db87a] font-semibold hover:text-[#d4a843] transition-colors duration-200 underline underline-offset-2 decoration-dotted"
                aria-label="Email us at islamicnameshelp@gmail.com"
              >
                {EMAIL_ADDRESS}
              </a>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              id="announcement-whatsapp-cta"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get personal Islamic name suggestions via WhatsApp"
              className="inline-flex items-center justify-center gap-2 bg-[#2db87a] hover:bg-[#25a068] active:bg-[#1e8a58] text-[#0d1f1a] font-bold text-sm px-5 py-2 rounded-full shadow-lg shadow-[#2db87a]/25 hover:shadow-[#2db87a]/40 transition-all duration-200 whitespace-nowrap"
            >
              <span className="text-base leading-none" aria-hidden="true">💬</span>
              WhatsApp Us
            </a>
            <a
              id="announcement-email-cta"
              href={EMAIL_URL}
              aria-label="Get personal Islamic name suggestions via Email"
              className="inline-flex items-center justify-center gap-2 bg-[#d4a843] hover:bg-[#c49a38] active:bg-[#b08830] text-[#0d1f1a] font-bold text-sm px-5 py-2 rounded-full shadow-lg shadow-[#d4a843]/25 hover:shadow-[#d4a843]/40 transition-all duration-200 whitespace-nowrap"
            >
              <span className="text-base leading-none" aria-hidden="true">✉️</span>
              Email Us
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export { AnnouncementBar };
