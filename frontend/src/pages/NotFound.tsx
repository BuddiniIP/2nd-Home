import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="pb-24 px-6 bg-[#F8F8F8] min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md">
        <h1 className="text-8xl font-display font-bold text-black">404</h1>
        <p className="text-gray-400 text-lg">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all">
          <Home size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
