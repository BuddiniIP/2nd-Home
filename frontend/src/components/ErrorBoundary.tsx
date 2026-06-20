import React from 'react';
import { Link } from 'react-router-dom';

interface EBProps { children: React.ReactNode; }
interface EBState { hasError: boolean; error?: Error; }

class ErrorBoundary extends React.Component<EBProps, EBState> {
  constructor(props: EBProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: Error): EBState { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-6">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-6xl font-display font-bold text-black">Oops</h1>
            <p className="text-gray-400">Something went wrong. Please refresh or go back home.</p>
            <Link to="/" className="inline-block px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent-orange transition-all">Go Home</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
