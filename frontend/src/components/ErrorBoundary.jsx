import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.handleReset);
        }
        return this.props.fallback;
      }

      // Default premium looking fallback UI
      return (
        <div className="w-full text-center py-12 px-6 bg-card border border-danger/20 rounded-2xl shadow-sm space-y-4 my-4">
          <div className="w-12 h-12 bg-danger/10 border border-danger/20 rounded-full flex items-center justify-center mx-auto text-danger animate-pulse">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text">
              {this.props.title || "Something went wrong"}
            </h3>
            <p className="text-sm text-text-muted max-w-md mx-auto italic leading-relaxed">
              {this.props.message || "We encountered an error loading this section. Please try again or refresh the page."}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-bg px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md shadow-primary/10 transition-all active:scale-95"
            >
              <RefreshCw size={14} className="animate-spin-hover" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
