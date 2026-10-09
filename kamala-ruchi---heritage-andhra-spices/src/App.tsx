import React, { useState, useEffect } from 'react';
import { Product, CartItem, ActivePage } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { TopNotificationBar } from './components/TopNotificationBar';
import { HeroSection } from './components/HeroSection';
import { BrandValuesStrip } from './components/BrandValuesStrip';
import { BotanicalDivider } from './components/BotanicalDivider';
import { ShopSection } from './components/ShopSection';
import { EditorialStoryBanner } from './components/EditorialStoryBanner';
import { ServiceConciergeStrip } from './components/ServiceConciergeStrip';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OurStoryView } from './components/OurStoryView';
import { RecipesView } from './components/RecipesView';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { logUserActivity, fetchProducts, fetchAnnouncements, fetchPopups } from './lib/dbService';
import { Announcement, PopupNote } from './types';

function AppContent() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { user, profile, isAdmin } = useAuth();

  // Wishlist stored in local state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['koora-karaam', 'kandi-podi']);

  // Shopping cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Dynamic products
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [popup, setPopup] = useState<PopupNote | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const refreshData = () => {
    if (activePage !== 'admin') {
      fetchProducts().then(setProducts);
      fetchAnnouncements().then(res => setAnnouncement(res.length > 0 ? res[0] : null));
      fetchPopups().then(res => {
        if (res.length > 0 && res[0].isActive) {
          setPopup(res[0]);
          setIsPopupVisible(true);
        }
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, [activePage]);

  useEffect(() => {
    window.addEventListener('kamala-data-updated', refreshData);
    return () => window.removeEventListener('kamala-data-updated', refreshData);
  }, [activePage]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: Product, weight: '100gm' | '250gm', quantity: number) => {
    const price = weight === '100gm' ? product.basePrice : product.largePrice;
    const cartItemId = `${product.id}-${weight}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          weight,
          price,
          quantity,
          image: product.image,
          packagingNote: weight === '100gm' ? '100 gm Pack' : '1/4 kg Pack',
        },
      ];
    });

    // Log action to firestore audit stream
    logUserActivity(
      'ADD_TO_CART',
      `Added ${quantity}x ${product.name} (${weight}) to basket`,
      { uid: user?.uid, email: user?.email, displayName: profile?.displayName }
    );

    showToast(`Added ${quantity}x ${product.name} (${weight}) to your spice basket!`);
  };

  const handleUpdateQty = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from basket');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from favorites');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your Andhra favorites!');
        return [...prev, productId];
      }
    });
  };

  const handleShopClick = () => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById('shop-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('shop-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRecipeHeroProductSelect = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    } else {
      handleShopClick();
    }
  };

  const handleOpenQuickOrder = () => {
    window.open(
      'https://wa.me/917396311063?text=Namaste%20Kamala%20Ruchi,%20I%20would%20like%20to%20place%20a%20quick%20spice%20order.',
      '_blank'
    );
  };

  const searchFilteredProducts = modalSearchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(modalSearchQuery.toLowerCase()))
      )
    : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#241a04] flex flex-col font-sans selection:bg-[#ffcea6] selection:text-[#241a04]">
      {/* Fixed Main Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        openSearch={() => setIsSearchModalOpen(true)}
        openQuickOrder={handleOpenQuickOrder}
      />

      {/* Main Page Body (offset for fixed header) */}
      <main className="flex-1 pt-20">
        {/* Top Notification Announcement Bar */}
        {announcement?.isActive ? (
          <div className="bg-[#af1820] text-white text-xs font-bold py-2 overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-marquee pr-8">
              {announcement.message}
            </div>
          </div>
        ) : <TopNotificationBar />}

        {/* Admin Dashboard Screen View */}
        {activePage === 'admin' && isAdmin && (
          <AdminDashboardView />
        )}

        {/* Home Screen View */}
        {activePage === 'home' && (
          <>
            <HeroSection
              onShopClick={handleShopClick}
              setActivePage={setActivePage}
            />
            <BrandValuesStrip />
            <BotanicalDivider />
            <ShopSection
              products={products}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQty={handleUpdateQty}
              onSelectProduct={(p) => setSelectedProduct(p)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
            <EditorialStoryBanner setActivePage={setActivePage} />
            <ServiceConciergeStrip />
          </>
        )}

        {/* Shop Screen View */}
        {activePage === 'shop' && (
          <div className="py-4">
            <ShopSection
              products={products}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQty={handleUpdateQty}
              onSelectProduct={(p) => setSelectedProduct(p)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              isStandaloneShopPage
            />
            <ServiceConciergeStrip />
          </div>
        )}

        {/* Our Story Screen View */}
        {activePage === 'our-story' && (
          <OurStoryView setActivePage={setActivePage} />
        )}

        {/* Recipes Screen View */}
        {activePage === 'recipes' && (
          <RecipesView
            onSelectRecipeProduct={handleRecipeHeroProductSelect}
            products={products}
          />
        )}

        {/* Contact Screen View */}
        {activePage === 'contact' && (
          <ContactView onShowToast={showToast} />
        )}

        {/* Customer Orders Screen View */}
        {activePage === 'orders' && (
          <CustomerOrdersView onShopNow={handleShopClick} />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} onShowToast={showToast} />

      {/* Slideout Boutique Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={(orderId) => {
          setCartItems([]);
          showToast(`Order #${orderId} confirmed and saved to your account!`);
        }}
        onViewOrders={() => {
          setActivePage('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQty={handleUpdateQty}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Quick Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#241a04]/50 backdrop-blur-xs">
          <div className="bg-[#fff8f2] w-full max-w-xl rounded-2xl shadow-2xl border border-[#ebd3aa] overflow-hidden">
            <div className="p-4 bg-[#ffebcb] border-b border-[#ebd3aa] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7b5737] text-2xl">
                search
              </span>
              <input
                type="text"
                autoFocus
                placeholder="Search by podi name, ingredient, or recipe..."
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[#241a04] placeholder-[#5b403e]/60 text-sm font-semibold focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setModalSearchQuery('');
                }}
                className="text-[#5b403e] hover:text-[#241a04] p-1 rounded-full cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto divide-y divide-[#ebd3aa]/40">
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#7b5737] mb-2">
                {modalSearchQuery ? 'Matching Spices' : 'Popular Ancestral Spices'}
              </p>
              {searchFilteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#ebd3aa]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#241a04] group-hover:text-[#af1820] transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-xs text-[#5b403e] line-clamp-1">
                        {p.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-[#af1820]">₹{p.basePrice}</span>
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsSearchModalOpen(false);
                      }}
                      className="px-3 py-1 bg-[#ffebcb] hover:bg-[#af1820] hover:text-white text-[#241a04] text-xs font-bold rounded-md transition-colors cursor-pointer"
                      type="button"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Popup Modal */}
      {isPopupVisible && popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pt-10 px-4 bg-[#241a04]/60 backdrop-blur-sm">
          <div className="bg-[#fff8f2] w-full max-w-sm rounded-2xl shadow-2xl border border-[#ebd3aa] overflow-hidden text-center relative p-6 animate-in zoom-in-95">
            <button onClick={() => setIsPopupVisible(false)} className="absolute top-2 right-2 text-[#886a3d] hover:text-[#241a04]">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="w-12 h-12 bg-[#ffebcb] text-[#af1820] rounded-full mx-auto flex items-center justify-center mb-4 border border-[#ebd3aa]">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <h3 className="font-headline-sm text-xl text-[#241a04] mb-2">{popup.title}</h3>
            <p className="text-sm text-[#5a431f] mb-6">{popup.message}</p>
            {popup.buttonText && (
              <button onClick={() => setIsPopupVisible(false)} className="px-6 py-2 bg-[#af1820] hover:bg-[#d23435] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                {popup.buttonText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#3b2f16] text-[#ffefd5] px-4 py-3 rounded-xl shadow-2xl border border-[#ebd3aa]/40 transform animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <span className="material-symbols-outlined text-[#ffddb1] text-xl">
            spa
          </span>
          <p className="text-xs sm:text-sm font-semibold pr-2">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#ffddb1]/70 hover:text-white p-0.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
