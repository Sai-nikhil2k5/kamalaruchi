import React from 'react';

export const BrandValuesStrip: React.FC = () => {
  const values = [
    {
      icon: 'skillet',
      title: 'Freshly Prepared',
      subtitle: 'Ground weekly in artisanal micro-batches',
    },
    {
      icon: 'eco',
      title: 'Quality Ingredients',
      subtitle: '100% handpicked native grains & chillies',
    },
    {
      icon: 'temple_hindu',
      title: 'Authentic Taste',
      subtitle: 'Andhra heirloom grandmother recipes',
    },
    {
      icon: 'health_and_safety',
      title: 'No Preservatives',
      subtitle: 'Zero chemicals, dyes, or MSG added',
    },
  ];

  return (
    <section className="w-full bg-[#ffebcb] py-6 shadow-inner border-y border-[#ebd3aa]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((v, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3.5 rounded-lg bg-white shadow-xs border border-[#ebd3aa]/60 hover:border-[#af1820]/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-[#f5e0bb] flex items-center justify-center text-[#af1820] shrink-0">
                <span className="material-symbols-outlined text-2xl">{v.icon}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#241a04]">{v.title}</h4>
                <p className="text-xs text-[#5b403e] leading-snug">{v.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
