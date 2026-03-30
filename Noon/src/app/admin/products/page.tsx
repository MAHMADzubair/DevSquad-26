"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    categoryId: "",
    stock: "100",
    images: "",
  });

  const fetchProducts = async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?search=${q}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/admin/categories`);
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setProducts(products.filter(p => p.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) return;
    setAddingProduct(true);
    try {
      const payload: any = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        categoryId: newProduct.categoryId,
        stock: parseInt(newProduct.stock),
        images: newProduct.images ? [newProduct.images] : [],
      };
      
      if (newProduct.id) payload.id = newProduct.id;
      
      const res = await fetch("/api/admin/products", {
        method: newProduct.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowAddForm(false);
        setNewProduct({ id: "", name: "", price: "", description: "", categoryId: "", stock: "100", images: "" });
        fetchProducts();
      } else {
        alert("Failed to save product");
      }
    } catch(err) {
      alert("Error saving product");
    } finally {
      setAddingProduct(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      {showAddForm ? (
        <form onSubmit={handleSaveProduct} className="flex flex-col gap-6 animate-fade-in">
           <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-white/10 sticky top-20 z-10 shadow-xl">
             <div className="flex items-center gap-4">
               <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white transition bg-white/5 rounded px-3 py-1.5 font-bold text-sm">← Back</button>
               <h2 className="text-xl font-bold text-white">{newProduct.id ? "Edit Product" : "Add Product"}</h2>
             </div>
             <button type="submit" disabled={addingProduct} className="bg-noon-yellow text-zinc-950 font-bold px-6 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg hover:shadow-noon-yellow/20">
               {addingProduct ? <Loader2 className="animate-spin" size={18} /> : "Save"}
             </button>
           </div>
           
           <div className="flex flex-col lg:flex-row gap-6">
             {/* Left Column */}
             <div className="flex-1 flex flex-col gap-6">
                {/* General Info */}
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-black text-lg mb-5 text-gray-200">General Info</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Product Title</label>
                      <input type="text" placeholder="e.g. iPhone 15 Pro Max" required className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition placeholder-gray-600 font-medium" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Description</label>
                      <textarea placeholder="Write a detailed description..." required className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 min-h-32 focus:outline-none focus:border-noon-yellow transition placeholder-gray-600 font-medium resize-y" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-black text-lg mb-5 text-gray-200">Media</h3>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Image Link URL</label>
                    <input type="url" placeholder="https://example.com/image.jpg" className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition placeholder-gray-600 font-mono text-sm" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} />
                  </div>
                </div>
                
                {/* Pricing & Inventory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                    <h3 className="font-black text-lg mb-5 text-gray-200">Pricing</h3>
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Price (AED)</label>
                      <input type="number" step="0.01" placeholder="0.00" required className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow text-xl font-bold font-mono transition placeholder-gray-600" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                    <h3 className="font-black text-lg mb-5 text-gray-200">Inventory</h3>
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Stock Quantity</label>
                      <input type="number" placeholder="10" required className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow text-xl font-bold font-mono transition placeholder-gray-600" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                    </div>
                  </div>
                </div>
             </div>
             
             {/* Right Column (Sidebar) */}
             <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-black text-lg mb-5 text-gray-200">Organization</h3>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Category</label>
                    <select required className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition cursor-pointer font-medium" value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}>
                      <option value="" disabled>-- Select Category --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-black text-lg mb-5 text-gray-200">Status</h3>
                  <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-md border border-white/5">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    <span className="font-bold text-white text-sm">Active & Listed</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium leading-relaxed">This product will be visible immediately upon saving.</p>
                </div>
             </div>
           </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">Products</h1>
               <p className="text-gray-400 text-sm">Manage inventory, prices, and catalog setup.</p>
             </div>
             <button 
               onClick={() => {
                 setNewProduct({ id: "", name: "", price: "", description: "", categoryId: "", stock: "100", images: "" });
                 setShowAddForm(true);
               }}
               className="bg-noon-yellow text-zinc-950 font-bold px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg"
             >
               <Plus size={18} /> Add Product
             </button>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 flex gap-4 items-center shadow-sm">
             <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-noon-yellow focus:ring-1 focus:ring-noon-yellow text-sm font-medium" 
                />
             </form>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                   <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 tracking-wider">
                      <tr>
                         <th className="px-6 py-4">Product</th>
                         <th className="px-6 py-4">Price / Stock</th>
                         <th className="px-6 py-4">Category</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/10">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <Loader2 className="animate-spin mx-auto text-gray-400" />
                          </td>
                        </tr>
                      ) : products.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center font-bold text-gray-500">
                            No products found.
                          </td>
                        </tr>
                      ) : products.map(product => {
                         const images = JSON.parse(product.images || "[]");
                         return (
                           <tr key={product.id} className="hover:bg-white/5 transition">
                             <td className="px-6 py-4 flex items-center gap-4">
                               <div className="w-12 h-12 relative bg-white rounded border border-white/20 shrink-0">
                                   <Image src={images[0] || "https://via.placeholder.com/100"} fill alt="" className="object-contain p-1" />
                               </div>
                               <div className="font-medium text-white line-clamp-2 max-w-md">{product.name}</div>
                             </td>
                             <td className="px-6 py-4 font-mono">
                               <div className="text-white font-black">AED {product.price.toLocaleString()}</div>
                               <div className="text-xs text-gray-500">{product.stock} in stock</div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold uppercase">{product.category.name}</span>
                             </td>
                             <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                                <button 
                                  onClick={() => {
                                     const parsedImages = JSON.parse(product.images || "[]");
                                     setNewProduct({
                                        id: product.id,
                                        name: product.name,
                                        price: String(product.price),
                                        description: product.description,
                                        categoryId: product.categoryId,
                                        stock: String(product.stock),
                                        images: parsedImages[0] || "",
                                     });
                                     setShowAddForm(true);
                                     window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="text-gray-400 hover:text-white transition"
                                >
                                  <Edit size={16} />
                                </button>
                                <button onClick={(() => handleDelete(product.id))} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                             </td>
                           </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
