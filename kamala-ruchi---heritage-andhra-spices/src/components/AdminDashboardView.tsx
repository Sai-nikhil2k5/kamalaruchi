import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { UserProfile, Order, ActivityLog } from '../types';
import { 
  adminFetchAllUsers, 
  adminFetchAllOrders, 
  adminFetchActivityLogs, 
  adminUpdateOrderStatus 
} from '../lib/dbService';
import { ProductManager } from './ProductManager';
import { AnnouncementManager } from './AnnouncementManager';

export const AdminDashboardView: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'logs' | 'products' | 'announcements'>('overview');

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [logFilterAction, setLogFilterAction] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersList, ordersList, logsList] = await Promise.all([
        adminFetchAllUsers(),
        adminFetchAllOrders(),
        adminFetchActivityLogs(150),
      ]);
      setUsers(usersList);
      setOrders(ordersList);
      setLogs(logsList);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus, {
        uid: user?.uid,
        email: user?.email,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      setActionSuccess(`Order status changed to "${newStatus}"`);
      setTimeout(() => setActionSuccess(null), 3000);
      // Reload logs to reflect the change
      const freshLogs = await adminFetchActivityLogs(50);
      setLogs(freshLogs);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update order status.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-8 sm:p-12 shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]">security</span>
          </div>
          <h2 className="font-headline-sm text-2xl text-[#241a04] mb-2">
            Administrator Access Required
          </h2>
          <p className="text-sm text-[#5a431f] max-w-md mx-auto mb-6">
            This dashboard is restricted to authorized Kamala Ruchi administrators. To view user actions, audit logs, and orders, please sign in with an administrator account (such as <strong className="text-[#241a04]">kruchimade@gmail.com</strong>).
          </p>
          <div className="p-3 bg-[#fff1d6] border border-[#ebd3aa] rounded-xl text-xs text-[#5b403e] max-w-sm mx-auto">
            Current status: {user ? `Signed in as ${user.email} (Customer)` : 'Not signed in'}
          </div>
        </div>
      </div>
    );
  }

  // High-level statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const totalUsersCount = users.length;
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.displayName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phoneNumber?.includes(q)
    );
  });

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.userEmail?.toLowerCase().includes(q) ||
      o.city?.toLowerCase().includes(q)
    );
  });

  const filteredLogs = logs.filter((log) => {
    if (logFilterAction === 'ALL') return true;
    return log.action === logFilterAction;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#241a04] text-white p-6 rounded-2xl border border-[#e3c193]/40 shadow-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffebcb] p-1 border-2 border-[#e3c193] overflow-hidden shrink-0">
            <img src="/logo_icon_chef.jpg" alt="Kamala Ruchi Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#af1820] text-[10px] font-bold tracking-widest uppercase text-white mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Monitoring System
            </div>
            <h1 className="font-headline-sm text-2xl text-[#ffefd5]">
              Master Administrator Command Center
            </h1>
            <p className="text-xs text-[#e3c193]">
              Monitoring users, transactions, and courtyard spice activities in real-time
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="bg-[#fff1d6]/15 text-[#ffddb1] px-2 py-0.5 rounded-md border border-[#ebd3aa]/30 flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[13px] text-[#ffddb1]">verified_user</span>
                Admin: kruchimade@gmail.com
              </span>
              <a
                href="https://console.firebase.google.com/project/gen-lang-client-0688045035/settings/usersandpermissions"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-[#ffdcc2] px-2 py-0.5 rounded-md transition-colors flex items-center gap-1"
                title="Manage IAM permissions in Firebase Console"
              >
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                <span>Firebase Project IAM Settings</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#ffefd5] px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh Live Feeds</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the Admin Monitor and sign out?')) {
                signOut();
              }
            }}
            className="flex items-center gap-1.5 bg-[#af1820] hover:bg-[#d23435] text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              logout
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#fffbf6] border border-[#ebd3aa] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#886a3d] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Registered Users</span>
            <span className="material-symbols-outlined text-[20px] text-[#af1820]">group</span>
          </div>
          <div className="text-3xl font-bold text-[#241a04]">{totalUsersCount}</div>
          <div className="text-[11px] text-[#5a431f] mt-1">Across all regions</div>
        </div>

        <div className="bg-[#fffbf6] border border-[#ebd3aa] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#886a3d] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Orders Placed</span>
            <span className="material-symbols-outlined text-[20px] text-[#7b5804]">shopping_cart</span>
          </div>
          <div className="text-3xl font-bold text-[#241a04]">{totalOrdersCount}</div>
          <div className="text-[11px] text-[#5a431f] mt-1">{pendingOrdersCount} currently in processing</div>
        </div>

        <div className="bg-[#fffbf6] border border-[#ebd3aa] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#886a3d] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Gross Revenue</span>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">payments</span>
          </div>
          <div className="text-3xl font-bold text-[#241a04]">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-[#5a431f] mt-1">All processed batches</div>
        </div>

        <div className="bg-[#fffbf6] border border-[#ebd3aa] p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#886a3d] text-xs font-bold uppercase tracking-wider mb-2">
            <span>User Activity Events</span>
            <span className="material-symbols-outlined text-[20px] text-purple-600">timeline</span>
          </div>
          <div className="text-3xl font-bold text-[#241a04]">{logs.length}</div>
          <div className="text-[11px] text-[#5a431f] mt-1">Recorded audit trails</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#ebd3aa] mb-6 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold tracking-wide cursor-pointer transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-[#af1820] text-[#af1820]'
              : 'border-transparent text-[#7b5804] hover:text-[#241a04]'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Overview & Feeds
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold tracking-wide cursor-pointer transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-[#af1820] text-[#af1820]'
              : 'border-transparent text-[#7b5804] hover:text-[#241a04]'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            User Accounts ({users.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold tracking-wide cursor-pointer transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-[#af1820] text-[#af1820]'
              : 'border-transparent text-[#7b5804] hover:text-[#241a04]'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            All Orders ({orders.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-bold tracking-wide cursor-pointer transition-colors border-b-2 ${
            activeTab === 'products'
              ? 'border-[#af1820] text-[#af1820]'
              : 'border-transparent text-[#7b5804] hover:text-[#241a04]'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            Products & Combos
          </span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 text-sm font-bold tracking-wide cursor-pointer transition-colors border-b-2 ${
            activeTab === 'announcements'
              ? 'border-[#af1820] text-[#af1820]'
              : 'border-transparent text-[#7b5804] hover:text-[#241a04]'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            Announcements & Popups
          </span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-sm font-bold tracking-wide cursor-pointer transition-colors border-b-2 ${
            activeTab === 'logs'
              ? 'border-[#af1820] text-[#af1820]'
              : 'border-transparent text-[#7b5804] hover:text-[#241a04]'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">history</span>
            Audit & User Action Logs ({logs.length})
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Left */}
          <div className="lg:col-span-7 bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-lg text-[#241a04]">Recent Customer Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#af1820] hover:underline cursor-pointer"
              >
                View all orders &rarr;
              </button>
            </div>

            <div className="divide-y divide-[#ebd3aa]/50">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#241a04]">{ord.customerName}</span>
                      <span className="text-[#886a3d] font-mono">#{ord.orderNumber}</span>
                    </div>
                    <div className="text-[#5a431f] text-[11px] mt-0.5">
                      {ord.items.length} products • {ord.city} • {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#241a04] block text-sm">₹{ord.finalTotal}</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffebcb] text-[#5a431f]">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-sm text-gray-500 py-6 text-center">No orders yet.</p>
              )}
            </div>
          </div>

          {/* Live Action Stream Right */}
          <div className="lg:col-span-5 bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-lg text-[#241a04]">Live User Activity Stream</h3>
              <button
                onClick={() => setActiveTab('logs')}
                className="text-xs font-bold text-[#af1820] hover:underline cursor-pointer"
              >
                Full Audit &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {logs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-3 bg-[#fcf5eb] border border-[#ebd3aa]/60 rounded-xl text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#af1820] uppercase text-[10px] tracking-wider">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-[#886a3d]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#241a04] font-medium">{log.details}</p>
                  <p className="text-[10px] text-[#7b5804] mt-1">
                    User: {log.userName || log.userEmail}
                  </p>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-sm text-gray-500 py-6 text-center">No activity recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS MONITORING */}
      {activeTab === 'users' && (
        <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-headline-sm text-xl text-[#241a04]">Customer & Admin Directory</h3>
              <p className="text-xs text-[#5a431f]">Monitor registered users, spending history, and last login dates</p>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </span>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="pl-9 pr-3 py-2 bg-white border border-[#d6be95] rounded-xl text-xs text-[#241a04] w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#af1820]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fcf5eb] text-[#886a3d] uppercase font-bold tracking-wider border-b border-[#ebd3aa]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone / City</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Joined At</th>
                  <th className="py-3 px-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebd3aa]/40">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-[#fff9f0] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#241a04]">{u.displayName || 'Unnamed User'}</div>
                      <div className="text-[11px] text-[#5a431f]">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'admin' ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30' : 'bg-[#e2f0d9] text-[#2c6117]'
                      }`}>
                        {u.role || 'customer'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5a431f]">
                      {u.phoneNumber || '—'} {u.city ? `(${u.city})` : ''}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#241a04]">
                      {u.orderCount || 0}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#af1820]">
                      ₹{u.totalSpent || 0}
                    </td>
                    <td className="py-3 px-4 text-[#7b5804]">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-[#7b5804]">
                      {new Date(u.lastLoginAt || u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No users found matching query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-headline-sm text-xl text-[#241a04]">Customer Spice Orders</h3>
              <p className="text-xs text-[#5a431f]">Manage status transitions from pounding & roasting to dispatch</p>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </span>
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #, customer..."
                className="pl-9 pr-3 py-2 bg-white border border-[#d6be95] rounded-xl text-xs text-[#241a04] w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#af1820]"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="border border-[#ebd3aa] rounded-xl p-4 bg-[#fcf5eb]/50">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebd3aa]/60 pb-3 mb-3 text-xs">
                  <div>
                    <span className="font-bold text-sm text-[#241a04]">{ord.customerName}</span>
                    <span className="text-[#886a3d] font-mono ml-2 font-bold">#{ord.orderNumber}</span>
                    <div className="text-[11px] text-[#5a431f] mt-0.5">
                      {ord.userEmail} • Phone: {ord.customerPhone} • {ord.city} ({ord.pincode})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-[#886a3d]">Total</span>
                      <span className="font-bold text-sm text-[#af1820] block">₹{ord.finalTotal}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-[#5a431f]">Status:</label>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as Order['orderStatus'])}
                        className="bg-white border border-[#d6be95] rounded-lg text-xs font-bold py-1.5 px-2.5 text-[#241a04] focus:outline-none focus:ring-2 focus:ring-[#af1820]"
                      >
                        <option value="received">Order Received</option>
                        <option value="roasting_grinding">Roasting & Grinding</option>
                        <option value="packed">Packed in Foil Tin</option>
                        <option value="dispatched">Dispatched (Courier)</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/70 p-2 rounded-lg border border-[#ebd3aa]/40">
                      <img src={it.image} alt={it.name} className="w-8 h-8 rounded object-cover" />
                      <div className="truncate">
                        <div className="font-bold text-[#241a04] truncate">{it.name}</div>
                        <div className="text-[10px] text-[#5a431f]">
                          {it.packagingNote} × {it.quantity} (₹{it.price * it.quantity})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-[11px] text-[#886a3d] flex justify-between">
                  <span>Address: {ord.shippingAddress}</span>
                  <span>Placed: {new Date(ord.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <p className="text-sm text-gray-500 py-8 text-center">No orders match your search.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS / USER ACTIONS */}
      {activeTab === 'logs' && (
        <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-headline-sm text-xl text-[#241a04]">User Actions & Audit Logs</h3>
              <p className="text-xs text-[#5a431f]">Complete timeline of logins, carts, orders, and administrative updates</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#5a431f]">Action Type:</label>
              <select
                value={logFilterAction}
                onChange={(e) => setLogFilterAction(e.target.value)}
                className="bg-white border border-[#d6be95] rounded-xl text-xs font-semibold py-1.5 px-3 text-[#241a04] focus:outline-none focus:ring-2 focus:ring-[#af1820]"
              >
                <option value="ALL">All Actions ({logs.length})</option>
                <option value="USER_SIGN_UP">Sign Ups</option>
                <option value="USER_LOGIN">Logins</option>
                <option value="USER_LOGOUT">Logouts</option>
                <option value="ORDER_PLACED">Orders Placed</option>
                <option value="ORDER_STATUS_UPDATE">Status Updates</option>
                <option value="ADD_TO_CART">Cart Additions</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fcf5eb] text-[#886a3d] uppercase font-bold tracking-wider border-b border-[#ebd3aa]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebd3aa]/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fff9f0] transition-colors">
                    <td className="py-3 px-4 text-[#7b5804] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#ffebcb] text-[#af1820] border border-[#e3c193]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#241a04]">{log.userName || '—'}</div>
                      <div className="text-[10px] text-[#5a431f]">{log.userEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-[#241a04] font-medium">
                      {log.details}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No logs found for selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PRODUCTS & COMBOS */}
      {activeTab === 'products' && (
        <ProductManager />
      )}

      {/* TAB 6: ANNOUNCEMENTS & POPUPS */}
      {activeTab === 'announcements' && (
        <AnnouncementManager />
      )}
    </div>
  );
};
