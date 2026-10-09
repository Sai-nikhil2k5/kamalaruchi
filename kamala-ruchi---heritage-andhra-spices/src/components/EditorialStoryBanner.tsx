import React from 'react';
import { ActivePage } from '../types';

interface EditorialStoryBannerProps {
  setActivePage: (page: ActivePage) => void;
}

export const EditorialStoryBanner: React.FC<EditorialStoryBannerProps> = ({ setActivePage }) => {
  return (
    <section className="relative w-full py-16 lg:py-20 bg-[#fbe6c1] overflow-hidden border-y border-[#ebd3aa]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="w-16 h-1 bg-[#af1820] mx-auto mb-4 rounded-full" />
        <span className="text-xs text-[#7b5737] uppercase tracking-[0.2em] font-bold block mb-2">
          THE ART OF HERITAGE SPICE-CRAFT
        </span>
        <h2 className="font-headline-lg text-3xl sm:text-4xl lg:text-[44px] text-[#241a04] mb-4">
          Real Ingredients. Real Stories.
        </h2>
        <p className="text-base sm:text-lg text-[#5b403e] leading-relaxed max-w-2xl mx-auto mb-8">
          Every batch is prepared with handpicked ingredients, following traditional recipes passed down through generations. No industrial pulverizers—only traditional stone pounding that preserves volatile essential oils and irreplaceable memories.
        </p>
        <button
          onClick={() => {
            setActivePage('our-story');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-[#af1820] hover:text-[#d23435] text-base font-bold group transition-colors cursor-pointer"
          type="button"
        >
          <span>Read Our Full Story</span>
          <span className="material-symbols-outlined transform group-hover:translate-x-1.5 transition-transform text-[20px]">
            arrow_forward
          </span>
        </button>
      </div>
    </section>
  );
};
