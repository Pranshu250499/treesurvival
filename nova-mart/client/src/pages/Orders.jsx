import React, { useState, useEffect } from 'react';
import { Package, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';
import OrderCard from '../components/OrderCard';
import EmptyState from '../components/EmptyState';
import { FullPageLoader } from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        toast.success('Order cancelled successfully.');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return <FullPageLoader message="Retrieving order history..." />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="You haven't made any purchases with us so far. Check out our latest products and exclusive deals."
          actionLabel="Start Shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking and records for {orders.length} order(s)
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} onCancelOrder={handleCancelOrder} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
