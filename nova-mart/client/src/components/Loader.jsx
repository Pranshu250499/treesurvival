import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  return (
    <Loader2 className={`animate-spin text-primary-600 ${sizeMap[size] || sizeMap.md} ${className}`} />
  );
};

export const FullPageLoader = ({ message = 'Loading NOVA MART...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-slate-600 tracking-wide">{message}</p>
    </div>
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-subtle animate-pulse flex flex-col">
      <div className="w-full aspect-square bg-slate-100 rounded-xl mb-4"></div>
      <div className="h-3.5 bg-slate-100 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-slate-100 rounded w-4/5 mb-3"></div>
      <div className="h-3 bg-slate-100 rounded w-1/4 mb-4"></div>
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-5 bg-slate-100 rounded w-1/3"></div>
        <div className="h-9 w-9 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
};

const Loader = ({ fullPage, message, size, className }) => {
  if (fullPage) return <FullPageLoader message={message} />;
  return <Spinner size={size} className={className} />;
};

export default Loader;
