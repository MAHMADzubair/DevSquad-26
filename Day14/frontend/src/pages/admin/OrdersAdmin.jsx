import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../services/adminService';
import { Clock, Truck, CheckCircle, XCircle, X, Package, MapPin, User, Mail, Phone } from 'lucide-react';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await getAdminOrders();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-[var(--color-brand-primary)]">Order Management</h1>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Order ID</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Customer</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Date</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Total</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr 
                key={order._id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="px-6 py-4 text-sm font-bold text-gray-800">#{order._id.slice(-6)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.shippingAddress?.fullName || order.user?.name || 'Guest'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">€{order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-[11px] font-bold bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:border-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 uppercase tracking-widest text-[11px]">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-brand-primary)]">Order Details</h2>
                <p className="text-xs text-gray-400 mt-1">ID: #{selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Customer & Shipping Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2">
                    <User size={14} /> Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-800">{selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail size={12} /> {selectedOrder.user?.email || selectedOrder.shippingAddress?.email}
                    </p>
                    {selectedOrder.shippingAddress?.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone size={12} /> {selectedOrder.shippingAddress?.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={14} /> Shipping Address
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-bold text-gray-800">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>{selectedOrder.shippingAddress?.postalCode} {selectedOrder.shippingAddress?.city}</p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2">
                  <Package size={14} /> Order Items
                </h3>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-bold text-gray-500">Item</th>
                        <th className="px-4 py-3 font-bold text-gray-500 text-center">Qty</th>
                        <th className="px-4 py-3 font-bold text-gray-500 text-right">Price</th>
                        <th className="px-4 py-3 font-bold text-gray-500 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {item.name}
                            {item.variantSize && <span className="text-[10px] text-gray-400 ml-2 uppercase">({item.variantSize})</span>}
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">€{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-bold">€{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-full max-w-[240px] space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">€{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-800">€{selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t border-gray-200 pt-3">
                    <span className="font-bold text-[var(--color-brand-primary)]">Total</span>
                    <span className="font-bold text-[var(--color-brand-primary)]">€{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold uppercase text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="text-[11px] font-bold bg-white border border-gray-200 rounded px-3 py-2 outline-none focus:border-black"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
