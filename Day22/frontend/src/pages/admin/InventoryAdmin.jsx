import React, { useEffect, useState } from 'react';
import { getProducts, updateProduct } from '../../services/productService';
import { Save } from 'lucide-react';

const InventoryAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState({});
  const [updating, setUpdating] = useState(null);

  const fetchInventory = async () => {
    try {
      const data = await getProducts({ limit: 100 });
      if (data.success) {
        setProducts(data.products);
        // Initialize local edit state
        const initialEdits = {};
        data.products.forEach(p => initialEdits[p._id] = p.stock);
        setStockEdits(initialEdits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id, newStock) => {
    setStockEdits(prev => ({ ...prev, [id]: Number(newStock) }));
  };

  const handleSaveStock = async (id) => {
    try {
      setUpdating(id);
      const newStock = stockEdits[id];
      const data = await updateProduct(id, { stock: newStock });
      if (data.success) {
        setProducts(products.map(p => p._id === id ? { ...p, stock: newStock } : p));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating stock');
      // Revert edit
      const product = products.find(p => p._id === id);
      setStockEdits(prev => ({ ...prev, [id]: product?.stock || 0 }));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading inventory...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-[var(--color-brand-primary)]">Inventory Management</h1>
      
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Product</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">SKU/ID</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 w-48">Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => {
              const isEdited = stockEdits[p._id] !== p.stock;
              return (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden relative border border-gray-200">
                      <img src={p.images?.[0] || 'https://placehold.co/100?text=No+Img'} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{p._id.substring(18)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={stockEdits[p._id] ?? p.stock}
                        onChange={(e) => handleStockChange(p._id, e.target.value)}
                        className={`w-20 p-1.5 text-sm border rounded focus:outline-none focus:border-black ${isEdited ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}
                        min="0"
                      />
                      {isEdited && (
                        <button 
                          onClick={() => handleSaveStock(p._id)}
                          disabled={updating === p._id}
                          className="p-1.5 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 transition-colors"
                          title="Save Changes"
                        >
                          <Save size={14} />
                        </button>
                      )}
                    </div>
                    {p.stock <= 10 && <span className="text-[10px] text-red-500 font-bold uppercase mt-1 block">Low Stock</span>}
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan="3" className="text-center py-6 text-gray-500">No products found in inventory.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryAdmin;
