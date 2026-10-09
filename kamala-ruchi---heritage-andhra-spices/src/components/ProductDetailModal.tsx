import React, { useState } from 'react';
import { Product, CartItem } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product, weight: '100gm' | '250gm', quantity: number) => void;
  onUpdateQty: (cartItemId: string, delta: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  cartItems,
  onAddToCart,
  onUpdateQty,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedWeight, setSelectedWeight] = useState<'100gm' | '250gm'>('100gm');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const cartItemId = `${product.id}-${selectedWeight}`;
  const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const currentPrice = selectedWeight === '100gm' ? product.basePrice : product.largePrice;

  const handleAdd = () => {
    onAddToCart(product, selectedWeight, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241a04]/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#fff8f2] rounded-2xl shadow-2xl border border-[#ebd3aa] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#241a04] flex items-center justify-center shadow-md cursor-pointer transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Image Column */}
            <div className="md:col-span-5 flex flex-col">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#ffebcb] border border-[#ebd3aa] shadow-inner">
                <img
                  alt={product.name}
                  src={product.image}
                  className="w-full h-full object-cover"
                />
                <button
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  onClick={() => onToggleWishlist(product.id)}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-[#af1820] flex items-center justify-center shadow-md cursor-pointer"
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Heat Rating */}
              <div className="mt-4 p-3.5 bg-[#ffebcb] rounded-lg border border-[#ebd3aa] flex items-center justify-between">
                <span className="text-xs font-bold text-[#7b5737] uppercase tracking-wider">
                  Spice Heat Index:
                </span>
                <div className="flex items-center gap-1 text-[#af1820]">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <span
                      key={lvl}
                      className="material-symbols-outlined text-lg"
                      style={{
                        fontVariationSettings: lvl <= product.heatLevel ? "'FILL' 1" : "'FILL' 0",
                        opacity: lvl <= product.heatLevel ? 1 : 0.3,
                      }}
                    >
                      local_fire_department
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="md:col-span-7 flex flex-col">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {product.badges.map((b, i) => (
                  <span
                    key={i}
                    className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#f5e0bb] text-[#7b5737] border border-[#ebd3aa]"
                  >
                    {b.text}
                  </span>
                ))}
              </div>

              <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#241a04]">
                {product.name}
              </h2>
              {product.teluguName && (
                <span className="text-sm font-semibold text-[#7b5737] mb-3 block">
                  {product.teluguName}
                </span>
              )}

              <p className="text-sm text-[#5b403e] leading-relaxed mb-4">
                {product.fullDescription}
              </p>

              {/* Ingredients */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7b5737] mb-2">
                  Heritage Ingredients:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 bg-white rounded-md border border-[#ebd3aa] text-[#241a04] font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best Paired With */}
              <div className="mb-6 p-3 bg-[#fff2df] rounded-lg border border-[#ebd3aa]">
                <div className="text-xs font-bold text-[#af1820] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">restaurant</span>
                  How to Enjoy:
                </div>
                <p className="text-xs text-[#5b403e] leading-relaxed">
                  {product.bestPairedWith}
                </p>
              </div>

              {/* Weight & Add To Cart */}
              <div className="mt-auto pt-4 border-t border-[#ebd3aa] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedWeight('100gm')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        selectedWeight === '100gm'
                          ? 'bg-[#7b5737] text-white'
                          : 'bg-[#ffebcb] text-[#241a04]'
                      }`}
                    >
                      100 gm (₹{product.basePrice})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWeight('250gm')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        selectedWeight === '250gm'
                          ? 'bg-[#7b5737] text-white'
                          : 'bg-[#ffebcb] text-[#241a04]'
                      }`}
                    >
                      1/4 kg (₹{product.largePrice})
                    </button>
                  </div>
                  <span className="text-2xl font-bold text-[#af1820]">
                    ₹{currentPrice}
                  </span>
                </div>

                <div>
                  {cartQuantity === 0 ? (
                    <button
                      onClick={handleAdd}
                      className={`w-full py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        added
                          ? 'bg-[#7b5737] text-white scale-[0.99]'
                          : 'bg-[#af1820] hover:bg-[#d23435] text-white hover:shadow-lg'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {added ? 'done' : 'add_shopping_cart'}
                      </span>
                      <span>{added ? 'Added to Basket!' : `Add to Basket • ₹${currentPrice}`}</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full bg-[#ffebcb] rounded-lg p-1.5 border border-[#ebd3aa] shadow-xs">
                      <button
                        onClick={() => onUpdateQty(cartItemId, -1)}
                        className="w-9 h-9 rounded-md bg-[#fff8f2] hover:bg-[#af1820] hover:text-white text-[#241a04] flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
                        type="button"
                        aria-label="Decrease quantity"
                        title={cartQuantity === 1 ? 'Remove from basket' : 'Decrease quantity'}
                      >
                        {cartQuantity === 1 ? (
                          <span className="material-symbols-outlined text-[18px] text-[#af1820] hover:text-white">
                            delete
                          </span>
                        ) : (
                          <span className="text-lg font-bold leading-none">-</span>
                        )}
                      </button>

                      <div className="flex flex-col items-center px-4">
                        <span className="text-sm font-bold text-[#af1820]">
                          {cartQuantity} in Basket
                        </span>
                        <span className="text-xs text-[#7b5737] font-semibold">
                          Total: ₹{currentPrice * cartQuantity}
                        </span>
                      </div>

                      <button
                        onClick={() => onUpdateQty(cartItemId, 1)}
                        className="w-9 h-9 rounded-md bg-[#af1820] hover:bg-[#d23435] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
                        type="button"
                        aria-label="Increase quantity"
                        title="Add one more"
                      >
                        <span className="text-lg font-bold leading-none">+</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
