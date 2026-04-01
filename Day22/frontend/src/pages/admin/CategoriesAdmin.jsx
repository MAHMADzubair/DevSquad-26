import React, { useEffect, useState, useContext } from 'react';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../services/categoryService';
import { getProducts, updateProduct } from '../../services/productService';
import { AuthContext } from '../../context/AuthContext';
import { Trash2, Plus, ChevronDown, ChevronUp, Package, Eye, EyeOff } from 'lucide-react';

const CategoriesAdmin = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleToggleHome = async (cat) => {
    try {
      const data = await updateCategory(cat._id, { showOnHome: !cat.showOnHome });
      if (data.success) {
        setCategories(categories.map(c => c._id === cat._id ? { ...c, showOnHome: !cat.showOnHome } : c));
      }
    } catch (err) {
      alert('Error updating category visibility');
    }
  };

  const fetchAll = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        getCategories(),
        getProducts({ limit: 200 })
      ]);
      if (catRes.success) setCategories(catRes.categories);
      if (prodRes.success) setProducts(prodRes.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const data = await createCategory(formData);
      if (data.success) {
        setCategories([...categories, data.category]);
        setName(''); 
        setDescription('');
        setImage(null);
        setImagePreview(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products in this category will not be affected.')) return;
    try {
      const data = await deleteCategory(id);
      if (data.success) setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  // Get products currently in a category
  const getProductsInCategory = (catName) =>
    products.filter(p => p.category?.toLowerCase() === catName?.toLowerCase());

  // Get products NOT in this category
  const getProductsNotInCategory = (catName) =>
    products.filter(p => p.category?.toLowerCase() !== catName?.toLowerCase());

  const handleAddProduct = async (productId, catName) => {
    setUpdating(true);
    try {
      const data = await updateProduct(productId, { category: catName });
      if (data.success) {
        setProducts(products.map(p => p._id === productId ? { ...p, category: catName } : p));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating product category');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    setUpdating(true);
    try {
      const data = await updateProduct(productId, { category: '' });
      if (data.success) {
        setProducts(products.map(p => p._id === productId ? { ...p, category: '' } : p));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing product from category');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading categories...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-[var(--color-brand-primary)]">Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Create Category Form */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 col-span-1 h-fit">
          <h2 className="text-lg font-bold mb-4">Add Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-100 rounded-lg hover:border-gray-300 transition-colors bg-gray-50/50 group cursor-pointer relative overflow-hidden h-40">
              {imagePreview ? (
                <img src={imagePreview} alt="Category preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                  <Package className="mx-auto text-gray-300 mb-2" size={32} strokeWidth={1.5} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Image</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:border-black"
                placeholder="e.g. Green Tea"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:border-black min-h-[80px] resize-none"
                placeholder="Category description..."
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} /> Create Category
            </button>
          </form>
        </div>

        {/* Categories List with product management */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          {categories.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-10 text-center text-gray-400">
              No categories yet. Create your first one!
            </div>
          ) : (
            categories.map((cat) => {
              const inCat = getProductsInCategory(cat.name);
              const notInCat = getProductsNotInCategory(cat.name);
              const isExpanded = expandedCat === cat._id;

              return (
                <div key={cat._id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{cat.name}</p>
                        {cat.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Homepage Visibility Toggle (Superadmin only) */}
                      {user?.role === 'superadmin' && (
                        <button
                          onClick={() => handleToggleHome(cat)}
                          className={`p-1.5 rounded-full transition-colors ${cat.showOnHome ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                          title={cat.showOnHome ? 'Visible on Homepage' : 'Hidden from Homepage'}
                        >
                          {cat.showOnHome ? (
                            <Eye size={16} className="transition-transform group-hover:scale-110" />
                          ) : (
                            <EyeOff size={16} className="transition-transform group-hover:scale-110" />
                          )}
                        </button>
                      )}

                      {/* Product Count Badge */}
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {inCat.length} {inCat.length === 1 ? 'product' : 'products'}
                      </span>
                      <button
                        onClick={() => setExpandedCat(isExpanded ? null : cat._id)}
                        className="p-1.5 text-gray-400 hover:text-black transition-colors"
                        title={isExpanded ? 'Collapse' : 'Manage Products'}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded: Product Management */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Products IN category */}
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-green-600 mb-3">
                          ✓ In this Category
                        </h3>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {inCat.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No products assigned yet.</p>
                          ) : inCat.map(p => (
                            <div key={p._id} className="flex items-center justify-between gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <img src={p.images?.[0] || 'https://placehold.co/100?text=T'} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0 border border-green-100" />
                                <span className="text-xs font-medium text-gray-700 truncate">{p.name}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveProduct(p._id)}
                                disabled={updating}
                                className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0 disabled:opacity-50"
                                title="Remove from category"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Products NOT in category (available to add) */}
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                          + Available to Add
                        </h3>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {notInCat.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">All products are in this category.</p>
                          ) : notInCat.map(p => (
                            <div key={p._id} className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <img src={p.images?.[0] || 'https://placehold.co/100?text=T'} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0 border border-gray-200" />
                                <span className="text-xs font-medium text-gray-700 truncate">{p.name}</span>
                              </div>
                              <button
                                onClick={() => handleAddProduct(p._id, cat.name)}
                                disabled={updating}
                                className="text-green-600 hover:text-green-700 text-xs font-bold flex-shrink-0 disabled:opacity-50"
                                title="Add to this category"
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesAdmin;
