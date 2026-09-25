import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from './Modal';

const ORDER_STEPS = [
  { key: 'Processing', label: 'Order Placed', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'Shipped', label: 'Shipped', icon: Package },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

const OrderCard = ({ order, onCancelOrder }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  if (!order) return null;

  const currentStatusIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = ['Processing', 'Confirmed'].includes(order.orderStatus);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Confirmed':
        return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Processing':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle overflow-hidden transition-all hover:border-slate-200">
      {/* Header Info */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Order ID
            </span>
            <span className="font-bold text-slate-800 font-mono">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Date Placed
            </span>
            <span className="font-medium text-slate-700">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Payment
            </span>
            <span className="font-medium text-slate-700">
              {order.paymentMethod} •{' '}
              <span className={order.paymentStatus === 'Completed' ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
                {order.paymentStatus}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* Progress Timeline preview */}
      {!isCancelled && (
        <div className="px-5 py-4 border-b border-slate-50 bg-white">
          <div className="flex items-center justify-between relative max-w-xl mx-auto py-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, (currentStatusIndex / (ORDER_STEPS.length - 1)) * 100))}%`,
              }}
            />

            {ORDER_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-primary-600 text-white shadow-sm ring-4 ring-primary-50'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-semibold text-center hidden sm:block ${
                      isCurrent
                        ? 'text-primary-600 font-bold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="px-5 py-3 bg-rose-50/50 border-b border-rose-100 flex items-center gap-2 text-rose-700 text-xs">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>This order has been cancelled and returned to inventory.</span>
        </div>
      )}

      {/* Items list preview */}
      <div className="p-4 sm:p-5">
        <div className="divide-y divide-slate-100">
          {order.items.slice(0, showDetails ? order.items.length : 2).map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    Qty: {item.quantity} {item.selectedColor && `• Color: ${item.selectedColor}`} {item.selectedSize && `• Size: ${item.selectedSize}`}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-bold text-slate-800">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {order.items.length > 2 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
          >
            <span>{showDetails ? 'Show less' : `+ ${order.items.length - 2} more item(s)`}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-500">
          Ship to:{' '}
          <strong className="text-slate-700">
            {order.shippingAddress.fullName}, {order.shippingAddress.city}
          </strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTimelineModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            Track Order
          </button>

          {canCancel && onCancelOrder && (
            <button
              onClick={() => onCancelOrder(order._id)}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 font-semibold rounded-lg border border-rose-200 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Tracking Modal */}
      <Modal
        isOpen={showTimelineModal}
        onClose={() => setShowTimelineModal(false)}
        title={`Tracking Order #${order._id.slice(-8).toUpperCase()}`}
      >
        <div className="space-y-6 py-2">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
              Current Status
            </p>
            <p className="text-base font-extrabold text-slate-900">{order.orderStatus}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Status History
            </h4>
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.statusTimeline && order.statusTimeline.length > 0 ? (
                order.statusTimeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary-600 ring-4 ring-primary-100" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.status}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(item.timestamp).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Order recorded into database.</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderCard;
