import React from 'react';
import { ShieldAlert, RefreshCw, Home, PhoneCall } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafafb] flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-teal-700" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Healthcare System Notice
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                An unexpected interface issue occurred. Our medical emergency and consultation hotline remains 100% active.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">24/7 Emergency Line</span>
                <span className="text-xs font-black text-slate-900">+91 92488 49388</span>
              </div>
              <a
                href="tel:+919248849388"
                className="p-2 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition-colors"
                title="Call Emergency Helpline"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
