import React, { useState } from 'react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  cartItems: CartItem[];
  onAddToCart: (product: Product, weight: '100gm' | '250gm', quantity: number) => void;
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onSelectProduct: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartItems,
  onAddToCart,
  onUpdateQty,
  onSelectProduct,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedWeight, setSelectedWeight] = useState<'100gm' | '250gm'>('100gm');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const cartItemId = `${product.id}-${selectedWeight}`;
  const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const currentPrice = selectedWeight === '100gm' ? product.basePrice : product.largePrice;

  const handleAdd = () => {
    onAddToCart(product, selectedWeight, 1);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 600);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="product-card group flex flex-col lg:flex-row bg-[#fffbf6] rounded-2xl shadow-xl overflow-hidden border border-[#ebd3aa]"
    >
      {/* LEFT COLUMN: Image, Price, and Actions - Sticky on Desktop */}
      <div className="w-full lg:w-1/2 relative border-b lg:border-b-0 lg:border-r border-[#ebd3aa] bg-[#fff8f2]">
        <div className="lg:sticky lg:top-24 flex flex-col">
          
          {/* Image Stage */}
          <div className="relative h-72 lg:h-80 xl:h-[28rem] bg-[#ffebcb] shrink-0 overflow-hidden">
            <button
              onClick={() => onSelectProduct(product)}
              className="w-full h-full text-left cursor-pointer focus:outline-none"
              type="button"
              aria-label={`View details for ${product.name}`}
            >
              <img
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                src={product.image}
              />
            </button>

            {/* Badges on Top-Left */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
              {product.isCombo && (
                <span className="px-3 py-1 text-[11px] uppercase tracking-widest rounded bg-[#7b5737] text-white font-bold shadow-md">
                  Combo Deal
                </span>
              )}
              {product.inStock === false && (
                <span className="px-3 py-1 text-[11px] uppercase tracking-widest rounded bg-black text-white font-bold shadow-md border border-black/50">
                  Out of Stock
                </span>
              )}
              {product.badges.map((badge, idx) => {
                let badgeStyle = 'bg-[#fff8f2] text-[#7b5737] font-bold border border-[#ebd3aa]';
                if (badge.variant === 'primary') badgeStyle = 'bg-[#af1820] text-white font-bold';
                else if (badge.variant === 'secondary') badgeStyle = 'bg-[#7b5737] text-white font-bold';
                
                return (
                  <span key={idx} className={`px-3 py-1 text-[11px] uppercase tracking-widest rounded shadow-md ${badgeStyle}`}>
                    {badge.text}
                  </span>
                );
              })}
            </div>

            {/* Wishlist Heart on Top-Right */}
            <button
              id={`wishlist-btn-${product.id}`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`wishlist-btn absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isWishlisted
                  ? 'bg-white text-[#af1820]'
                  : 'bg-white/80 text-[#5b403e] hover:text-[#af1820] hover:bg-white'
              }`}
              onClick={() => onToggleWishlist(product.id)}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>
          </div>

          {/* Pricing & Cart Action Area */}
          <div className="p-6 lg:p-8 shrink-0 space-y-6 bg-[#fffbf6]">
            
            <div className="flex justify-between items-center">
              <span className="text-[#7b5737] font-bold text-sm uppercase tracking-widest">Our Price</span>
              <div className="text-3xl font-headline-lg font-bold text-[#af1820]">
                ₹{currentPrice}
              </div>
            </div>

            {/* Weight Selection Pills */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedWeight('100gm')}
                className={`flex-1 py-3 px-2 text-center rounded-xl transition-all text-sm font-bold cursor-pointer ${
                  selectedWeight === '100gm'
                    ? 'bg-[#7b5737] text-white shadow-md ring-2 ring-[#7b5737] ring-offset-2 ring-offset-[#fffbf6]'
                    : 'bg-white border border-[#ebd3aa] text-[#241a04] hover:bg-[#ffebcb]'
                }`}
              >
                100 gm (₹{product.basePrice})
              </button>

              <button
                type="button"
                onClick={() => setSelectedWeight('250gm')}
                className={`flex-1 py-3 px-2 text-center rounded-xl transition-all text-sm font-bold cursor-pointer ${
                  selectedWeight === '250gm'
                    ? 'bg-[#7b5737] text-white shadow-md ring-2 ring-[#7b5737] ring-offset-2 ring-offset-[#fffbf6]'
                    : 'bg-white border border-[#ebd3aa] text-[#241a04] hover:bg-[#ffebcb]'
                }`}
              >
                1/4 kg (₹{product.largePrice})
              </button>
            </div>

            <div className="pt-2">
              {cartQuantity === 0 ? (
                <button
                  id={`add-to-cart-btn-${product.id}`}
                  disabled={product.inStock === false}
                  className={`w-full py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                    product.inStock === false
                      ? 'bg-gray-400 text-white cursor-not-allowed shadow-none'
                      : addedAnimation
                        ? 'bg-[#7b5737] text-white scale-[0.98] cursor-pointer'
                        : 'bg-[#af1820] hover:bg-[#d23435] hover:shadow-xl text-white active:scale-[0.99] cursor-pointer'
                  }`}
                  onClick={handleAdd}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {addedAnimation ? 'done' : 'shopping_bag'}
                  </span>
                  <span>{addedAnimation ? 'Added to Basket!' : 'Add to Basket'}</span>
                </button>
              ) : (
                <div className="flex items-center justify-between w-full bg-white rounded-xl p-2 border-2 border-[#af1820] shadow-md">
                  <button
                    className="w-12 h-12 rounded-lg bg-[#fff8f2] hover:bg-[#af1820] hover:text-white text-[#241a04] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
                    onClick={() => onUpdateQty(cartItemId, -1)}
                    type="button"
                    aria-label="Decrease quantity"
                    title={cartQuantity === 1 ? 'Remove from basket' : 'Decrease quantity'}
                  >
                    {cartQuantity === 1 ? (
                      <span className="material-symbols-outlined text-[20px] text-[#af1820] hover:text-white">
                        delete
                      </span>
                    ) : (
                      <span className="leading-none text-xl font-bold">-</span>
                    )}
                  </button>

                  <div className="flex flex-col items-center px-4">
                    <span className="text-sm font-bold text-[#af1820] tracking-wider uppercase">
                      {cartQuantity} in Basket
                    </span>
                    <span className="text-xs text-[#7b5737] font-bold mt-0.5">
                      Total: ₹{currentPrice * cartQuantity}
                    </span>
                  </div>

                  <button
                    className="w-12 h-12 rounded-lg bg-[#af1820] hover:bg-[#d23435] text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
                    onClick={() => onUpdateQty(cartItemId, 1)}
                    type="button"
                    aria-label="Increase quantity"
                    title="Add one more"
                  >
                    <span className="leading-none text-xl font-bold">+</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Details & Heritage - Scrollable */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 xl:p-16 flex flex-col justify-start bg-[#fff8f2]">
        
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="block text-[#af1820] text-xs font-bold uppercase tracking-widest mb-2">{product.categoryLabel}</span>
              <button
                onClick={() => onSelectProduct(product)}
                className="text-left font-headline-lg text-3xl lg:text-4xl text-[#241a04] hover:text-[#af1820] transition-colors cursor-pointer"
                type="button"
              >
                {product.name}
              </button>
              {product.teluguName && (
                <div className="text-base font-bold text-[#7b5737] mt-2">{product.teluguName}</div>
              )}
            </div>
          </div>

          <p className="text-base text-[#5b403e] leading-loose">
            {product.fullDescription || product.description}
          </p>
        </div>

        {/* Health Benefits & Ingredients */}
        <div className="mt-auto bg-[#ffebcb]/50 rounded-2xl p-6 lg:p-8 border border-[#ebd3aa]/60 shadow-inner">
          <h4 className="text-sm font-bold text-[#7b5737] uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">spa</span>
            Health & Heritage
          </h4>
          <ul className="space-y-4">
            {product.benefits?.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[15px] text-[#5b403e] leading-relaxed">
                <span className="material-symbols-outlined text-[#af1820] text-[20px] shrink-0 mt-0.5">eco</span>
                <span>{benefit}</span>
              </li>
            ))}
            {product.ingredients?.length > 0 && (
              <li className="flex items-start gap-3 text-[15px] text-[#5b403e] leading-relaxed pt-4 border-t border-[#ebd3aa]/60 mt-4">
                <span className="material-symbols-outlined text-[#af1820] text-[20px] shrink-0 mt-0.5">local_florist</span>
                <span><strong>Crafted with:</strong> {product.ingredients.join(', ')}.</span>
              </li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};
