import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import Rating from './Rating';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedRecently, setAddedRecently] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product._id || product.id);
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addToCart(product, 1);
    if (success) {
      setAddedRecently(true);
      setTimeout(() => setAddedRecently(false), 1600);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-sm text-white shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md flex items-center gap-1.5 hover:bg-white"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-primary-600 truncate mr-2">
            {product.brand}
          </span>
          <span className="truncate">{product.category}</span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={`/product/${product.slug || product._id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="mb-3">
          <Rating value={product.rating || 0} numReviews={product.numReviews || 0} size="xs" />
        </div>

        {/* Price and Cart Action */}
        <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[11px] font-medium text-amber-600">
                Only {product.stock} left in stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[11px] font-medium text-rose-500">
                Out of Stock
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
              addedRecently
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-primary-600 text-white shadow-sm hover:shadow'
            }`}
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
            aria-label="Add to cart"
          >
            {addedRecently ? (
              <Check className="w-4 h-4 animate-scale" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
