export const APP_NAME = 'NOVA MART';

export const CATEGORIES = [
  'Electronics',
  "Men's Fashion",
  "Women's Fashion",
  'Home & Living',
  'Beauty',
  'Sports',
  'Accessories',
];

export const ORDER_STATUSES = [
  'Processing',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const AVAILABLE_COUPONS = {
  NOVA10: { code: 'NOVA10', discountPercent: 10, minSpend: 1999, description: '10% OFF on orders above ₹1,999' },
  SAVE500: { code: 'SAVE500', flatDiscount: 500, minSpend: 2999, description: '₹500 Flat OFF on orders above ₹2,999' },
  WELCOME50: { code: 'WELCOME50', discountPercent: 15, minSpend: 999, description: '15% OFF Welcome Coupon' },
};
