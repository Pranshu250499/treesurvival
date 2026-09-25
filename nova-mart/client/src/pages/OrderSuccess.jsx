import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatCurrency';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
        Order Confirmed
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 mb-3">
        Thank You for Your Order!
      </h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
        Your order has been recorded in our fulfillment system. We are preparing your items for express dispatch.
      </p>

      {/* Order Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle text-left space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Order Identifier
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              #{id ? id.slice(-8).toUpperCase() : 'NOVA-ORDER'}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-right">
              Estimated Delivery
            </span>
            <span className="text-sm font-semibold text-emerald-700">
              Within 3 - 5 Business Days
            </span>
          </div>
        </div>

        {order && (
          <div className="text-xs text-slate-600 space-y-1 pt-1">
            <p>
              Delivering to:{' '}
              <strong className="text-slate-800">
                {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
              </strong>
            </p>
            <p>
              Payment Method:{' '}
              <strong className="text-slate-800">
                {order.paymentMethod} ({order.paymentStatus})
              </strong>
            </p>
            <p>
              Total Paid:{' '}
              <strong className="text-slate-900 font-bold">{formatCurrency(order.total)}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <PackageCheck className="w-4 h-4" />
          <span>View My Orders</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
