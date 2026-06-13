import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import {
  Copy,
  Trash2,
  Shield,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const GENDER_COLORS = {
  boy: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  girl: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  unisex: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
};

/**
 * Admin page for detecting and removing duplicate names.
 * Groups duplicates by normalized nameEnglish + gender,
 * lets the admin pick which to keep, and removes the rest.
 */
const AdminDuplicates = () => {
  const queryClient = useQueryClient();
  const [selectedToRemove, setSelectedToRemove] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-duplicates'],
    queryFn: async () => {
      const res = await api.get('/admin/names/duplicates');
      return res.data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (idsToRemove) => {
      const res = await api.delete('/admin/names/duplicates', {
        data: { idsToRemove },
      });
      return res.data;
    },
    onSuccess: (result) => {
      toast.success(result.message || 'Duplicates removed successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-duplicates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-names'] });
      setSelectedToRemove({});
      setShowConfirm(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || 'Failed to remove duplicates');
    },
  });

  /**
   * Auto-select all duplicates except the first (best) in each group.
   */
  const handleAutoSelect = () => {
    if (!data?.data) return;

    const autoSelected = {};
    data.data.forEach((group, groupIndex) => {
      group.docs.forEach((doc, docIndex) => {
        if (docIndex > 0) {
          const key = `${groupIndex}-${doc._id}`;
          autoSelected[key] = doc._id;
        }
      });
    });
    setSelectedToRemove(autoSelected);
    toast.success('Auto-selected older duplicates for removal');
  };

  /**
   * Toggle a specific document for removal.
   * @param {number} groupIndex - Index of the duplicate group.
   * @param {string} docId - MongoDB document ID.
   * @param {number} totalInGroup - Total docs in this group.
   */
  const toggleSelection = (groupIndex, docId, totalInGroup) => {
    setSelectedToRemove((prev) => {
      const key = `${groupIndex}-${docId}`;
      const next = { ...prev };

      if (next[key]) {
        delete next[key];
      } else {
        // Prevent selecting ALL docs in a group (must keep at least one)
        const selectedInGroup = Object.keys(next).filter((k) =>
          k.startsWith(`${groupIndex}-`)
        ).length;
        if (selectedInGroup >= totalInGroup - 1) {
          toast.error('You must keep at least one name in each group');
          return prev;
        }
        next[key] = docId;
      }
      return next;
    });
  };

  const toggleGroup = (index) => {
    setExpandedGroups((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const allIdsToRemove = Object.values(selectedToRemove);

  const handleRemove = () => {
    if (allIdsToRemove.length === 0) {
      toast.error('Please select duplicates to remove first');
      return;
    }
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    removeMutation.mutate(allIdsToRemove);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-text-muted font-medium">Scanning for duplicates...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="text-danger" size={40} />
        <p className="text-text-muted font-medium">Failed to load duplicate data</p>
      </div>
    );
  }

  const groups = data?.data || [];
  const groupCount = data?.groupCount || 0;
  const extraRecords = data?.extraRecords || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-text mb-2">Duplicate Manager</h1>
        <p className="text-text-muted italic">
          Find and remove duplicate names from your database.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-text-muted mb-1">Duplicate Groups</p>
          <p className="text-3xl font-black text-text">{groupCount}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-text-muted mb-1">Extra Records</p>
          <p className="text-3xl font-black text-text">{extraRecords}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-text-muted mb-1">Selected for Removal</p>
          <p className="text-3xl font-black text-danger">{allIdsToRemove.length}</p>
        </div>
      </div>

      {/* Empty State */}
      {groups.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">No Duplicates Found</h2>
          <p className="text-text-muted">
            Your database is clean! All names are unique.
          </p>
        </div>
      ) : (
        <>
          {/* Action Bar */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAutoSelect}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors"
            >
              <Shield size={16} />
              Auto-Select (Keep Newest)
            </button>
            <button
              onClick={() => setSelectedToRemove({})}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg border border-border text-text-muted rounded-xl text-sm font-bold hover:text-text transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleRemove}
              disabled={allIdsToRemove.length === 0 || removeMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-danger text-white rounded-xl text-sm font-bold hover:bg-danger/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
            >
              {removeMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Remove {allIdsToRemove.length} Selected
            </button>
          </div>

          {/* Duplicate Groups */}
          <div className="space-y-4">
            {groups.map((group, groupIndex) => {
              const isExpanded = expandedGroups[groupIndex] !== false;
              const genderClass = GENDER_COLORS[group._id.gender] || GENDER_COLORS.boy;

              return (
                <div
                  key={`${group._id.name}-${group._id.gender}`}
                  className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(groupIndex)}
                    className="w-full flex items-center justify-between p-5 hover:bg-bg/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                        <Copy size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-text capitalize">
                          {group._id.name}
                        </span>
                        <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full border ${genderClass}`}>
                          {group._id.gender}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-text-muted bg-bg px-2 py-1 rounded-lg">
                        {group.count} copies
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-text-muted" />
                    ) : (
                      <ChevronDown size={18} className="text-text-muted" />
                    )}
                  </button>

                  {/* Group Documents */}
                  {isExpanded && (
                    <div className="border-t border-border divide-y divide-border">
                      {group.docs.map((doc, docIndex) => {
                        const selectionKey = `${groupIndex}-${doc._id}`;
                        const isSelected = Boolean(selectedToRemove[selectionKey]);
                        const isFirst = docIndex === 0;

                        return (
                          <div
                            key={doc._id}
                            className={`p-4 flex items-start gap-4 transition-colors ${
                              isSelected
                                ? 'bg-danger/5 border-l-4 border-l-danger'
                                : isFirst
                                ? 'bg-green-500/5 border-l-4 border-l-green-500'
                                : 'hover:bg-bg/50 border-l-4 border-l-transparent'
                            }`}
                          >
                            {/* Checkbox */}
                            <div className="pt-1">
                              <input
                                type="checkbox"
                                id={`check-${selectionKey}`}
                                checked={isSelected}
                                onChange={() =>
                                  toggleSelection(groupIndex, doc._id, group.docs.length)
                                }
                                className="w-4 h-4 rounded border-border text-danger focus:ring-danger cursor-pointer accent-red-500"
                              />
                            </div>

                            {/* Doc Details */}
                            <label
                              htmlFor={`check-${selectionKey}`}
                              className="flex-1 cursor-pointer min-w-0"
                            >
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-bold text-text text-sm">
                                  {doc.nameEnglish}
                                </span>
                                <span className="text-text-muted text-sm" dir="rtl">
                                  {doc.nameArabic}
                                </span>
                                {isFirst && (
                                  <span className="text-[10px] font-black uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                                    Recommended Keep
                                  </span>
                                )}
                                {isSelected && (
                                  <span className="text-[10px] font-black uppercase tracking-wider text-danger bg-danger/10 px-2 py-0.5 rounded-full">
                                    Will Remove
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-text-muted line-clamp-2 mb-1">
                                {doc.meaning}
                              </p>
                              <div className="flex flex-wrap gap-3 text-[11px] text-text-muted">
                                <span>Slug: {doc.slug || '—'}</span>
                                <span>Origin: {doc.origin || '—'}</span>
                                <span>
                                  Date:{' '}
                                  {new Date(
                                    doc.updatedAt || doc.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <span className="font-mono text-[10px] opacity-60">
                                  {doc._id}
                                </span>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-danger/10 text-danger rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-text">Confirm Removal</h3>
            </div>
            <p className="text-text-muted text-sm mb-6">
              You are about to permanently delete{' '}
              <span className="font-bold text-danger">{allIdsToRemove.length}</span>{' '}
              duplicate name record{allIdsToRemove.length !== 1 ? 's' : ''}. This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={removeMutation.isPending}
                className="px-5 py-2.5 text-sm font-bold text-text-muted bg-bg border border-border rounded-xl hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                disabled={removeMutation.isPending}
                className="px-5 py-2.5 text-sm font-bold text-white bg-danger rounded-xl hover:bg-danger/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {removeMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Yes, Remove Them
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminDuplicates };
