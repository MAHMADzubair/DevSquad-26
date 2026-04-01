import React, { useEffect, useState, useRef } from 'react';
import { getProducts, deleteProduct, createProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { Trash2, Plus, X, ImagePlus } from 'lucide-react';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef();

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (idx) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const resetForm = () => {
    setName(''); setDescription(''); setPrice(''); setStock('');
    setCategory(''); setImageFiles([]); setImagePreviews([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const data = await deleteProduct(id);
      if (data.success) setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !category) return alert('Name, price, and category are required');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('description', description);
      fd.append('price', price);
      fd.append('stock', stock || 0);
      fd.append('category', category);
      imageFiles.forEach(f => fd.append('images', f));

      const data = await createProduct(fd);
      if (data.success) {
        setProducts([data.product, ...products]);
        setIsModalOpen(false);
        resetForm();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading products...</div>;

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-brand-primary)]">Product Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Product</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Category</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Price</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Stock</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={p.images?.[0] || 'https://placehold.co/100?text=No+Img'} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{p.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">€{Number(p.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.stock} units</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">No products found. Add your first product!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[var(--color-brand-primary)]">Add New Product</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 overflow-y-auto">
              {/* Image Upload */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-2">Product Images</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-black transition-colors"
                >
                  {imagePreviews.length > 0 ? (
                    <div className="flex gap-2 flex-wrap justify-center">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative">
                          <img src={src} alt="" className="w-20 h-20 object-cover rounded border border-gray-200" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >×</button>
                        </div>
                      ))}
                      <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
                        <Plus size={16} />
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <ImagePlus size={32} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload product images</p>
                      <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP up to 5 images</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black" placeholder="e.g. Earl Grey Classic" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Base Price (€) *</label>
                  <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Initial Stock</label>
                  <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black">
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                  {categories.length === 0 && <option disabled>No categories yet — create one first!</option>}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black min-h-[80px] resize-none" placeholder="Describe the product..." />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-black">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-[var(--color-brand-primary)] text-white px-6 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-[#383838] transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
