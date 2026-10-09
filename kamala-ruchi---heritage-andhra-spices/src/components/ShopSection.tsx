import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, CartItem } from '../types';
import { ProductCard } from './ProductCard';

interface ShopSectionProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product, weight: '100gm' | '250gm', quantity: number) => void;
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onSelectProduct: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  initialSearchQuery?: string;
  isStandaloneShopPage?: boolean;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQty,
  onSelectProduct,
  wishlistIds,
  onToggleWishlist,
  initialSearchQuery = '',
  isStandaloneShopPage = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'spice-powders', label: 'Spice Powders' },
    { id: 'premixes', label: 'Premixes' },
    { id: 'instant-pickles', label: 'Instant Pickles' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.teluguName && p.teluguName.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="shop-section" className="w-full py-12 lg:py-16 bg-[#fff8f2]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs text-[#af1820] uppercase tracking-widest font-bold block mb-2">
            TRADITIONAL RECIPES • PREMIUM INGREDIENTS • HOMEMADE WITH LOVE
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl lg:text-[42px] text-[#241a04]">
            Our Spice Powders
          </h2>
          <p className="text-sm sm:text-base text-[#5b403e] mt-2">
            Hand-roasted in small batches using sun-dried chillies, cold-pressed gingelly oil, and fragrant courtyard curry leaves.
          </p>
        </div>

        {/* Controls Bar: Category Tabs, Search & Sort */}
        <div
          id="shop-controls-bar"
          className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 p-4 bg-[#fff2df] rounded-xl shadow-xs border border-[#ebd3aa]"
        >
          {/* Category Filter Pills */}
          <div
            id="category-filter-group"
            className="flex flex-wrap items-center gap-2 w-full lg:w-auto"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`px-4 py-1.5 rounded-full text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#af1820] text-white shadow-xs'
                      : 'bg-[#ffebcb] text-[#241a04] hover:bg-[#f5e0bb]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Inputs */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5b403e] text-[18px]">
                search
              </span>
              <input
                id="spice-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search heirloom spices..."
                className="w-full pl-9 pr-4 py-2 bg-white text-[#241a04] placeholder-[#5b403e]/60 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#af1820] shadow-inner border border-[#ebd3aa]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5b403e] hover:text-[#af1820] text-xs cursor-pointer"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white text-[#241a04] py-2 pl-3.5 pr-8 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#af1820] shadow-inner border border-[#ebd3aa] cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#5b403e] pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-[#fff2df] rounded-xl border border-dashed border-[#ebd3aa] p-8">
            <span className="material-symbols-outlined text-4xl text-[#7b5737] mb-2">
              sentiment_dissatisfied
            </span>
            <h3 className="text-lg font-bold text-[#241a04] mb-1">No Spices Found</h3>
            <p className="text-sm text-[#5b403e] mb-4">
              We couldn&apos;t find any heirloom spices matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-[#af1820] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
              type="button"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Showcase Stack: 1 Column, Vertical Layout */}
        <div
          id="products-container"
          className="flex flex-col gap-4 lg:gap-6"
        >
          {filteredProducts.map((product, idx) => (
            <React.Fragment key={product.id}>
              <ProductCard
                product={product}
                cartItems={cartItems}
                onAddToCart={onAddToCart}
                onUpdateQty={onUpdateQty}
                onSelectProduct={onSelectProduct}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
              {/* Elegant divider between showcases (except after the last one) */}
              {idx < filteredProducts.length - 1 && (
                <div className="flex justify-center items-center py-2">
                  <span className="material-symbols-outlined text-[#ebd3aa] text-3xl">eco</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
