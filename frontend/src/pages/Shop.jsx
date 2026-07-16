import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { ShoppingBag, ExternalLink, Tag, Info, Loader2, PackageOpen } from 'lucide-react';
import api from '../api/axios';

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #1A3A1A, #2D6A2D)',
  'linear-gradient(135deg, #A0305A, #D4607A)',
  'linear-gradient(135deg, #4A2D6A, #7A4FA5)',
  'linear-gradient(135deg, #2D4A6A, #4A7AB5)',
  'linear-gradient(135deg, #6A4A2D, #B57A4A)',
  'linear-gradient(135deg, #2D6A5A, #4AB59A)',
];

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

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products', activeCategory],
    queryFn: async () => {
      const params = activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : '';
      const res = await api.get(`/products${params}`);
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Get all products for category extraction
  const { data: allProducts = [] } = useQuery({
    queryKey: ['shop-products', 'All'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))];

  const getGradient = (product, index) => {
    if (product.gradient) {
      return `linear-gradient(${product.gradient})`;
    }
    return GRADIENT_PRESETS[index % GRADIENT_PRESETS.length];
  };

  // Resolve links — prefer affiliateLinks[], fall back to affiliateUrl
  const getProductLinks = (product) => {
    if (product.affiliateLinks && product.affiliateLinks.length > 0) {
      return product.affiliateLinks;
    }
    if (product.affiliateUrl) {
      return [{ label: 'Buy Now', url: product.affiliateUrl, countryCode: '' }];
    }
    return [];
  };

  return (
    <>
      <Helmet>
        <title>Shop — Curated Islamic Products | IslamicNames</title>
        <meta name="description" content="Discover curated books, gifts, and keepsakes for Muslim families. Handpicked recommendations for naming ceremonies and welcoming a new baby." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center py-6 md:py-10">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-xs text-primary font-medium tracking-wide mb-5"
          >
            <ShoppingBag size={14} />
            CURATED FOR MUSLIM FAMILIES
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-text mb-3"
          >
            Recommended Picks
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm md:text-base text-text-muted max-w-md mx-auto leading-relaxed"
          >
            Books, keepsakes and gifts for naming and welcoming a new baby.
          </m.p>
        </div>

        {/* Affiliate Disclaimer */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex gap-3 bg-accent/7 border border-accent/25 rounded-xl p-4 text-sm text-text-muted mb-8 leading-relaxed"
        >
          <Info size={18} className="text-accent shrink-0 mt-0.5" />
          <span>
            <strong className="text-text">As an Amazon Associate I earn from qualifying purchases.</strong>{' '}
            Some links below are affiliate links.
          </span>
        </m.div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'bg-card border-border text-text-muted hover:border-primary/30 hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-32 bg-border/30" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-border/30 rounded w-3/4" />
                  <div className="h-3 bg-border/30 rounded w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-3 bg-border/30 rounded w-16" />
                    <div className="h-6 bg-border/30 rounded w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-card border border-border flex items-center justify-center">
              <PackageOpen size={28} className="text-text-muted" />
            </div>
            <p className="text-text-muted font-medium">No products available yet.</p>
            <p className="text-text-muted/60 text-sm mt-1">Check back soon for curated recommendations!</p>
          </m.div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => {
              const links = getProductLinks(product);
              const hasMultipleLinks = links.length > 1;
              const primaryLink = links[0]?.url || '#';

              return (
                <m.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
                >
                  {/* Card Header — Image or Gradient (clickable to product detail page) */}
                  <Link
                    to={`/shop/${product._id}`}
                    className="block"
                  >
                    <div
                      className="h-36 flex items-center justify-center relative overflow-hidden"
                      style={{ background: product.imageUrl ? undefined : getGradient(product, index) }}
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <ShoppingBag size={32} className="text-white/90" />
                      )}
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link to={`/shop/${product._id}`} className="block">
                      <h2 className="text-sm font-semibold text-text leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h2>
                    </Link>

                    {product.description && (
                      <p className="text-xs text-text-muted leading-relaxed mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {product.price && (
                      <p className="text-base font-bold text-text mb-3">
                        {product.price}
                      </p>
                    )}

                    {/* Footer with Links */}
                    <div className="mt-auto pt-3 border-t border-border/50 space-y-2.5">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Tag size={10} />
                        Paid link{hasMultipleLinks ? 's' : ''}
                      </span>

                      {/* Single Link — full-width button */}
                      {!hasMultipleLinks && (
                        <a
                          href={primaryLink}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold bg-primary text-bg px-3 py-2 rounded-lg hover:shadow-md hover:shadow-primary/20 transition-all"
                        >
                          {links[0]?.countryCode && COUNTRY_FLAGS[links[0].countryCode]
                            ? `${COUNTRY_FLAGS[links[0].countryCode]} `
                            : ''
                          }
                          {links[0]?.label || 'View'}
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {/* Multiple Links — side by side region buttons */}
                      {hasMultipleLinks && (
                        <div className="flex gap-2">
                          {links.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold bg-primary text-bg px-2 py-2 rounded-lg hover:shadow-md hover:shadow-primary/20 transition-all text-center"
                            >
                              {link.countryCode && COUNTRY_FLAGS[link.countryCode]
                                ? <span>{COUNTRY_FLAGS[link.countryCode]}</span>
                                : null
                              }
                              <span className="truncate">{link.label || 'Buy'}</span>
                              <ExternalLink size={10} className="shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
