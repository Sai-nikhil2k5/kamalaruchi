import React from 'react';
import { ActivePage } from '../types';

interface HeroSectionProps {
  onShopClick: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick, setActivePage }) => {
  return (
    <section
      id="hero-section"
      className="relative w-full overflow-hidden py-10 lg:py-16 bg-gradient-to-b from-[#fff8f2] via-[#fff5eb] to-[#fff2df]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Prominent Official Brand Logo Banner */}
            <div className="mb-6 inline-flex items-center bg-[#241a04] px-4 py-2.5 rounded-2xl border-2 border-[#e3c193]/70 shadow-xl group hover:border-[#ffddb1] transition-all">
              <img
                src="/logo.png"
                alt="Kamala Ruchi - Mother's Secret Spice Legacy"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-[#ffebcb] border border-[#ebd3aa] px-3.5 py-1 rounded-full mb-5 shadow-xs">
              <span className="material-symbols-outlined text-[#af1820] text-[16px]">
                verified
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#5b403e] font-bold uppercase tracking-widest">
                TRADITIONAL ANDHRA SPICES • HOMEMADE GOODNESS
              </span>
            </div>

            <h1 className="font-headline-lg text-4xl sm:text-5xl lg:text-[58px] text-[#241a04] tracking-tight leading-[1.12] mb-5">
              Spices that feel <br className="hidden sm:inline" />
              <span className="italic text-[#af1820] font-normal font-headline-lg">
                like home.
              </span>
            </h1>

            <p className="text-[#5b403e] text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              Pure spices. Real flavours. Just like home. Hand-roasted in cast iron pans and stone-ground by Andhra matriarchs following timeless courtyard recipes.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                id="hero-shop-now-btn"
                onClick={onShopClick}
                className="inline-flex items-center justify-center gap-2 bg-[#af1820] hover:bg-[#d23435] text-white px-8 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                type="button"
              >
                <span>Shop Now</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                id="hero-secret-recipes-btn"
                onClick={() => setActivePage('recipes')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-[#7b5737] hover:text-[#241a04] transition-colors text-base font-semibold cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[#6d542f]">menu_book</span>
                <span>Our Secret Recipes</span>
              </button>
            </div>

            {/* Editorial Signature Note */}
            <div className="mt-10 pt-4 flex items-center gap-4 border-t border-[#ecd7b3]/60 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-[#ffcea6] flex items-center justify-center text-[#7a5536] shadow-inner shrink-0">
                <span className="material-symbols-outlined text-2xl">soup_kitchen</span>
              </div>
              <div>
                <p className="font-headline-sm text-lg sm:text-xl text-[#7b5737] italic leading-tight">
                  &ldquo;From Our Kitchen to Your Home&rdquo;
                </p>
                <span className="text-[12px] text-[#6d542f] uppercase tracking-wider font-semibold">
                  — Kamala Garu &amp; Daughters, Srikakulam
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Collage */}
          <div className="lg:col-span-6 relative flex justify-center mt-4 lg:mt-0">
            <div className="relative w-full max-w-lg lg:max-w-none rounded-xl overflow-hidden shadow-xl bg-[#ffebcb] border border-[#e3beba]/40">
              <img
                alt="Kamala Ruchi Traditional Culinary Mortar Pestle & Spices"
                className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover object-center transform hover:scale-102 transition-transform duration-700 ease-out"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH1lOtA5LQMhroWn-eB7L0-79h0ihX7l6bU2WkxE2HsGv6pj4n-pykSFtVVsNdGK5dxvBRu1xBVLuoSKta8OY8qCG-y79Q0IrvaZyx7Iz2gdqkwSH9kaUYreIH7U72v5nPhR1WwWQQJu66JHCPicKPpd2JPH0LCXajkaFQS6ouowx8UbCuX9DyXzHHinvcD1O39uJ6lNF4fHxu_CtpoVZTGmdRRuenLILazHU8LujcTiUXhJ4Vo7br"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b2f16]/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Origin Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#fff8f2]/95 backdrop-blur-md rounded-lg shadow-md flex items-center justify-between border border-[#e3beba]/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#af1820] text-3xl shrink-0">
                    auto_stories
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#241a04]">
                      Small-Batch Harvest 2025
                    </h4>
                    <p className="text-xs text-[#5b403e]">
                      Sun-dried Guntur chillies &amp; native lentils
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 bg-[#f5e0bb] text-[#7b5737] rounded font-bold uppercase tracking-wider shrink-0 border border-[#ecd7b3]">
                  Pure Andhra
                </span>
              </div>
            </div>

            {/* Decorative Offset Card */}
            <div className="hidden sm:flex flex-col gap-1 absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-xl border border-[#ecd7b3] z-20">
              <div className="flex items-center gap-1 text-[#af1820]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-[#241a04]">
                12,400+ Meals Blessed
              </span>
              <span className="text-xs text-[#7b5737] font-medium">
                Traditional Taste Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
