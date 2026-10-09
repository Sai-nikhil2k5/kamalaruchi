import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useAuth } from '../lib/AuthContext';
import { createOrder } from '../lib/dbService';
import { useRazorpay } from 'react-razorpay';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (orderId: string) => void;
  onViewOrders?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  onViewOrders,
}) => {
  const { user, profile, openAuthModal } = useAuth();
  const { Razorpay } = useRazorpay();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    pincode: '',
    paymentMethod: 'online' as 'online' | 'cod',
    couponCode: '',
  });

  // Pre-fill user profile if logged in
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || profile.displayName || '',
        phone: prev.phone || profile.phoneNumber || '',
        address: prev.address || profile.address || '',
        city: prev.city || profile.city || 'Hyderabad',
        pincode: prev.pincode || profile.pincode || '',
      }));
    }
  }, [profile]);

  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmedNumber, setOrderConfirmedNumber] = useState<string | null>(null);

  const [completedTotal, setCompletedTotal] = useState<number>(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shippingFee = (subtotal === 0 || subtotal > 499) ? 0 : 40;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = () => {
    setCouponError('');
    if (formData.couponCode.trim().toUpperCase() === 'KAMALA10') {
      setAppliedDiscount(10);
    } else if (formData.couponCode.trim().toUpperCase() === 'FIRSTHARVEST') {
      setAppliedDiscount(15);
    } else {
      setCouponError('Invalid voucher. Try "KAMALA10" for 10% off');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      openAuthModal('signin');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill out all required delivery fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderNumber = `KR-${Math.floor(100000 + Math.random() * 900000)}`;

      if (formData.paymentMethod === 'online') {
        const response = await fetch('/api/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal, receipt: orderNumber })
        });
        
        if (!response.ok) {
          throw new Error('Failed to initialize payment');
        }
        
        const orderData = await response.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy', 
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Kamala Ruchi",
          description: "Heritage Andhra Spices",
          order_id: orderData.id,
          handler: async (response: any) => {
            try {
              await createOrder({
                orderNumber,
                userId: user.uid,
                userEmail: user.email || 'customer@kamalaruchi.com',
                customerName: formData.name,
                customerPhone: formData.phone,
                shippingAddress: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                items: cartItems,
                subtotal,
                discountAmount,
                shippingFee,
                finalTotal,
                paymentMethod: 'online',
                paymentStatus: 'paid',
                orderStatus: 'received',
                couponApplied: appliedDiscount > 0 ? formData.couponCode.toUpperCase() : undefined,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              setCompletedTotal(finalTotal);
              setOrderConfirmedNumber(orderNumber);

              // Send notifications in the background
              fetch('/api/send-order-alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderNumber,
                  customerName: formData.name,
                  customerPhone: formData.phone,
                  shippingAddress: formData.address,
                  city: formData.city,
                  pincode: formData.pincode,
                  items: cartItems,
                  finalTotal,
                  paymentMethod: 'online'
                })
              }).catch(e => console.error('Alert error:', e));

              onOrderSuccess(orderNumber);
            } catch (err) {
              console.error('Failed to save order:', err);
              alert('Payment succeeded but order saving failed.');
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: formData.name,
            email: user.email,
            contact: formData.phone
          },
          theme: {
            color: "#af1820"
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          alert(`Payment Failed: ${response.error.description}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        await createOrder({
          orderNumber,
          userId: user.uid,
          userEmail: user.email || 'customer@kamalaruchi.com',
          customerName: formData.name,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          items: cartItems,
          subtotal,
          discountAmount,
          shippingFee,
          finalTotal,
          paymentMethod: 'cod',
          paymentStatus: 'cash_on_delivery',
          orderStatus: 'received',
          couponApplied: appliedDiscount > 0 ? formData.couponCode.toUpperCase() : undefined,
        });

        setCompletedTotal(finalTotal);
        setOrderConfirmedNumber(orderNumber);

        // Send notifications in the background
        fetch('/api/send-order-alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            customerName: formData.name,
            customerPhone: formData.phone,
            shippingAddress: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            items: cartItems,
            finalTotal,
            paymentMethod: 'cod'
          })
        }).catch(e => console.error('Alert error:', e));

        onOrderSuccess(orderNumber);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Failed to submit order:', err);
      alert('There was a problem placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setOrderConfirmedNumber(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241a04]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#fff8f2] rounded-2xl shadow-2xl border-2 border-[#ebd3aa] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#ffebcb] border-b border-[#ebd3aa] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#af1820] text-2xl">
              receipt_long
            </span>
            <h3 className="font-headline-sm text-2xl text-[#241a04]">
              {orderConfirmedNumber ? 'Order Blessed & Confirmed' : 'Ancestral Spice Checkout'}
            </h3>
          </div>
          <button
            onClick={handleCloseAll}
            className="text-[#5b403e] hover:text-[#241a04] p-1 rounded-full hover:bg-[#fff8f2] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* If NOT logged in, require account first */}
          {!user ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#ffebcb] text-[#af1820] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ebd3aa]">
                <span className="material-symbols-outlined text-3xl">account_circle</span>
              </div>
              <h3 className="font-headline-sm text-2xl text-[#241a04] mb-2">
                Sign in to Complete Your Order
              </h3>
              <p className="text-sm text-[#5a431f] max-w-md mx-auto mb-6">
                Each order is stored in your personal account so you can track stone-pounding batches, courier progress, and save your delivery addresses.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="w-full sm:w-auto bg-[#af1820] hover:bg-[#8e1319] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md cursor-pointer transition-colors"
                >
                  Sign In to My Account
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="w-full sm:w-auto bg-[#ffebcb] hover:bg-[#ffdcb0] text-[#5a431f] border border-[#d6be95] px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors"
                >
                  Create New Account
                </button>
              </div>
            </div>
          ) : orderConfirmedNumber ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#f5e0bb] text-[#af1820] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ebd3aa] shadow-inner">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <span className="text-xs uppercase tracking-widest text-[#7b5737] font-bold">
                Order Saved to Your Account
              </span>
              <h2 className="font-headline-lg text-3xl text-[#241a04] mt-1 mb-2">
                Dhanyavaadagalu!
              </h2>
              <p className="text-sm text-[#5b403e] max-w-md mx-auto mb-6">
                Your fresh batch of Kamala Ruchi spices has been saved to the database and queued for stone-pounding.
              </p>

              <div className="bg-[#ffebcb] p-4 rounded-xl max-w-md mx-auto mb-6 text-left border border-[#ebd3aa]">
                <div className="flex justify-between text-xs text-[#5b403e] mb-1">
                  <span>Order Number:</span>
                  <span className="font-mono font-bold text-[#af1820]">#{orderConfirmedNumber}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5b403e] mb-1">
                  <span>Customer Account:</span>
                  <span className="font-semibold text-[#241a04]">{user.email}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5b403e] mb-1">
                  <span>Recipient:</span>
                  <span className="font-semibold text-[#241a04]">{formData.name}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5b403e] mb-1">
                  <span>Dispatching to:</span>
                  <span className="font-semibold text-[#241a04]">{formData.city}, {formData.pincode}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5b403e] pt-2 border-t border-[#ebd3aa]/60">
                  <span>Total Amount:</span>
                  <span className="font-bold text-[#af1820]">₹{completedTotal.toFixed(2)} ({formData.paymentMethod.toUpperCase()})</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {onViewOrders && (
                  <button
                    onClick={() => {
                      handleCloseAll();
                      onViewOrders();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#876c45] text-[#fff4eb] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#6d542f] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    View My Orders
                  </button>
                )}
                <a
                  href={`https://wa.me/917396311063?text=Namaste%20Kamala%20Ruchi,%20I%20just%20placed%20order%20${orderConfirmedNumber}%20for%20₹${completedTotal.toFixed(2)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Track via WhatsApp
                </a>
                <button
                  onClick={handleCloseAll}
                  className="w-full sm:w-auto bg-[#af1820] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#d23435] transition-colors cursor-pointer"
                  type="button"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Account Status Pill */}
              <div className="bg-[#fcf5eb] p-3 rounded-xl border border-[#ebd3aa] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2c6117] text-[18px]">verified_user</span>
                  <span>
                    Ordering as: <strong className="text-[#241a04]">{profile?.displayName || user.email}</strong>
                  </span>
                </div>
                <span className="text-[#886a3d] font-mono text-[11px]">{user.email}</span>
              </div>

              {/* Order Items Preview */}
              <div className="bg-[#ffebcb] p-4 rounded-xl border border-[#ebd3aa]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7b5737] mb-3">
                  Basket Items ({cartItems.length})
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between items-center text-xs">
                      <span className="text-[#241a04] font-medium">
                        {item.quantity}x {item.name} ({item.weight})
                      </span>
                      <span className="font-bold text-[#af1820]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h4 className="text-sm font-bold text-[#241a04] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#af1820] text-lg">
                    location_on
                  </span>
                  Delivery Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sridevi Rao"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:ring-1 focus:ring-[#af1820] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Phone (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:ring-1 focus:ring-[#af1820] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Street Address / Flat No. *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House No, Apartment, Street name"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:ring-1 focus:ring-[#af1820] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:ring-1 focus:ring-[#af1820] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500081"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 bg-white text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:ring-1 focus:ring-[#af1820] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                  Have a Heritage Voucher? (Try: KAMALA10)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 bg-white text-[#241a04] uppercase font-mono rounded-lg text-xs border border-[#ebd3aa] focus:outline-none focus:ring-1 focus:ring-[#af1820]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#7b5737] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#613f22] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount > 0 && (
                  <p className="text-xs text-green-700 font-semibold mt-1">
                    ✓ {appliedDiscount}% voucher discount applied!
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-[#af1820] mt-1">{couponError}</p>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-sm font-bold text-[#241a04] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#af1820] text-lg">
                    payments
                  </span>
                  Select Payment Method
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                      formData.paymentMethod === 'online'
                        ? 'bg-[#ffebcb] border-[#af1820] shadow-xs'
                        : 'bg-white border-[#ebd3aa] hover:bg-[#fff2df]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'online'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'online' })}
                      className="accent-[#af1820]"
                    />
                    <div className="text-xs font-bold text-[#241a04]">
                      Online Payment (Razorpay)
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                      formData.paymentMethod === 'cod'
                        ? 'bg-[#ffebcb] border-[#af1820] shadow-xs'
                        : 'bg-white border-[#ebd3aa] hover:bg-[#fff2df]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="accent-[#af1820]"
                    />
                    <div className="text-xs font-bold text-[#241a04]">
                      Cash on Delivery (COD)
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-[#ebd3aa] space-y-1.5 text-xs text-[#5b403e]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Voucher ({appliedDiscount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Direct Courier Dispatch</span>
                  <span>{shippingFee === 0 ? 'FREE (Orders > ₹499)' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#241a04] pt-2 border-t border-[#ebd3aa]">
                  <span>Amount Payable</span>
                  <span className="text-[#af1820]">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || subtotal === 0}
                className="w-full bg-[#af1820] hover:bg-[#d23435] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Processing...' : formData.paymentMethod === 'online' ? `Pay Securely (₹${finalTotal.toFixed(2)})` : `Confirm & Place Order (₹${finalTotal.toFixed(2)})`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
