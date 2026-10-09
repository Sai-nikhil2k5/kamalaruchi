import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Order } from '../types';
import { fetchUserOrders } from '../lib/dbService';

interface CustomerOrdersViewProps {
  onShopNow: () => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({ onShopNow }) => {
  const { user, profile, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      try {
        const list = await fetchUserOrders(user.uid);
        setOrders(list);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-8 sm:p-12 shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#ffebcb] flex items-center justify-center mx-auto mb-4 text-[#af1820]">
            <span className="material-symbols-outlined text-[36px]">receipt_long</span>
          </div>
          <h2 className="font-headline-sm text-2xl sm:text-3xl text-[#241a04] mb-3">
            Track Your Spice Orders
          </h2>
          <p className="text-[#5a431f] text-sm max-w-md mx-auto mb-6">
            Sign in or create an account to monitor fresh courtyard milling progress, dispatch statuses, and re-order your favorite Andhra blends.
          </p>
          <button
            onClick={() => openAuthModal('signin')}
            className="bg-[#af1820] hover:bg-[#8e1319] text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-md cursor-pointer transition-colors"
          >
            Sign In to View Orders
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'received':
        return { label: 'Order Received', bg: 'bg-[#ffebcb] text-[#5a431f] border-[#e3c193]' };
      case 'roasting_grinding':
        return { label: 'Stone Pounding & Roasting', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'packed':
        return { label: 'Foil Sealed in Tin', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'dispatched':
        return { label: 'Dispatched via Courier', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'delivered':
        return { label: 'Delivered to Home', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-red-100 text-red-900 border-red-300' };
      default:
        return { label: status, bg: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebd3aa] pb-6 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#af1820]">
            Kamala Ruchi Account
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#241a04] mt-1">
            My Courtyard Orders
          </h1>
          <p className="text-sm text-[#5a431f] mt-1">
            Logged in as <span className="font-semibold text-[#241a04]">{profile?.displayName || user.email}</span> ({user.email})
          </p>
        </div>

        <button
          onClick={onShopNow}
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-[#876c45] hover:bg-[#6d542f] text-[#fff4eb] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
          <span>Order More Spices</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#5a431f]">
          <span className="material-symbols-outlined text-[40px] animate-spin text-[#af1820] mb-3">
            progress_activity
          </span>
          <p className="text-sm">Fetching your spice orders from the database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#e3c193] mb-3">
            inventory_2
          </span>
          <h3 className="font-headline-sm text-xl text-[#241a04] mb-2">
            No Orders Yet in Your Kitchen
          </h3>
          <p className="text-sm text-[#5a431f] max-w-md mx-auto mb-6">
            You haven&apos;t placed an order yet. Treat your family to our stone-pounded Koora Karaam or Guntur gongura chutneys!
          </p>
          <button
            onClick={onShopNow}
            className="bg-[#af1820] hover:bg-[#8e1319] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md cursor-pointer transition-colors"
          >
            Browse Andhra Spice Blends
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const badge = getStatusBadge(order.orderStatus);
            return (
              <div
                key={order.id}
                className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Order Top Meta */}
                <div className="bg-[#fcf5eb] px-5 py-4 border-b border-[#ebd3aa]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-[#886a3d] block font-semibold">ORDER PLACED</span>
                      <span className="text-[#241a04] font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-[#ebd3aa] hidden sm:block" />
                    <div>
                      <span className="text-[#886a3d] block font-semibold">TOTAL AMOUNT</span>
                      <span className="text-[#241a04] font-bold">₹{order.finalTotal}</span>
                    </div>
                    <div className="h-6 w-px bg-[#ebd3aa] hidden sm:block" />
                    <div>
                      <span className="text-[#886a3d] block font-semibold">DELIVERY TO</span>
                      <span className="text-[#241a04] font-medium">
                        {order.customerName} ({order.city} - {order.pincode})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#886a3d] font-mono">#{order.orderNumber}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Order Item List */}
                <div className="p-5 divide-y divide-[#ebd3aa]/40">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-[#ebd3aa]"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#241a04]">{item.name}</h4>
                          <span className="text-xs text-[#5a431f]">
                            {item.packagingNote} • Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#241a04]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Tracking Note */}
                <div className="bg-[#fff9f0] px-5 py-3 border-t border-[#ebd3aa]/60 flex flex-wrap items-center justify-between text-xs text-[#5a431f]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#7b5804]">
                      local_shipping
                    </span>
                    <span>
                      Payment: <span className="font-bold uppercase text-[#241a04]">{order.paymentMethod}</span> ({order.paymentStatus})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#886a3d]">
                    Live updates powered by Kamala Ruchi Dispatch
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
