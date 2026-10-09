import React from 'react';
import { ActivePage } from '../types';

interface OurStoryViewProps {
  setActivePage: (page: ActivePage) => void;
}

export const OurStoryView: React.FC<OurStoryViewProps> = ({ setActivePage }) => {
  return (
    <div id="our-story-view" className="w-full py-12 lg:py-16 bg-[#fff8f2]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-[#af1820] uppercase tracking-widest font-bold block mb-2">
            THREE GENERATIONS OF SOULFUL COOKING
          </span>
          <h1 className="font-headline-lg text-4xl sm:text-5xl text-[#241a04] mb-4">
            The Legend of Kamala Garu
          </h1>
          <p className="text-base text-[#5b403e] leading-relaxed">
            Born in a sunlit courtyard in Srikakulam, Andhra Pradesh, where mornings began with the rhythmic thud of a stone pestle and the intoxicating scent of dry chillies hitting hot cast iron.
          </p>
        </div>

        {/* Story Visual & Matriarch Quote */}
        <div className="relative rounded-2xl overflow-hidden mb-16 shadow-xl border border-[#ebd3aa]">
          <img
            alt="Courtyard Spice Pounding in Andhra"
            className="w-full h-80 sm:h-96 object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH1lOtA5LQMhroWn-eB7L0-79h0ihX7l6bU2WkxE2HsGv6pj4n-pykSFtVVsNdGK5dxvBRu1xBVLuoSKta8OY8qCG-y79Q0IrvaZyx7Iz2gdqkwSH9kaUYreIH7U72v5nPhR1WwWQQJu66JHCPicKPpd2JPH0LCXajkaFQS6ouowx8UbCuX9DyXzHHinvcD1O39uJ6lNF4fHxu_CtpoVZTGmdRRuenLILazHU8LujcTiUXhJ4Vo7br"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3b2f16]/90 via-[#3b2f16]/40 to-transparent flex items-end p-6 sm:p-10">
            <div className="max-w-2xl text-white">
              <p className="font-headline-sm text-xl sm:text-2xl italic leading-snug mb-3">
                &ldquo;A meal prepared without hand-roasted spices is merely food. When the podi is ground on living granite, it becomes a blessing that sustains the soul.&rdquo;
              </p>
              <span className="text-xs sm:text-sm text-[#ffdcc2] uppercase tracking-wider font-semibold">
                — Smt. Kamala Devi (Amma), Srikakulam
              </span>
            </div>
          </div>
        </div>

        {/* Pillars of Tradition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-[#fff2df] rounded-xl border border-[#ebd3aa] shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#ffebcb] text-[#af1820] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">iron</span>
            </div>
            <h3 className="font-headline-sm text-xl text-[#241a04] mb-2">
              Cast Iron Roasting
            </h3>
            <p className="text-xs sm:text-sm text-[#5b403e] leading-relaxed">
              We never use industrial rotary ovens. Guntur chillies, toor dal, and cumin are stirred gently over low fire in heavy seasoned cast iron kadai, allowing every seed to release its natural volatile oils without charring.
            </p>
          </div>

          <div className="p-6 bg-[#fff2df] rounded-xl border border-[#ebd3aa] shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#ffebcb] text-[#af1820] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">hardware</span>
            </div>
            <h3 className="font-headline-sm text-xl text-[#241a04] mb-2">
              Granite Stone Pounding
            </h3>
            <p className="text-xs sm:text-sm text-[#5b403e] leading-relaxed">
              High-speed steel blade pulverizers heat spices up to 80°C, stripping away delicate aroma and therapeutic nutrients. Our blends are pounded on heavy stone rolu (pestle) preserving authentic texture and coarse crunch.
            </p>
          </div>

          <div className="p-6 bg-[#fff2df] rounded-xl border border-[#ebd3aa] shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#ffebcb] text-[#af1820] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <h3 className="font-headline-sm text-xl text-[#241a04] mb-2">
              Direct Farmer Heritage
            </h3>
            <p className="text-xs sm:text-sm text-[#5b403e] leading-relaxed">
              We partner directly with smallholder farming families across Andhra Pradesh—curry leaves from Godavari groves, heirloom turmeric from Duggirala, and Teja chillies from Guntur.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center p-8 bg-[#ffebcb] rounded-2xl border border-[#ebd3aa]">
          <h3 className="font-headline-sm text-2xl text-[#241a04] mb-2">
            Taste the Courtyard Difference
          </h3>
          <p className="text-sm text-[#5b403e] max-w-md mx-auto mb-6">
            Small batches hand-roasted weekly. Discover why thousands of Telugu households trust Kamala Ruchi for their daily comfort food.
          </p>
          <button
            onClick={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-[#af1820] hover:bg-[#d23435] text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            type="button"
          >
            Explore the Pantry
          </button>
        </div>
      </div>
    </div>
  );
};
