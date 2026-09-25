import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <span className="text-7xl sm:text-9xl font-black text-slate-200 tracking-tight font-mono select-none">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
        >
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
