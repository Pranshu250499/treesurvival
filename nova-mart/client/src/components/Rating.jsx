import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, numReviews, showText = true, size = 'sm', interactive = false, onRatingChange }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${value} out of 5 stars`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = value >= star;
          const half = value >= star - 0.5 && value < star;

          return (
            <button
              type={interactive ? 'button' : undefined}
              key={star}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
            >
              <Star
                className={`${starSize} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700">
          {Number(value).toFixed(1)}
          {numReviews !== undefined && (
            <span className="text-slate-400 font-normal ml-1">({numReviews})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default Rating;
