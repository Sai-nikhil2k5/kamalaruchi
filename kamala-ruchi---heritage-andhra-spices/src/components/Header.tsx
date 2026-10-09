import React, { useState } from 'react';
import { ActivePage } from '../types';
import { useAuth } from '../lib/AuthContext';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  cartCount: number;
  openCart: () => void;
  openSearch: () => void;
  openQuickOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  cartCount,
  openCart,
  openSearch,
  openQuickOrder,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, profile, isAdmin, signOut, openAuthModal } = useAuth();

  const navLinks: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'our-story', label: 'Our Story' },
    { id: 'recipes', label: 'Recipes' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="main-header"
        className="fixed top-0 left-0 right-0 z-40 bg-black shadow-[0_12px_32px_-4px_rgba(75,45,17,0.18)] border-b border-[#5a431f]/40"
      >
        <div className="h-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="mobile-menu-toggle"
              aria-label="Toggle Mobile Menu"
              className="lg:hidden flex items-center justify-center p-1.5 text-[#ffdcc2] hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>

            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center group cursor-pointer text-left py-1"
              type="button"
              aria-label="Kamala Ruchi - Return to Homepage"
            >
              <div className="h-11 sm:h-13 md:h-15 flex items-center">
                <img
                  alt="Kamala Ruchi - Mother's Secret Spice Legacy"
                  className="h-full w-auto max-w-[210px] sm:max-w-[290px] md:max-w-[340px] object-contain transition-transform group-hover:scale-[1.02] drop-shadow-md"
                  src="/logo.png"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-[15px] xl:text-[16px] font-medium transition-all duration-200 cursor-pointer py-1 ${
                    isActive
                      ? 'text-[#ffddb1] font-semibold underline decoration-[#af1820] decoration-2 underline-offset-8'
                      : 'text-[#ffdcc2] hover:text-[#fff8f2]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* My Orders navigation tab if logged in */}
            {user && (
              <button
                onClick={() => handleNavClick('orders')}
                className={`text-[15px] xl:text-[16px] font-medium transition-all duration-200 cursor-pointer py-1 ${
                  activePage === 'orders'
                    ? 'text-[#ffddb1] font-semibold underline decoration-[#af1820] decoration-2 underline-offset-8'
                    : 'text-[#ffdcc2] hover:text-[#fff8f2]'
                }`}
              >
                My Orders
              </button>
            )}

            {/* Admin Command Center Link if admin */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activePage === 'admin'
                    ? 'bg-[#af1820] text-white shadow-sm ring-2 ring-[#ffddb1]'
                    : 'bg-[#5a431f]/70 text-[#ffddb1] hover:bg-[#af1820] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">shield_person</span>
                <span>Admin Monitor</span>
              </button>
            )}
          </nav>

          {/* Actions: Search, Cart, WhatsApp Quick Order, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="search-btn"
              aria-label="Search boutique provisions"
              className="flex items-center justify-center p-2 text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer rounded-full hover:bg-white/5"
              onClick={openSearch}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            <button
              id="cart-trigger-btn"
              aria-label="View heirloom spice cart"
              className="relative flex items-center justify-center p-2 text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer rounded-full hover:bg-white/5"
              onClick={openCart}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span
                  id="cart-count-badge"
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 bg-[#af1820] text-white text-[11px] font-bold rounded-full leading-none shadow-sm"
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="quick-order-btn"
              aria-label="WhatsApp Quick Order"
              className="hidden sm:flex items-center gap-1.5 bg-[#876c45] hover:bg-[#6d542f] text-[#fff4eb] px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
              onClick={openQuickOrder}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span className="text-[11px] font-semibold tracking-wider uppercase">
                Quick Order
              </span>
            </button>

            {/* User Account / Profile Menu */}
            <div className="relative pl-1 shrink-0">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="User profile and settings"
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#e3c193] shadow-xs bg-[#241a04] flex items-center justify-center text-xs font-bold text-[#ffddb1]">
                      {profile?.displayName?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl shadow-xl py-2 z-50 text-xs text-[#241a04] animate-in fade-in duration-150">
                      <div className="px-4 py-3 border-b border-[#ebd3aa]/60">
                        <div className="font-bold text-sm text-[#241a04] truncate">
                          {profile?.displayName || 'Kamala Customer'}
                        </div>
                        <div className="text-[11px] text-[#5a431f] truncate font-mono">{user.email}</div>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isAdmin ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30' : 'bg-[#e2f0d9] text-[#2c6117]'
                        }`}>
                          {profile?.role || 'customer'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleNavClick('orders')}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#ffebcb] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#7b5804]">receipt_long</span>
                        <span>My Spice Orders</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full px-4 py-2.5 text-left hover:bg-[#ffebcb] flex items-center gap-2 cursor-pointer transition-colors font-bold text-[#af1820]"
                        >
                          <span className="material-symbols-outlined text-[18px]">shield_person</span>
                          <span>Admin Command Center</span>
                        </button>
                      )}

                      <div className="border-t border-[#ebd3aa]/60 my-1" />

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await signOut();
                          handleNavClick('home');
                        }}
                        className="w-full px-4 py-2.5 text-left text-[#af1820] hover:bg-[#ffdad6]/40 flex items-center gap-2 cursor-pointer transition-colors font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1.5 bg-[#af1820] hover:bg-[#8e1319] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer-backdrop"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        id="mobile-drawer"
        className={`fixed inset-y-0 right-0 w-80 max-w-full bg-black z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col p-6 shadow-2xl border-l border-[#5a431f] ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#5a431f]/60">
          <div className="flex items-center">
            <img
              alt="Kamala Ruchi - Mother's Secret Spice Legacy"
              className="h-12 w-auto max-w-[200px] object-contain drop-shadow-sm"
              src="/logo.png"
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            id="close-mobile-menu"
            aria-label="Close navigation menu"
            className="text-[#ffdcc2] hover:text-white p-1"
            onClick={() => setMobileMenuOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Mobile User Profile header */}
        {user ? (
          <div className="mt-4 p-3 rounded-xl bg-white/10 border border-[#e3c193]/30 text-white text-xs flex items-center justify-between">
            <div className="truncate">
              <div className="font-bold text-[#ffddb1] truncate">{profile?.displayName || user.email}</div>
              <div className="text-[10px] text-[#e3c193] truncate">{user.email}</div>
            </div>
            <button
              onClick={async () => {
                setMobileMenuOpen(false);
                await signOut();
              }}
              className="text-[#ffdcc2] hover:text-white text-xs underline cursor-pointer shrink-0 ml-2"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openAuthModal('signin');
            }}
            className="mt-4 w-full bg-[#af1820] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            Sign In / Register
          </button>
        )}

        <nav className="flex flex-col gap-3 mt-5">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left text-base py-2 transition-colors ${
                  isActive ? 'text-[#ffddb1] font-bold pl-2 border-l-2 border-[#af1820]' : 'text-[#ffdcc2] hover:text-[#fff8f2]'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {user && (
            <button
              onClick={() => handleNavClick('orders')}
              className={`text-left text-base py-2 transition-colors ${
                activePage === 'orders' ? 'text-[#ffddb1] font-bold pl-2 border-l-2 border-[#af1820]' : 'text-[#ffdcc2] hover:text-[#fff8f2]'
              }`}
            >
              My Orders
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-left text-base py-2 transition-colors text-[#ffddb1] font-bold flex items-center gap-2 ${
                activePage === 'admin' ? 'pl-2 border-l-2 border-[#af1820]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shield_person</span>
              Admin Command Center
            </button>
          )}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-[#5a431f]/40">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openQuickOrder();
            }}
            className="flex items-center justify-center gap-2 bg-[#876c45] text-[#fff4eb] py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            WhatsApp Concierge
          </button>
          <div className="text-center text-[10px] text-[#e3c193]/70">
            Handcrafted with love in Srikakulam, Andhra Pradesh
          </div>
        </div>
      </div>
    </>
  );
};
