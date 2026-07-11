import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">!</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-black">Something went wrong</h1>
            <p className="text-gray-400 text-sm">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-8 py-4 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
