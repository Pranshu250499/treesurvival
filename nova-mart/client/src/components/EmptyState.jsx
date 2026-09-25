import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen, ArrowRight } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Looks like there is nothing to display here yet.',
  actionLabel = 'Explore Products',
  actionTo = '/shop',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-slate-100 shadow-subtle max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && (
        actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm group"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm group"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
