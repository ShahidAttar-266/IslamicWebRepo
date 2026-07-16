import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { ArrowLeft, ExternalLink, Tag, ShoppingBag, Loader2, PackageOpen, Info } from 'lucide-react';
import api from '../api/axios';

const COUNTRY_FLAGS = {
  'IN': '🇮🇳',
  'US': '🇺🇸',
  'GB': '🇬🇧',
  'AE': '🇦🇪',
  'SA': '🇸🇦',
  'PK': '🇵🇰',
  'BD': '🇧🇩',
  'MY': '🇲🇾',
  'ID': '🇮🇩',
};

const COUNTRY_NAMES = {
  'IN': 'India',
  'US': 'United States',
  'GB': 'United Kingdom',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
};

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #1A3A1A, #2D6A2D)',
  'linear-gradient(135deg, #A0305A, #D4607A)',
  'linear-gradient(135deg, #4A2D6A, #7A4FA5)',
  'linear-gradient(135deg, #2D4A6A, #4A7AB5)',
  'linear-gradient(135deg, #6A4A2D, #B57A4A)',
  'linear-gradient(135deg, #2D6A5A, #4AB59A)',
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Resolve links — prefer affiliateLinks[], fall back to affiliateUrl
  const getProductLinks = (prod) => {
    if (prod.affiliateLinks && prod.affiliateLinks.length > 0) {
      return prod.affiliateLinks;
    }
    if (prod.affiliateUrl) {
      return [{ label: 'Buy Now', url: prod.affiliateUrl, countryCode: '' }];
    }
    return [];
  };

  const getGradient = (prod) => {
    if (prod.gradient) {
      return `linear-gradient(${prod.gradient})`;
    }
    return GRADIENT_PRESETS[0];
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-text-muted text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (isError || !product) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-card border border-border flex items-center justify-center">
          <PackageOpen size={28} className="text-text-muted" />
        </div>
        <p className="text-text font-semibold text-lg mb-2">Product Not Found</p>
        <p className="text-text-muted text-sm mb-6">This product may have been removed or the link is invalid.</p>
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 bg-primary text-bg px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </button>
      </div>
    );
  }

  const links = getProductLinks(product);

  return (
    <>
      <Helmet>
        <title>{product.name} — Shop | IslamicNames</title>
        <meta name="description" content={product.description || `${product.name} — curated Islamic product recommendation.`} />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <m.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary font-medium transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Shop
          </button>
        </m.div>

        {/* Product Card */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Hero Image / Gradient */}
          <div
            className="relative w-full h-56 sm:h-72 md:h-80 flex items-center justify-center overflow-hidden"
            style={{ background: product.imageUrl ? undefined : getGradient(product) }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain bg-gradient-to-b from-black/5 to-black/10"
              />
            ) : (
              <ShoppingBag size={56} className="text-white/80" />
            )}

            {/* Category Badge */}
            {product.category && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
                <Tag size={11} />
                {product.category}
              </span>
            )}
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Title + Price Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <m.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-text leading-snug"
              >
                {product.name}
              </m.h1>

              {product.price && (
                <m.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="inline-flex items-center bg-primary/10 text-primary text-lg font-bold px-4 py-1.5 rounded-xl whitespace-nowrap self-start"
                >
                  {product.price}
                </m.span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="text-sm sm:text-base text-text-muted leading-relaxed"
              >
                {product.description}
              </m.p>
            )}

            {/* Affiliate Disclaimer */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="flex gap-3 bg-accent/7 border border-accent/25 rounded-xl p-3.5 text-xs text-text-muted leading-relaxed"
            >
              <Info size={15} className="text-accent shrink-0 mt-0.5" />
              <span>
                <strong className="text-text">As an Amazon Associate I earn from qualifying purchases.</strong>{' '}
                The link{links.length > 1 ? 's' : ''} below {links.length > 1 ? 'are' : 'is an'} affiliate link{links.length > 1 ? 's' : ''}.
              </span>
            </m.div>

            {/* Purchase Links Section */}
            {links.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Tag size={11} />
                    {links.length > 1 ? 'Purchase Links' : 'Purchase Link'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {links.map((link, i) => {
                    const flag = link.countryCode && COUNTRY_FLAGS[link.countryCode];
                    const countryName = link.countryCode && COUNTRY_NAMES[link.countryCode];

                    return (
                      <m.a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                        className="group/link flex items-center gap-3 bg-primary text-bg px-5 py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200"
                      >
                        {flag && (
                          <span className="text-lg">{flag}</span>
                        )}
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="truncate">{link.label || 'Buy Now'}</span>
                          {countryName && (
                            <span className="text-[10px] opacity-75 font-normal">{countryName}</span>
                          )}
                        </div>
                        <ExternalLink size={14} className="shrink-0 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                      </m.a>
                    );
                  })}
                </div>
              </m.div>
            )}

            {/* No Links State */}
            {links.length === 0 && (
              <div className="text-center py-6">
                <p className="text-text-muted text-sm">No purchase links available for this product yet.</p>
              </div>
            )}
          </div>
        </m.div>
      </div>
    </>
  );
};

export default ProductDetail;
