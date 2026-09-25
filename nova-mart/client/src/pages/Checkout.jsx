import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { formatCurrency } from '../utils/formatCurrency';
import { isValidPhone, isValidPinCode } from '../utils/validators';

const STEPS = [
  { id: 1, label: 'Shipping Address', icon: MapPin },
  { id: 2, label: 'Order Summary', icon: CheckCircle2 },
  { id: 3, label: 'Payment Method', icon: CreditCard },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discountAmount, shippingAmount, taxAmount, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Load user saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (isAuthenticated) {
        try {
          setLoadingAddresses(true);
          const res = await userService.getAddresses();
          if (res.success && res.addresses.length > 0) {
            setSavedAddresses(res.addresses);
            setShowNewAddressForm(false);
            const defaultIndex = res.addresses.findIndex((a) => a.isDefault);
            setSelectedAddressIndex(defaultIndex >= 0 ? defaultIndex : 0);
          } else {
            setShowNewAddressForm(true);
          }
        } catch (err) {
          console.error('Failed to fetch addresses:', err);
          setShowNewAddressForm(true);
        } finally {
          setLoadingAddresses(false);
        }
      } else {
        setShowNewAddressForm(true);
      }
    };

    fetchAddresses();
  }, [isAuthenticated]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName.trim()) return toast.error('Full name is required');
    if (!isValidPhone(addressForm.phone)) return toast.error('Please enter a valid 10-digit phone number');
    if (!addressForm.street.trim()) return toast.error('Street address is required');
    if (!addressForm.city.trim()) return toast.error('City is required');
    if (!addressForm.state.trim()) return toast.error('State is required');
    if (!isValidPinCode(addressForm.pinCode)) return toast.error('Please enter a valid 6-digit PIN code');

    if (isAuthenticated) {
      try {
        const res = await userService.addAddress({ ...addressForm, isDefault: savedAddresses.length === 0 });
        if (res.success) {
          setSavedAddresses(res.addresses);
          setSelectedAddressIndex(res.addresses.length - 1);
          setShowNewAddressForm(false);
          toast.success('Address saved to address book');
        }
      } catch (err) {
        console.warn('Could not save address to account:', err.message);
      }
    }

    setCurrentStep(2);
  };

  const getEffectiveShippingAddress = () => {
    if (savedAddresses.length > 0 && !showNewAddressForm) {
      return savedAddresses[selectedAddressIndex];
    }
    return addressForm;
  };

  const handlePlaceOrder = async () => {
    const shippingAddress = getEffectiveShippingAddress();
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
      toast.error('Please complete shipping address step');
      setCurrentStep(1);
      return;
    }

    try {
      setPlacingOrder(true);

      if (paymentMethod === 'COD') {
        // Cash on delivery
        const res = await orderService.createOrder({
          items: cartItems,
          shippingAddress,
          paymentMethod: 'COD',
          discount: discountAmount,
        });

        if (res.success && res.order) {
          clearCart();
          toast.success('Order placed successfully via Cash on Delivery!');
          navigate(`/order-success/${res.order._id}`, { state: { order: res.order } });
        }
      } else {
        // Razorpay / Online Payment Flow
        const paymentRes = await orderService.createPaymentIntent(grandTotal);

        if (paymentRes.isMock || !window.Razorpay) {
          // Dev / Sandbox simulated gateway
          toast('Opening Secure Sandbox Payment Modal...', { icon: '💳' });

          setTimeout(async () => {
            try {
              const res = await orderService.createOrder({
                items: cartItems,
                shippingAddress,
                paymentMethod: 'Razorpay',
                discount: discountAmount,
                paymentId: `pay_mock_${Date.now()}`,
              });

              if (res.success && res.order) {
                await orderService.verifyPayment({
                  orderId: res.order._id,
                  razorpayOrderId: paymentRes.razorpayOrderId,
                  razorpayPaymentId: `pay_mock_${Date.now()}`,
                  razorpaySignature: 'mock_verified_signature',
                });

                clearCart();
                toast.success('Online Payment verified successfully!');
                navigate(`/order-success/${res.order._id}`, { state: { order: res.order } });
              }
            } catch (err) {
              toast.error(err.message || 'Payment failed');
            } finally {
              setPlacingOrder(false);
            }
          }, 1200);
        } else {
          // Live Razorpay SDK checkout
          const options = {
            key: paymentRes.keyId,
            amount: paymentRes.amount,
            currency: 'INR',
            name: 'NOVA MART',
            description: 'Order Checkout Payment',
            order_id: paymentRes.razorpayOrderId,
            handler: async (response) => {
              try {
                const res = await orderService.createOrder({
                  items: cartItems,
                  shippingAddress,
                  paymentMethod: 'Razorpay',
                  discount: discountAmount,
                  paymentId: response.razorpay_payment_id,
                });

                if (res.success && res.order) {
                  await orderService.verifyPayment({
                    orderId: res.order._id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  });

                  clearCart();
                  toast.success('Payment verified successfully!');
                  navigate(`/order-success/${res.order._id}`, { state: { order: res.order } });
                }
              } catch (verifyErr) {
                toast.error('Payment verification failed');
              }
            },
            prefill: {
              name: shippingAddress.fullName,
              email: user?.email || '',
              contact: shippingAddress.phone,
            },
            theme: {
              color: '#2563EB',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (failResp) => {
            toast.error(failResp.error.description || 'Payment was unsuccessful');
            setPlacingOrder(false);
          });
          rzp.open();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Step Indicator Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  disabled={!isCompleted}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-md ring-4 ring-slate-100'
                      : isCompleted
                      ? 'bg-primary-600 text-white cursor-pointer'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
                <span
                  className={`text-xs mt-2 font-semibold ${
                    isCurrent ? 'text-slate-900 font-bold' : isCompleted ? 'text-primary-600' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Step Body (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle">
          {/* STEP 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>

              {/* Saved Addresses List */}
              {savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-3">
                  {savedAddresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAddressIndex === idx
                          ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-800">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] uppercase font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}, {addr.country}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Phone: {addr.phone}</p>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-dashed border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Deliver to a different address</span>
                  </button>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                      <span>Proceed to Summary</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* New Address Form */}
              {(showNewAddressForm || savedAddresses.length === 0) && (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-xs font-semibold text-primary-600 hover:underline mb-2 block"
                    >
                      ← Back to saved addresses
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        10-Digit Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        required
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Street Address / House No. / Landmark *
                    </label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="e.g. Flat 402, Green Heights, 12th Main Road"
                      required
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={addressForm.pinCode}
                        onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                        placeholder="6 digits"
                        required
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: Order Review */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Review Items</h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  Change Address
                </button>
              </div>

              {/* Shipping Address Recap */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <span className="font-bold text-slate-800 block mb-1">
                  Delivering to: {getEffectiveShippingAddress().fullName} ({getEffectiveShippingAddress().phone})
                </span>
                <p className="text-slate-500">
                  {getEffectiveShippingAddress().street}, {getEffectiveShippingAddress().city},{' '}
                  {getEffectiveShippingAddress().state} - {getEffectiveShippingAddress().pinCode}
                </p>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.selectedColor}`} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} {item.selectedColor && `• Color: ${item.selectedColor}`}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>Select Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Select Payment Method</h2>

              <div className="space-y-3">
                {/* Razorpay Online */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Razorpay'
                      ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="mt-1 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Online Payment (Razorpay / UPI / Cards / NetBanking)
                      </span>
                      <span className="text-[10px] font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Fast, secure payment via Google Pay, PhonePe, Paytm, Debit/Credit Card, or Net Banking.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-800">
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pay with cash or UPI at your doorstep upon order arrival.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{placingOrder ? 'Processing Order...' : `PLACE ORDER (${formatCurrency(grandTotal)})`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Financial Recap Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-5 sticky top-28">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Financials
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({cartItems.length})</span>
              <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Savings</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-slate-800">
                {shippingAmount === 0 ? <span className="text-emerald-600 font-bold uppercase">FREE</span> : formatCurrency(shippingAmount)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Applicable GST (18%)</span>
              <span className="font-semibold text-slate-800">{formatCurrency(taxAmount)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Grand Total</span>
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(grandTotal)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-[11px] text-slate-500 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>NOVA MART Buyer Assurance</span>
            </div>
            <p>
              Your order is insured during transit and backed by our unconditional 7-day replacement promise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
