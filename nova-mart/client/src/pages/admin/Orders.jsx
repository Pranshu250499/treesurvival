import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { FullPageLoader } from '../../components/Loader';
import { ORDER_STATUSES } from '../../utils/constants';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllOrders(selectedStatus !== 'all' ? { status: selectedStatus } : {});
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      toast.error('Failed to load customer orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await adminService.updateOrderStatus(orderId, {
        status: newStatus,
        note: `Status updated to ${newStatus} from administrative panel.`,
      });
      if (res.success) {
        toast.success(`Order status changed to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && orders.length === 0) {
    return <FullPageLoader message="Loading order fulfillment records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track customer deliveries, update processing statuses, and view transaction records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-semibold"
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <button
            onClick={fetchOrders}
            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl shadow-xs transition-colors"
            title="Refresh orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Order ID & Date */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block">
                      #{o._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">
                      {o.shippingAddress?.fullName || o.user?.name || 'Customer'}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                      {o.shippingAddress?.city}, {o.shippingAddress?.state}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      📞 {o.shippingAddress?.phone}
                    </span>
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {o.items?.length} item(s)
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-900">{formatCurrency(o.total)}</span>
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold block ${
                        o.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {o.paymentMethod}
                    </span>
                    <span className="text-[10px] text-slate-400">{o.paymentStatus}</span>
                  </td>

                  {/* Fulfillment Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        o.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : o.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-primary-50 text-primary-700'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>

                  {/* Update Status Dropdown */}
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={o.orderStatus}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white font-semibold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
