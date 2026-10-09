import React, { useState } from 'react';
import { RECIPES } from '../data/recipes';
import { Recipe, Product } from '../types';

interface RecipesViewProps {
  onSelectRecipeProduct: (productId: string) => void;
  products: Product[];
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  onSelectRecipeProduct,
  products,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(RECIPES[0]);

  return (
    <div id="recipes-view" className="w-full py-12 lg:py-16 bg-[#fff8f2]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-[#af1820] uppercase tracking-widest font-bold block mb-2">
            COURTYARD RECIPES &amp; KITCHEN SECRETS
          </span>
          <h1 className="font-headline-lg text-4xl sm:text-5xl text-[#241a04] mb-3">
            Amma&apos;s Secret Recipes
          </h1>
          <p className="text-base text-[#5b403e]">
            Time-tested Telugu comfort meals brought alive with stone-ground spice powders.
          </p>
        </div>

        {/* Recipe Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {RECIPES.map((recipe) => {
            const isSelected = selectedRecipe.id === recipe.id;
            return (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#af1820] text-white shadow-md'
                    : 'bg-[#ffebcb] text-[#241a04] hover:bg-[#f5e0bb]'
                }`}
                type="button"
              >
                {recipe.title}
              </button>
            );
          })}
        </div>

        {/* Active Recipe Display */}
        <div className="bg-[#fff2df] rounded-2xl shadow-lg border border-[#ebd3aa] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative h-72 lg:h-auto min-h-[340px] bg-[#ffebcb]">
              <img
                alt={selectedRecipe.title}
                src={selectedRecipe.image}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[11px] font-bold text-[#af1820] shadow-sm uppercase tracking-wider">
                Hero: {selectedRecipe.heroProduct}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#7b5737] mb-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    Prep: {selectedRecipe.prepTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">skillet</span>
                    Cook: {selectedRecipe.cookTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    {selectedRecipe.servings}
                  </span>
                </div>

                <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#241a04] mb-1">
                  {selectedRecipe.title}
                </h2>
                <span className="text-sm font-semibold text-[#7b5737] block mb-4">
                  {selectedRecipe.teluguTitle}
                </span>

                <p className="text-sm text-[#5b403e] leading-relaxed mb-6">
                  {selectedRecipe.description}
                </p>

                {/* Ingredients List */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7b5737] mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">grocery</span>
                    Ingredients:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#241a04]">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#af1820] font-bold">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step by step instructions */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7b5737] mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
                    Cooking Steps:
                  </h4>
                  <ol className="space-y-2 text-xs text-[#5b403e]">
                    {selectedRecipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#ffebcb] text-[#af1820] font-bold flex items-center justify-center shrink-0 border border-[#ebd3aa] text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Matriarch Tip Callout */}
                <div className="p-4 bg-[#ffebcb] rounded-xl border border-[#ebd3aa] mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#af1820] uppercase tracking-wider mb-1">
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    Amma&apos;s Secret Tip:
                  </div>
                  <p className="text-xs text-[#5b403e] italic leading-relaxed">
                    &ldquo;{selectedRecipe.matriarchTip}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#ebd3aa] flex items-center justify-between">
                <span className="text-xs font-bold text-[#7b5737]">
                  Need authentic {selectedRecipe.heroProduct}?
                </span>
                <button
                  onClick={() => onSelectRecipeProduct(selectedRecipe.heroProductId)}
                  className="bg-[#af1820] hover:bg-[#d23435] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs hover:shadow flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                  Order {selectedRecipe.heroProduct}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
