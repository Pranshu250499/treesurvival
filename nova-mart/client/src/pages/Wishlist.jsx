import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import WishlistItem from '../components/WishlistItem';
import EmptyState from '../components/EmptyState';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save the products you love by clicking on the heart icon while exploring our catalog."
          actionLabel="Explore Trending Products"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="pb-6 border-b border-slate-100 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {wishlistItems.length} saved item(s) in your personal collection
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistItems.map((item) => (
          <WishlistItem key={item._id || item.id || item.product} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
