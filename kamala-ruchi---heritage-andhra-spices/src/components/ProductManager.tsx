import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts, adminSaveProduct, adminDeleteProduct, adminMigrateProducts } from '../lib/dbService';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Basic id generation if new
      const prodToSave = { ...editingProduct };
      if (!prodToSave.id) {
        prodToSave.id = prodToSave.name.toLowerCase().replace(/\s+/g, '-');
      }
      
      // Clean up comma-separated arrays before saving
      prodToSave.benefits = prodToSave.benefits?.map(s => s.trim()).filter(Boolean) || [];
      prodToSave.ingredients = prodToSave.ingredients?.map(s => s.trim()).filter(Boolean) || [];

      await adminSaveProduct(prodToSave);
      setEditingProduct(null);
      window.dispatchEvent(new Event('kamala-data-updated'));
      loadProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await adminDeleteProduct(id);
      window.dispatchEvent(new Event('kamala-data-updated'));
      loadProducts();
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
        <div>
          <h3 className="font-headline-sm text-xl text-[#241a04]">Product & Combo Manager</h3>
          <p className="text-xs text-[#5a431f]">Manage your store's inventory and bundles</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditingProduct({
              id: '', name: '', category: 'spice-powders', categoryLabel: '', basePrice: 0, largePrice: 0,
              badges: [], description: '', fullDescription: '', ingredients: [], benefits: [],
              heatLevel: 2, packagingNote: '', bestPairedWith: '', image: '', inStock: true, isCombo: false, comboIncludes: []
            })}
            className="px-4 py-2 bg-[#af1820] hover:bg-[#d23435] active:bg-[#8e1319] active:scale-95 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> Add New
          </button>
        </div>
      </div>

      {editingProduct && (
        <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
          <h4 className="text-lg font-bold mb-4">{editingProduct.id ? 'Edit' : 'Add'} Product</h4>
          <form onSubmit={handleSave} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Name</label>
                <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-2 border border-[#d6be95] rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Category Label</label>
                <input required type="text" value={editingProduct.categoryLabel} onChange={e => setEditingProduct({...editingProduct, categoryLabel: e.target.value})} className="w-full p-2 border border-[#d6be95] rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Base Price (100g)</label>
                <input required type="number" value={editingProduct.basePrice} onChange={e => setEditingProduct({...editingProduct, basePrice: Number(e.target.value)})} className="w-full p-2 border border-[#d6be95] rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Large Price (250g)</label>
                <input required type="number" value={editingProduct.largePrice} onChange={e => setEditingProduct({...editingProduct, largePrice: Number(e.target.value)})} className="w-full p-2 border border-[#d6be95] rounded-lg" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Image URL</label>
                <input required type="text" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full p-2 border border-[#d6be95] rounded-lg" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Short Description</label>
                <textarea required value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-2 border border-[#d6be95] rounded-lg" rows={2} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Health Benefits (comma separated)</label>
                <input type="text" value={editingProduct.benefits?.join(',') || ''} onChange={e => setEditingProduct({...editingProduct, benefits: e.target.value.split(',')})} placeholder="e.g. Rich in antioxidants, Supports digestion" className="w-full p-2 border border-[#d6be95] rounded-lg text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#5a431f] mb-1">Ingredients (comma separated)</label>
                <input type="text" value={editingProduct.ingredients?.join(',') || ''} onChange={e => setEditingProduct({...editingProduct, ingredients: e.target.value.split(',')})} placeholder="e.g. Red Chilli, Coriander, Cumin" className="w-full p-2 border border-[#d6be95] rounded-lg text-sm" />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingProduct.inStock ?? true} onChange={e => setEditingProduct({...editingProduct, inStock: e.target.checked})} className="w-4 h-4 accent-[#af1820]" />
                  <span className="text-xs font-bold text-[#241a04]">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingProduct.isCombo ?? false} onChange={e => setEditingProduct({...editingProduct, isCombo: e.target.checked})} className="w-4 h-4 accent-[#af1820]" />
                  <span className="text-xs font-bold text-[#241a04]">Is Combo Deal?</span>
                </label>
              </div>
            </div>

            {editingProduct.isCombo && (
              <div className="mt-4 p-4 border border-[#af1820]/30 bg-[#ffdad6]/20 rounded-xl">
                <h5 className="font-bold text-sm text-[#af1820] mb-2">Combo Products</h5>
                <p className="text-xs text-[#5a431f] mb-2">Select the products included in this combo:</p>
                <div className="flex flex-wrap gap-2">
                  {products.filter(p => !p.isCombo).map(p => (
                    <label key={p.id} className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-[#d6be95] text-xs cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={editingProduct.comboIncludes?.includes(p.id) || false}
                        onChange={e => {
                          const current = editingProduct.comboIncludes || [];
                          const next = e.target.checked ? [...current, p.id] : current.filter(id => id !== p.id);
                          setEditingProduct({...editingProduct, comboIncludes: next});
                        }}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button type="submit" className="px-5 py-2 bg-[#af1820] hover:bg-[#d23435] active:bg-[#8e1319] active:scale-95 text-white rounded-lg font-bold text-xs transition-all cursor-pointer shadow-sm">Save Product</button>
              <button type="button" onClick={() => setEditingProduct(null)} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:scale-95 text-gray-800 rounded-lg font-bold text-xs transition-all cursor-pointer">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-[#ebd3aa] rounded-xl overflow-hidden flex flex-col">
            <div className="h-32 overflow-hidden relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              {(p.inStock === false) && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">OUT OF STOCK</div>
              )}
              {p.isCombo && (
                <div className="absolute top-2 right-2 bg-[#af1820] text-white text-[10px] font-bold px-2 py-1 rounded">COMBO</div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-bold text-[#241a04] mb-1">{p.name}</div>
              <div className="text-xs text-[#5a431f] mb-3 flex-1 line-clamp-2">{p.description}</div>
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#ebd3aa]/40">
                <span className="font-bold text-[#af1820]">₹{p.basePrice} / ₹{p.largePrice}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingProduct(p)} className="p-1.5 bg-[#ffebcb] hover:bg-[#ebd3aa] active:scale-95 rounded-lg text-[#886a3d] hover:text-[#241a04] transition-all cursor-pointer"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-red-100 hover:bg-red-200 active:scale-95 rounded-lg text-red-500 hover:text-red-700 transition-all cursor-pointer"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
