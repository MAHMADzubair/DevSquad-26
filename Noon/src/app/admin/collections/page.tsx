"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Edit, LayoutGrid, Type, Image as ImageIcon, CheckCircle, Search, Monitor, Layers } from "lucide-react";
import Image from "next/image";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    showOnHome: true,
    order: 0,
    productIds: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collRes, prodRes] = await Promise.all([
        fetch(`/api/admin/collections`),
        fetch(`/api/admin/products?limit=100`)
      ]);
      const collData = await collRes.json();
      const prodData = await prodRes.json();
      setCollections(collData || []);
      setProducts(prodData.products || []);
    } catch {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      const method = draft.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/collections", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        setShowAddForm(false);
        setDraft({ id: "", title: "", description: "", imageUrl: "", showOnHome: true, order: 0, productIds: [] });
        fetchData();
      } else {
        alert("Failed to save collection");
      }
    } catch {
      alert("Error saving collection");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Products will stay in their categories but the collection will be removed.")) return;
    try {
      await fetch("/api/admin/collections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCollections(collections.filter(c => c.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const toggleProduct = (pid: string) => {
     setDraft(prev => {
        const productIds = prev.productIds.includes(pid) 
          ? prev.productIds.filter(id => id !== pid)
          : [...prev.productIds, pid];
        return { ...prev, productIds };
     });
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      {showAddForm ? (
        <form onSubmit={handleSave} className="flex flex-col gap-6 animate-fade-in pb-20">
           <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-white/10 sticky top-20 z-10 shadow-xl">
             <div className="flex items-center gap-4">
               <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white transition bg-white/5 rounded px-3 py-1.5 font-bold text-sm">← Back</button>
               <h2 className="text-xl font-bold text-white">{draft.id ? "Edit Collection" : "New Collection"}</h2>
             </div>
             <button type="submit" disabled={saving} className="bg-noon-yellow text-zinc-950 font-bold px-6 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg">
               {saving ? <Loader2 className="animate-spin" size={18} /> : "Save Collection"}
             </button>
           </div>

           <div className="flex flex-col lg:flex-row gap-6">
             <div className="flex-1 flex flex-col gap-6">
                {/* General Info */}
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-black text-lg mb-5 text-gray-200 flex items-center gap-2"><Type className="text-noon-yellow" size={18}/> Collection Details</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Title</label>
                      <input type="text" placeholder="e.g. Summer Essentials" required className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow transition" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Description</label>
                      <textarea placeholder="Tell more about this collection..." className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 min-h-[100px] focus:outline-none focus:border-noon-yellow transition" value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Banner & Placement */}
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                   <h3 className="font-black text-lg mb-5 text-gray-200 flex items-center gap-2"><Monitor className="text-noon-yellow" size={18}/> Placement & Banner</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Home Banner Image (URL)</label>
                        <input type="text" placeholder="https://..." className="w-full bg-zinc-900 border border-white/10 text-white rounded p-3 focus:outline-none focus:border-noon-yellow font-mono text-sm" value={draft.imageUrl} onChange={e => setDraft({...draft, imageUrl: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-4">
                        <label className="text-[11px] text-gray-400 block uppercase font-black tracking-wider">Visibility Options</label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" className="hidden" checked={draft.showOnHome} onChange={e => setDraft({...draft, showOnHome: e.target.checked})} />
                           <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${draft.showOnHome ? 'bg-noon-yellow border-noon-yellow' : 'border-white/20'}`}>
                             {draft.showOnHome && <span className="text-noon-black text-[10px] font-black italic">!</span>}
                           </div>
                           <span className="text-white text-sm font-medium">Show in Home Page Sections</span>
                        </label>
                        <div>
                           <label className="text-[11px] text-gray-400 mb-1 block uppercase font-black tracking-wider">Display Order</label>
                           <input type="number" className="w-20 bg-zinc-900 border border-white/10 text-white rounded p-2 focus:outline-none focus:border-noon-yellow" value={draft.order} onChange={e => setDraft({...draft, order: parseInt(e.target.value)})} />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Products Picker */}
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-sm">
                   <h3 className="font-black text-lg mb-4 text-gray-200 flex items-center gap-2"><Layers className="text-noon-yellow" size={18}/> Products in Collection</h3>
                   <p className="text-xs text-gray-500 mb-4 font-bold uppercase tracking-wider">Select products to include in this collection:</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {products.map(p => {
                        const isSelected = draft.productIds.includes(p.id);
                        const img = JSON.parse(p.images || "[]")[0];
                        return (
                          <div 
                            key={p.id} 
                            onClick={() => toggleProduct(p.id)}
                            className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition select-none ${isSelected ? 'border-noon-yellow bg-noon-yellow/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                          >
                             <div className="w-10 h-10 relative bg-white rounded overflow-hidden">
                               <Image src={img || "https://via.placeholder.com/100"} fill alt="" className="object-contain" />
                             </div>
                             <div className="flex-1">
                               <div className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-noon-yellow' : 'text-white'}`}>{p.name}</div>
                               <div className="text-[10px] text-gray-500 font-black">AED {p.price}</div>
                             </div>
                             {isSelected && <CheckCircle size={14} className="text-noon-yellow" />}
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
           </div>
        </form>
      ) : (
        /* List View */
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">Home Collections</h1>
               <p className="text-gray-400 text-sm">Control what collections and banners show on your landing page.</p>
             </div>
             <button 
               onClick={() => {
                 setDraft({ id: "", title: "", description: "", imageUrl: "", showOnHome: true, order: 0, productIds: [] });
                 setShowAddForm(true);
               }}
               className="bg-noon-yellow text-zinc-950 font-bold px-4 py-2 rounded-md hover:bg-yellow-400 transition shadow-lg flex items-center gap-2"
             >
               <Plus size={18} /> Add Collection
             </button>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                   <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 tracking-wider">
                      <tr>
                         <th className="px-6 py-4">Collection Title</th>
                         <th className="px-6 py-4 text-center">Home Status</th>
                         <th className="px-6 py-4 text-center">Products</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/10">
                      {loading ? (
                        <tr><td colSpan={4} className="text-center py-20"><Loader2 className="animate-spin inline-block mr-2" /> Loading...</td></tr>
                      ) : collections.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-20 text-gray-500 font-black italic">No homepage collections yet. Start by creating one!</td></tr>
                      ) : collections.map(c => (
                        <tr key={c.id} className="hover:bg-white/5 transition group">
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <div className="w-12 h-12 relative bg-zinc-900 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center">
                                 {c.imageUrl ? <Image src={c.imageUrl} fill alt="" className="object-cover" /> : <LayoutGrid size={20} className="text-gray-600" />}
                               </div>
                               <div>
                                 <div className="font-bold text-white mb-0.5">{c.title}</div>
                                 <div className="text-[10px] text-gray-500 uppercase font-black">Order: {c.order}</div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              {c.showOnHome ? (
                                <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">Active on Home</span>
                              ) : (
                                <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Hidden</span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="font-mono text-noon-yellow font-black">{c.products?.length || 0}</span>
                           </td>
                           <td className="px-6 py-4 text-right flex items-center justify-end gap-3 translate-x-2">
                             <button 
                               onClick={() => {
                                 setDraft({
                                   id: c.id,
                                   title: c.title,
                                   description: c.description || "",
                                   imageUrl: c.imageUrl || "",
                                   showOnHome: c.showOnHome,
                                   order: c.order,
                                   productIds: c.products.map((p:any) => p.id)
                                 });
                                 setShowAddForm(true);
                                 window.scrollTo({ top: 0, behavior: "smooth" });
                               }}
                               className="text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded"
                             >
                               <Edit size={16} />
                             </button>
                             <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500 transition p-1 hover:bg-red-500/5 rounded">
                               <Trash2 size={16} />
                             </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
