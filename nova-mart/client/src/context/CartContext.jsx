import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AVAILABLE_COUPONS } from '../utils/constants';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('nova_mart_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem('nova_mart_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('nova_mart_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  // Persist coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('nova_mart_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('nova_mart_coupon');
      }
    } catch (e) {
      console.error('Failed to persist coupon:', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, selectedColor = '', selectedSize = '') => {
    if (!product || product.stock <= 0) {
      toast.error('This product is currently out of stock');
      return false;
    }

    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : '');
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product === (product._id || product.id) &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          toast.error(`Maximum available stock is ${product.stock}`);
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex].quantity = newQty;
        toast.success(`Updated quantity in cart (${newQty})`);
        return updated;
      } else {
        if (quantity > product.stock) {
          toast.error(`Maximum available stock is ${product.stock}`);
          return prevItems;
        }

        toast.success('Product added to cart');
        return [
          ...prevItems,
          {
            product: product._id || product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            price: product.price,
            originalPrice: product.originalPrice,
            stock: product.stock,
            quantity,
            selectedColor: color,
            selectedSize: size,
          },
        ];
      }
    });

    return true;
  };

  const updateQuantity = (productId, selectedColor, selectedSize, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (
            item.product === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null; // remove
            if (nextQty > item.stock) {
              toast.error(`Cannot exceed available stock (${item.stock})`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId, selectedColor = '', selectedSize = '') => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Apply Coupon
  let discountAmount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minSpend) {
      if (appliedCoupon.discountPercent) {
        discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      } else if (appliedCoupon.flatDiscount) {
        discountAmount = appliedCoupon.flatDiscount;
      }
    }
  }

  const shippingAmount = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST
  const grandTotal = taxableAmount + shippingAmount + taxAmount;

  const applyCoupon = (code) => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[formattedCode];

    if (!coupon) {
      toast.error('Invalid promo coupon code');
      return false;
    }

    if (subtotal < coupon.minSpend) {
      toast.error(`Minimum order amount of ₹${coupon.minSpend} required for this coupon`);
      return false;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    grandTotal,
    totalItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
