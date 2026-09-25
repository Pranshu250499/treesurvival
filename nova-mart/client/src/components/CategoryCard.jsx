import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.name)}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 border border-slate-100 shadow-subtle hover:shadow-premium transition-all duration-300"
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-95"
      />
      {/* Subtle bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

      {/* Category Info */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between text-white">
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-primary-300 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            {category.productCount ? `${category.productCount} Products` : 'Explore Collection'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-primary-600 transition-colors flex-shrink-0">
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
