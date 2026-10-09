import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeGiftThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100));
  const remainingForGift = freeGiftThreshold - subtotal;

  return (
    <>
      {/* Backdrop */}
      <div
        id="cart-backdrop"
        className={`fixed inset-0 bg-[#241a04]/50 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slideout Aside */}
      <aside
        id="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#fff2df] z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-[0_12px_32px_-4px_rgba(75,45,17,0.2)] border-l border-[#ebd3aa] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-20 px-6 flex items-center justify-between bg-[#ffebcb] border-b border-[#ebd3aa] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7b5737] text-2xl">
              shopping_basket
            </span>
            <h2 className="font-headline-sm text-2xl text-[#241a04]">Boutique Cart</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-[#ffcea6] text-[#7a5536] rounded-full ml-1">
              {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button
            id="close-cart-btn"
            aria-label="Close spice cart"
            className="flex items-center justify-center p-1.5 text-[#5b403e] hover:text-[#241a04] hover:bg-white/40 rounded-full transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Free Gift Promo / Progress Banner */}
        <div className="p-3 bg-[#fbe6c1] text-center border-b border-[#ebd3aa] shrink-0">
          <p className="text-xs text-[#7b5737] font-semibold tracking-wide">
            {remainingForGift > 0 ? (
              <>
                Add <span className="text-[#af1820] font-bold">₹{remainingForGift}</span> more for a{' '}
                <span className="font-bold">Complimentary brass measuring spoon</span>
              </>
            ) : (
              <span className="text-[#af1820] font-bold">
                🎉 Congratulations! Complimentary brass measuring spoon unlocked!
              </span>
            )}
          </p>
          {/* Subtle Progress Bar */}
          <div className="w-full bg-[#ebd3aa] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#af1820] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5b403e]">
              <span className="material-symbols-outlined text-5xl text-[#ebd3aa] mb-3">
                shopping_bag
              </span>
              <h3 className="font-headline-sm text-xl text-[#241a04] mb-1">Your Cart is Empty</h3>
              <p className="text-xs text-[#5b403e] max-w-xs mb-6">
                Explore our courtyard roasted podis, fragrant rasam blends, and handcrafted tiffin premixes.
              </p>
              <button
                onClick={onClose}
                className="bg-[#af1820] text-white px-6 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider hover:bg-[#d23435] transition-colors cursor-pointer"
                type="button"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="flex gap-4 p-4 bg-white rounded-lg shadow-xs border border-[#ebd3aa]/60 hover:border-[#af1820]/30 transition-colors"
              >
                {/* Item Thumbnail */}
                <div className="w-16 h-16 bg-[#f5e0bb] rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-[#ebd3aa]">
                  {item.image ? (
                    <img
                      alt={item.name}
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[#7b5737] text-3xl">
                      grain
                    </span>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-[#241a04]">{item.name}</h3>
                    <button
                      aria-label="Remove item"
                      className="text-[#5b403e] hover:text-[#af1820] transition-colors p-0.5 cursor-pointer"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[#5b403e] font-medium">
                    {item.packagingNote || `${item.weight === '100gm' ? '100 gm Pack' : '1/4 kg Pack'}`}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-[#af1820]">
                      ₹{item.price * item.quantity}
                    </span>

                    <div className="flex items-center gap-1 bg-[#ffebcb] rounded px-1.5 py-0.5 border border-[#ebd3aa]">
                      <button
                        aria-label="Decrease count"
                        className="text-[#5b403e] hover:text-[#241a04] text-sm font-bold w-5 h-5 flex items-center justify-center cursor-pointer"
                        onClick={() => onUpdateQty(item.cartItemId, -1)}
                        type="button"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1 text-[#241a04] min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        aria-label="Increase count"
                        className="text-[#5b403e] hover:text-[#241a04] text-sm font-bold w-5 h-5 flex items-center justify-center cursor-pointer"
                        onClick={() => onUpdateQty(item.cartItemId, 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Bottom Checkout Panel */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-[#ebd3aa] shrink-0">
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs text-[#5b403e]">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5b403e]">
                <span>Ancestral Packaging</span>
                <span className="font-semibold text-[#7b5737]">FREE</span>
              </div>
              {subtotal >= 499 && (
                <div className="flex justify-between text-xs text-[#5b403e]">
                  <span>Courier Tasting Spoon</span>
                  <span className="font-semibold text-[#af1820]">FREE GIFT</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#241a04] pt-2 border-t border-[#ebd3aa]/60">
                <span>Total</span>
                <span className="text-[#af1820]">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="proceed-checkout-btn"
                className="w-full bg-[#af1820] hover:bg-[#d23435] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs hover:shadow cursor-pointer"
                onClick={onProceedToCheckout}
                type="button"
              >
                Proceed to Checkout
              </button>
              <button
                className="w-full bg-transparent text-[#7b5737] hover:text-[#241a04] py-2 text-xs font-medium text-center transition-colors cursor-pointer"
                onClick={onClose}
                type="button"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
