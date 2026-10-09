import React from 'react';

export const BotanicalDivider: React.FC = () => {
  return (
    <div className="w-full bg-[#fff8f2] py-3.5 flex items-center justify-center overflow-hidden border-b border-[#ebd3aa]/40">
      <div className="flex items-center gap-4 text-[#7b5737] text-center px-4">
        <span className="material-symbols-outlined text-[#af1820] text-sm hidden sm:inline">
          local_florist
        </span>
        <span className="text-[12px] uppercase tracking-[0.25em] text-[#241a04] font-bold">
          ✦ A TASTE OF TRADITION IN EVERY SPOON ✦
        </span>
        <span className="material-symbols-outlined text-[#af1820] text-sm hidden sm:inline">
          local_florist
        </span>
      </div>
    </div>
  );
};
