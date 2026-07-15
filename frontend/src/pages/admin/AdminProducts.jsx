import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { Plus, Pencil, Trash2, Loader2, X, ShoppingBag, Eye, EyeOff, GripVertical, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

const COUNTRY_PRESETS = [
  { label: 'Amazon India', countryCode: 'IN', flag: '🇮🇳' },
  { label: 'Amazon USA', countryCode: 'US', flag: '🇺🇸' },
  { label: 'Amazon UK', countryCode: 'GB', flag: '🇬🇧' },
  { label: 'Amazon UAE', countryCode: 'AE', flag: '🇦🇪' },
  { label: 'Amazon SA', countryCode: 'SA', flag: '🇸🇦' },
  { label: 'Flipkart', countryCode: 'IN', flag: '🇮🇳' },
  { label: 'Custom Link', countryCode: '', flag: '🔗' },
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

const EMPTY_LINK = { label: '', url: '', countryCode: '' };

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'General',
  price: '',
  affiliateUrl: '',
  affiliateLinks: [{ label: 'Amazon India', url: '', countryCode: 'IN' }],
  imageUrl: '',
  icon: 'shopping-bag',
  gradient: '135deg,#1A3A1A,#2D6A2D',
  isActive: true,
  sortOrder: 0,
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/products/admin/all');
      return res.data.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/products', data),
    onSuccess: () => {
      toast.success('Product created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      resetForm();
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      resetForm();
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setDeleteConfirm(null);
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to delete product'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/products/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to toggle status'),
  });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    // Build affiliateLinks — migrate from legacy affiliateUrl if needed
    let links = product.affiliateLinks && product.affiliateLinks.length > 0
      ? product.affiliateLinks.map(l => ({ label: l.label || '', url: l.url || '', countryCode: l.countryCode || '' }))
      : product.affiliateUrl
        ? [{ label: 'Buy Now', url: product.affiliateUrl, countryCode: '' }]
        : [{ ...EMPTY_LINK }];

    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'General',
      price: product.price || '',
      affiliateUrl: product.affiliateUrl || '',
      affiliateLinks: links,
      imageUrl: product.imageUrl || '',
      icon: product.icon || 'shopping-bag',
      gradient: product.gradient || '135deg,#1A3A1A,#2D6A2D',
      isActive: product.isActive !== false,
      sortOrder: product.sortOrder || 0,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  // --- Affiliate Links helpers ---
  const addLink = () => {
    setForm({ ...form, affiliateLinks: [...form.affiliateLinks, { ...EMPTY_LINK }] });
  };

  const removeLink = (index) => {
    const updated = form.affiliateLinks.filter((_, i) => i !== index);
    setForm({ ...form, affiliateLinks: updated.length > 0 ? updated : [{ ...EMPTY_LINK }] });
  };

  const updateLink = (index, field, value) => {
    const updated = form.affiliateLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setForm({ ...form, affiliateLinks: updated });
  };

  const applyPreset = (index, preset) => {
    const updated = form.affiliateLinks.map((link, i) =>
      i === index ? { ...link, label: preset.label, countryCode: preset.countryCode } : link
    );
    setForm({ ...form, affiliateLinks: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    // Validate at least one link has a URL
    const validLinks = form.affiliateLinks.filter(l => l.url.trim());
    if (validLinks.length === 0) {
      toast.error('At least one affiliate link URL is required');
      return;
    }

    // Set affiliateUrl to first link for backward compat
    const submitData = {
      ...form,
      affiliateUrl: validLinks[0].url,
      affiliateLinks: validLinks.map(l => ({
        label: l.label.trim() || 'Buy Now',
        url: l.url.trim(),
        countryCode: l.countryCode.trim(),
      })),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Helper to get display info for a product's links
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text">Shop Products</h1>
          <p className="text-text-muted text-sm mt-1">Manage affiliate product listings for the shop page.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-bg px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/10"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text">
              {editingId ? 'Edit Product' : 'New Product'}
            </h2>
            <button onClick={resetForm} className="p-2 text-text-muted hover:text-text rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Stories of the Prophets — Kids Box Set"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Books, Gifts, Jewelry"
                  list="category-suggestions"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
                <datalist id="category-suggestions">
                  <option value="Books" />
                  <option value="Gifts" />
                  <option value="Jewelry" />
                  <option value="Kids" />
                  <option value="Home" />
                  <option value="Tech" />
                  <option value="General" />
                </datalist>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. ₹1999 or $24.99"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Gradient */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Gradient</label>
                <input
                  type="text"
                  value={form.gradient}
                  onChange={(e) => setForm({ ...form, gradient: e.target.value })}
                  placeholder="135deg,#1A3A1A,#2D6A2D"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.isActive ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    form.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                <span className="text-sm text-text font-medium">{form.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the product..."
                rows={3}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* ============================================ */}
            {/* Affiliate Links Section — Multi-Region */}
            {/* ============================================ */}
            <div className="border border-border rounded-xl p-4 bg-bg/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Link2 size={16} className="text-primary" />
                  <label className="text-xs font-bold text-text uppercase tracking-wider">Affiliate Links *</label>
                </div>
                <button
                  type="button"
                  onClick={addLink}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Plus size={14} />
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {form.affiliateLinks.map((link, index) => (
                  <div key={index} className="bg-bg border border-border rounded-xl p-3 space-y-3">
                    {/* Link Header with Remove */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                        {COUNTRY_FLAGS[link.countryCode] || '🔗'} Link {index + 1}
                      </span>
                      {form.affiliateLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="p-1 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-all"
                          title="Remove this link"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {COUNTRY_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => applyPreset(index, preset)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all ${
                            link.label === preset.label
                              ? 'bg-primary/15 border-primary/40 text-primary'
                              : 'bg-bg border-border text-text-muted hover:border-primary/30 hover:text-text'
                          }`}
                        >
                          {preset.flag} {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Link Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Label</label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateLink(index, 'label', e.target.value)}
                          placeholder="e.g. Amazon India"
                          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">URL *</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          placeholder="https://amzn.to/... or https://amzn.in/..."
                          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                          required={index === 0}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-text-muted mt-3 flex items-center gap-1">
                💡 Add separate links for different regions (🇮🇳 India, 🇺🇸 USA, etc.) — customers will see all options.
              </p>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-bg px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-text-muted hover:text-text border border-border hover:border-text-muted transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-text-muted font-medium">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <ShoppingBag size={40} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted font-medium">No products yet</p>
          <p className="text-text-muted/60 text-sm mt-1">Click "Add Product" to get started.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-bg/50 border-b border-border text-xs font-bold text-text-muted uppercase tracking-wider">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Links</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Product Rows */}
          {products.map((product) => {
            const links = getProductLinks(product);
            return (
              <div
                key={product._id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-border/50 items-center hover:bg-bg/30 transition-colors ${
                  !product.isActive ? 'opacity-50' : ''
                }`}
              >
                {/* Product Name + Links */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: product.imageUrl ? undefined : `linear-gradient(${product.gradient || '135deg,#1A3A1A,#2D6A2D'})` }}
                  >
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <ShoppingBag size={16} className="text-white/90" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{product.name}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-text-muted hover:text-primary truncate transition-colors bg-bg/50 px-1.5 py-0.5 rounded border border-border/50"
                          title={link.url}
                        >
                          {COUNTRY_FLAGS[link.countryCode] || '🔗'} {link.label || 'Link'}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <span className="text-xs font-medium bg-bg px-2.5 py-1 rounded-lg text-text-muted border border-border">
                    {product.category}
                  </span>
                </div>

                {/* Price */}
                <div className="md:col-span-1">
                  <span className="text-sm font-semibold text-text">{product.price || '—'}</span>
                </div>

                {/* Links Count */}
                <div className="md:col-span-1">
                  <span className="text-xs font-bold text-text-muted flex items-center gap-1">
                    <Link2 size={12} />
                    {links.length}
                  </span>
                </div>

                {/* Status */}
                <div className="md:col-span-1">
                  <button
                    onClick={() => toggleActiveMutation.mutate({ id: product._id, isActive: !product.isActive })}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
                      product.isActive
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                        : 'bg-danger/10 text-danger hover:bg-danger/20'
                    }`}
                  >
                    {product.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                    {product.isActive ? 'Live' : 'Off'}
                  </button>
                </div>

                {/* Actions */}
                <div className="md:col-span-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Edit product"
                  >
                    <Pencil size={16} />
                  </button>
                  {deleteConfirm === product._id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMutation.mutate(product._id)}
                        className="px-3 py-1.5 bg-danger text-white text-xs font-bold rounded-lg hover:bg-danger/90 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 text-xs font-bold text-text-muted hover:text-text border border-border rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(product._id)}
                      className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                      title="Delete product"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
