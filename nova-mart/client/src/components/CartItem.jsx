import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!item) return null;

  const isFavorited = isInWishlist(item.product);

  const handleSaveForLater = () => {
    if (!isFavorited) {
      toggleWishlist({
        _id: item.product,
        name: item.name,
        slug: item.slug,
        brand: item.brand,
        images: [item.image],
        price: item.price,
        originalPrice: item.originalPrice,
        stock: item.stock,
      });
    }
    removeFromCart(item.product, item.selectedColor, item.selectedSize);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      {/* Item info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Link
          to={`/product/${item.slug || item.product}`}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider">
            {item.brand}
          </span>
          <h4 className="text-sm font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-1">
            <Link to={`/product/${item.slug || item.product}`}>{item.name}</Link>
          </h4>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            {item.selectedColor && (
              <span>
                Color: <strong className="text-slate-700">{item.selectedColor}</strong>
              </span>
            )}
            {item.selectedSize && (
              <span>
                Size: <strong className="text-slate-700">{item.selectedSize}</strong>
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1 sm:hidden">
            {formatCurrency(item.price)}
          </div>
        </div>
      </div>

      {/* Stepper & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50 p-0.5">
          <button
            onClick={() => updateQuantity(item.product, item.selectedColor, item.selectedSize, -1)}
            disabled={item.quantity <= 1}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-slate-800 min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product, item.selectedColor, item.selectedSize, 1)}
            disabled={item.quantity >= item.stock}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right hidden sm:block min-w-[5rem]">
          <span className="text-sm font-extrabold text-slate-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
          {item.quantity > 1 && (
            <p className="text-[11px] text-slate-400">
              {formatCurrency(item.price)} each
            </p>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleSaveForLater}
            title="Save for later"
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => removeFromCart(item.product, item.selectedColor, item.selectedSize)}
            title="Remove item"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
