import React from 'react';

export const ServiceConciergeStrip: React.FC = () => {
  return (
    <section className="w-full bg-[#ffebcb] py-10 shadow-inner border-b border-[#ebd3aa]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* 1. Home Delivery */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-xs border border-[#ebd3aa]/60">
            <div className="w-12 h-12 rounded-full bg-[#fbe6c1] flex items-center justify-center text-[#af1820] shrink-0">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241a04]">Home Delivery</h4>
              <p className="text-xs text-[#5b403e]">Up to 3 KM Direct Courier</p>
            </div>
          </div>

          {/* 2. Order on WhatsApp */}
          <a
            className="flex items-center gap-4 p-4 bg-white hover:bg-[#fff2df] transition-colors rounded-xl shadow-xs border border-[#ebd3aa]/60 group cursor-pointer"
            href="https://wa.me/917396311063?text=Namaste%20Kamala%20Ruchi,%20I%20would%20like%20to%20place%20an%20order%20for%20heirloom%20spice%20powders."
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="w-12 h-12 rounded-full bg-[#fbe6c1] group-hover:bg-[#af1820] group-hover:text-white transition-colors flex items-center justify-center text-[#af1820] shrink-0">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241a04]">Order on WhatsApp</h4>
              <p className="text-xs text-[#af1820] font-bold">7396311063</p>
            </div>
          </a>

          {/* 3. Made with Love */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-xs border border-[#ebd3aa]/60">
            <div className="w-12 h-12 rounded-full bg-[#fbe6c1] flex items-center justify-center text-[#af1820] shrink-0">
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241a04]">Made with Love</h4>
              <p className="text-xs text-[#5b403e]">in Every Single Packet</p>
            </div>
          </div>

          {/* 4. Supporting Local Farmers */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-xs border border-[#ebd3aa]/60">
            <div className="w-12 h-12 rounded-full bg-[#fbe6c1] flex items-center justify-center text-[#af1820] shrink-0">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241a04]">Supporting</h4>
              <p className="text-xs text-[#5b403e]">Local Andhra Farmers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
