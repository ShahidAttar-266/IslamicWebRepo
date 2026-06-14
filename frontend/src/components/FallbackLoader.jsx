

/**
 * A standard fallback loader for Suspense boundaries.
 */
const FallbackLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 space-y-4">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    <p className="text-sm font-medium text-text-muted animate-pulse">Loading IslamicNames...</p>
  </div>
);

export { FallbackLoader };
