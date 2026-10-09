import React, { useState } from 'react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, onShowToast }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast('Please enter a valid email address');
      return;
    }
    onShowToast(`Subscribed! Seasonal harvest drop updates sent to ${email}`);
    setEmail('');
  };

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="w-full bg-black text-[#ffefd5] pt-12 pb-8 border-t border-[#5a431f]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col space-y-3">
          <div className="mb-2">
            <img
              alt="Kamala Ruchi - Mother's Secret Spice Legacy"
              className="h-16 w-auto max-w-[240px] object-contain drop-shadow-md"
              src="/logo.png"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-xs sm:text-sm text-[#f5e0bb]/80 leading-relaxed">
            Hand-pounded ancestral spice blends, sun-dried heirloom chilies, and cold-pressed condiments born from three generations of South Indian matriarchs.
          </p>
          <div className="text-[11px] text-[#e3c193] tracking-wide pt-1">
            Courtyard Roastery • Srikakulam, AP
          </div>
        </div>

        {/* Curated Pantry Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-sm font-bold text-[#ffddb1] uppercase tracking-wider">
            Curated Pantry
          </h4>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleNav('shop')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Heirloom Podis
            </button>
            <button
              onClick={() => handleNav('shop')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Sun-Dried Pickles
            </button>
            <button
              onClick={() => handleNav('shop')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Whole Heritage Spices
            </button>
            <button
              onClick={() => handleNav('shop')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Ghee Roasts &amp; Masalas
            </button>
          </nav>
        </div>

        {/* The Heritage Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-sm font-bold text-[#ffddb1] uppercase tracking-wider">
            The Heritage
          </h4>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleNav('our-story')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Our Matriarch&apos;s Journal
            </button>
            <button
              onClick={() => handleNav('recipes')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Courtyard Recipes
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Direct Farmer Sourcing
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="text-left text-xs text-[#ffdcc2] hover:text-[#fff8f2] transition-colors cursor-pointer"
            >
              Wholesale &amp; Gifting
            </button>
          </nav>
        </div>

        {/* Spice Sanctum Newsletter Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-sm font-bold text-[#ffddb1] uppercase tracking-wider">
            Spice Sanctum
          </h4>
          <p className="text-xs text-[#f5e0bb]/80">
            Receive seasonal batches and rare harvest drops directly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-[#f5e0bb]/15 text-[#fff8f2] placeholder-[#f5e0bb]/50 px-3.5 py-2 text-xs rounded-l-md border border-[#5a431f] focus:outline-none focus:bg-[#f5e0bb]/25"
            />
            <button
              aria-label="Subscribe to spice journal"
              className="bg-[#af1820] hover:bg-[#d23435] text-white px-3.5 py-2 rounded-r-md text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 pt-6 border-t border-[#5a431f]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#f5e0bb]/70 gap-3">
        <p>© 2025 Kamala Ruchi. Consecrated to the kitchen memories of Amma. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleNav('contact')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Sanctuary Ethics
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Shipping &amp; Returns
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
};
