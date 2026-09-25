import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem('nova_mart_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { addToCart } = useCart();

  useEffect(() => {
    try {
      localStorage.setItem('nova_mart_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id || item.product) === productId);
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.id;
    if (isInWishlist(id)) {
      setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      toast.success('Removed from wishlist');
    } else {
      setWishlistItems((prev) => [
        ...prev,
        {
          _id: id,
          id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          image: product.images && product.images.length > 0 ? product.images[0] : (product.image || ''),
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          rating: product.rating,
          stock: product.stock,
          category: product.category,
        },
      ]);
      toast.success('Added to wishlist');
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (product) => {
    const success = addToCart(product, 1);
    if (success) {
      removeFromWishlist(product._id || product.id);
    }
  };

  const value = {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    moveToCart,
    wishlistCount: wishlistItems.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
