"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Trash2, Edit, Tag, FolderTree, Type } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Revised state for Shopify-style UI
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState({
    id: "",
    name: "",
    icon: "",
    color: "",
    parentId: ""
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories`);
      if (res.ok) {
         const data = await res.json();
         setCategories(data || []);
      }
    } catch {
      console.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Product adding logic preserved
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "100",
    images: "",
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !selectedCategoryId) {
      alert("Please fill in all required fields (Name, Price, and Category)");
      return;
    }
    setAddingProduct(true);
    try {
      const payload = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        categoryId: selectedCategoryId,
        stock: parseInt(newProduct.stock),
        images: newProduct.images ? newProduct.images.split(",").map(u => u.trim()).filter(Boolean) : [],
      };
      
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowAddProduct(false);
        setNewProduct({ name: "", price: "", description: "", stock: "100", images: "" });
        alert("Product added successfully!");
      } else {
        alert("Failed to create product");
      }
    } catch(err) {
      alert("Error creating product");
    } finally {
      setAddingProduct(false);
    }
  };

  const [uploadingProductImage, setUploadingProductImage] = useState(false);

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadingProductImage(true);
    const formData = new FormData();
    for (const file of Array.from(e.target.files)) {
      formData.append("files", file);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { urls } = await res.json();
        const currentImages = newProduct.images ? newProduct.images.split(",").map(u => u.trim()).filter(Boolean) : [];
        setNewProduct({ ...newProduct, images: [...currentImages, ...urls].join(", ") });
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Error uploading");
    } finally {
      setUploadingProductImage(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryDraft.name.trim()) return;
    setAdding(true);
    try {
      const method = categoryDraft.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryDraft),
      });
      if (res.ok) {
        setShowAddForm(false);
        setCategoryDraft({ id: "", name: "", icon: "", color: "", parentId: "" });
        fetchCategories();
      } else {
        alert("Failed to save category");
      }
    } catch {
      alert("Error saving category");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All child categories and products may be affected.")) return;
    try {
      await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCategories(categories.filter(c => c.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      {showAddForm ? (
        /* Edit/Create Category Form View */
        <form onSubmit={handleSaveCategory} className="flex flex-col gap-6 animate-fade-in">
           <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-white/10 sticky top-20 z-10 shadow-xl">
             <div className="flex items-center gap-4">
               <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white transition bg-white/5 rounded px-3 py-1.5 font-bold text-sm">← Back</button>
               <h2 className="text-xl font-bold text-white">{categoryDraft.id ? "Edit Category" : "Add Category"}</h2>
             </div>
             <button type="submit" disabled={adding} className="bg-noon-yellow text-zinc-950 font-bold px-6 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg hover:shadow-noon-yellow/20">
               {adding ? <Loader2 className="animate-spin" size={18} /> : "Save Category"}
             </button>
           </div>
           
           <div className="flex flex-col lg:flex-row gap-6">
             {/* Left Column */}
             <div className="flex-1 flex flex-col gap-6">
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-black text-lg mb-5 text-gray-200 flex items-center gap-2"><Type size={18} className="text-noon-yellow" /> Basic Information</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Category Title</label>
                      <input type="text" placeholder="e.g. Electronics, Home & Kitchen" required className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition placeholder-gray-600 font-medium" value={categoryDraft.name} onChange={e => setCategoryDraft({...categoryDraft, name: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                    <h3 className="font-black text-lg mb-5 text-gray-200 flex items-center gap-2"><Tag size={18} className="text-noon-yellow" /> Appearance</h3>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Icon (Emoji or URL)</label>
                        <input type="text" placeholder="e.g. 📱, 👗" className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition placeholder-gray-600" value={categoryDraft.icon} onChange={e => setCategoryDraft({...categoryDraft, icon: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Accent Color (Hex)</label>
                        <div className="flex gap-2">
                           <input type="color" className="w-12 h-12 bg-transparent border-0 cursor-pointer p-0" value={categoryDraft.color || "#000000"} onChange={e => setCategoryDraft({...categoryDraft, color: e.target.value})} />
                           <input type="text" placeholder="#000000" className="flex-1 bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition font-mono" value={categoryDraft.color} onChange={e => setCategoryDraft({...categoryDraft, color: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                    <h3 className="font-black text-lg mb-5 text-gray-200 flex items-center gap-2"><FolderTree size={18} className="text-noon-yellow" /> Hierarchy</h3>
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Parent Category</label>
                      <select className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition cursor-pointer font-medium" value={categoryDraft.parentId} onChange={e => setCategoryDraft({...categoryDraft, parentId: e.target.value})}>
                        <option value="">-- No Parent (Root Level) --</option>
                        {categories.filter(c => c.id !== categoryDraft.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <p className="text-[10px] text-gray-500 mt-2 italic">Select a parent if this is a sub-category.</p>
                    </div>
                  </div>
                </div>
             </div>
             
             {/* Right Sidebar */}
             <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-black text-lg mb-4 text-gray-200">Summary</h3>
                  <div className="bg-zinc-900 p-4 rounded-lg flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 flex items-center justify-center text-4xl rounded-2xl bg-white/5 border border-white/10" style={{ color: categoryDraft.color }}>
                      {categoryDraft.icon || "?"}
                    </div>
                    <div>
                       <div className="font-black text-white">{categoryDraft.name || "Untilted Category"}</div>
                       <div className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">{categoryDraft.parentId ? "Sub-category" : "Main Category"}</div>
                    </div>
                  </div>
                </div>
             </div>
           </div>
        </form>
      ) : (
        /* Categories List View */
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">Categories</h1>
               <p className="text-gray-400 text-sm">Organize your shop catalogue with ease.</p>
             </div>
             <button 
               onClick={() => {
                 setCategoryDraft({ id: "", name: "", icon: "", color: "", parentId: "" });
                 setShowAddForm(true);
               }}
               className="bg-noon-yellow text-zinc-950 font-bold px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg"
             >
               <Plus size={18} /> Add Category
             </button>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                   <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 tracking-wider">
                      <tr>
                         <th className="px-6 py-4">Title</th>
                         <th className="px-6 py-4">Hierarchy</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/10">
                      {loading ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center">
                            <Loader2 className="animate-spin mx-auto text-gray-400" />
                          </td>
                        </tr>
                      ) : categories.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center font-bold text-gray-500">
                            No categories found. Start by adding your first category!
                          </td>
                        </tr>
                      ) : categories.map(category => (
                           <tr key={category.id} className="hover:bg-white/5 transition group">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:border-noon-yellow transition" style={{ color: category.color }}>
                                    {category.icon || "🏷️"}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white mb-0.5">{category.name}</div>
                                    <div className="text-[10px] text-gray-500 font-mono">{category.slug}</div>
                                  </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                {category.parentId ? (
                                  <span className="text-xs text-gray-400 flex items-center gap-2">
                                    <FolderTree size={12} className="text-gray-500" /> 
                                    {categories.find(c => c.id === category.parentId)?.name || "Sub-category"}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-black uppercase tracking-tighter text-noon-yellow/60">Main Level</span>
                                )}
                             </td>
                             <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                                <button 
                                  onClick={() => {
                                    setSelectedCategoryId(category.id);
                                    setShowAddProduct(true);
                                  }} 
                                  className="text-noon-yellow hover:text-yellow-400 text-[11px] font-black uppercase tracking-tighter transition whitespace-nowrap hidden md:block border border-noon-yellow/20 px-2 py-1 rounded hover:bg-noon-yellow/10"
                                >
                                  + NEW Product
                                </button>
                                <button 
                                  onClick={() => {
                                    setCategoryDraft({
                                      id: category.id,
                                      name: category.name,
                                      icon: category.icon || "",
                                      color: category.color || "",
                                      parentId: category.parentId || ""
                                    });
                                    setShowAddForm(true);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded"
                                >
                                  <Edit size={16} />
                                </button>
                                <button onClick={(() => handleDelete(category.id))} className="text-gray-400 hover:text-red-500 transition p-1 hover:bg-red-500/5 rounded"><Trash2 size={16} /></button>
                             </td>
                           </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      )}

      {/* Product Adding Modal preserved */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
           <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 w-full max-w-2xl relative shadow-2xl">
              <button onClick={() => setShowAddProduct(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">✕</button>
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider border-l-4 border-noon-yellow pl-3">Add Product to {categories.find(c => c.id === selectedCategoryId)?.name || "Category"}</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Product Name" required className="bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                 <input type="number" step="0.01" placeholder="Price (AED)" required className="bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                 <input type="number" placeholder="Stock" required className="bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                 <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Product Images</label>
                    <div className="flex gap-2 items-center">
                       <label className="w-12 h-12 bg-white/5 border-2 border-dashed border-white/10 rounded flex items-center justify-center cursor-pointer hover:border-noon-yellow text-gray-500 hover:text-noon-yellow transition shrink-0">
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleProductImageUpload} />
                          {uploadingProductImage ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                       </label>
                       <input type="text" placeholder="Image URLs (comma separated)" className="flex-1 bg-zinc-900 border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-noon-yellow transition" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} />
                    </div>
                    {newProduct.images && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {newProduct.images.split(",").map((url, i) => (
                          <div key={i} className="w-10 h-10 border border-white/10 rounded relative bg-white/5 overflow-hidden">
                             <Image src={url.trim()} alt="" fill className="object-contain" />
                             <button type="button" onClick={() => {
                               const urls = newProduct.images.split(",").map(u => u.trim());
                               urls.splice(i, 1);
                               setNewProduct({...newProduct, images: urls.join(", ")});
                             }} className="absolute top-0 right-0 bg-red-500 text-white w-3 h-3 flex items-center justify-center text-[8px] rounded-bl">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                 <textarea placeholder="Description" required className="bg-zinc-900 border border-white/10 text-white rounded p-3 md:col-span-2 min-h-24 focus:outline-none focus:border-noon-yellow transition" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                 <div className="md:col-span-2 mt-4 flex justify-end gap-3 font-bold">
                   <button type="button" onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-white px-4 py-2 uppercase text-sm tracking-tighter">Cancel</button>
                   <button type="submit" disabled={addingProduct} className="bg-noon-yellow text-zinc-950 px-8 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2 uppercase text-sm tracking-tighter">
                     {addingProduct ? <Loader2 className="animate-spin" size={18} /> : "Save Product"}
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

