import React from 'react';

export const TopNotificationBar: React.FC = () => {
  return (
    <div
      id="top-notification-bar"
      className="w-full bg-[#fbe6c1] border-b border-[#ebd3aa] py-2 px-4 text-center overflow-hidden"
    >
      <p className="text-[12px] sm:text-[13px] text-[#7b5737] tracking-widest uppercase font-semibold flex items-center justify-center gap-2 flex-wrap">
        <span>✦ Fresh batches roasted daily</span>
        <span className="hidden sm:inline">•</span>
        <span>Free courier tasting spoon on orders over ₹499</span>
        <span className="hidden sm:inline">•</span>
        <span>Handcrafted in Andhra ✦</span>
      </p>
    </div>
  );
};
