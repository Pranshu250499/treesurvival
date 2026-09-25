import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import Rating from './Rating';
import { useWishlist } from '../hooks/useWishlist';

const WishlistItem = ({ item }) => {
  const { removeFromWishlist, moveToCart } = useWishlist();

  if (!item) return null;

  const id = item._id || item.id || item.product;
  const inStock = item.stock === undefined || item.stock > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle hover:shadow-premium transition-all p-4 flex flex-col justify-between">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
        <Link to={`/product/${item.slug || id}`} className="block w-full h-full">
          <img
            src={item.image || 'https://placehold.co/400x400'}
            alt={item.name}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
          />
        </Link>
        <button
          onClick={() => removeFromWishlist(id)}
          title="Remove from wishlist"
          className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <span className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider block mb-1">
          {item.brand}
        </span>
        <h4 className="text-sm font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-2 mb-1.5 leading-snug">
          <Link to={`/product/${item.slug || id}`}>{item.name}</Link>
        </h4>
        <div className="mb-2">
          <Rating value={item.rating || 0} size="xs" />
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-extrabold text-slate-900">
            {formatCurrency(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          )}
        </div>
        <div className="mb-3">
          {inStock ? (
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => moveToCart(item)}
        disabled={!inStock}
        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:hover:bg-slate-900 shadow-sm"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Move to Cart</span>
      </button>
    </div>
  );
};

export default WishlistItem;
