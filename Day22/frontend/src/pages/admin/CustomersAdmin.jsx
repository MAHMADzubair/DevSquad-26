import React, { useEffect, useState } from 'react';
import { getCustomers, addCustomer, blockUser } from '../../services/adminService';
import { User as UserIcon, Plus, X, Shield, ShieldAlert, Search } from 'lucide-react';

const CustomersAdmin = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers(1, 100);
      if (data.success) {
        setCustomers(data.customers);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      const data = await blockUser(id, !isBlocked);
      if (data.success) {
        setCustomers(customers.map(c => c._id === id ? { ...c, isBlocked: !isBlocked } : c));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating customer');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSubmitting(true);
    try {
      const data = await addCustomer({ name, email, password });
      if (data.success) {
        setCustomers([data.customer, ...customers]);
        setTotal(prev => prev + 1);
        setIsModalOpen(false);
        setName(''); setEmail(''); setPassword('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding customer');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-gray-500">Loading customers...</div>;

  return (
    <div className="p-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-primary)]">Customer Management</h1>
          <p className="text-sm text-gray-400 mt-1">{total} total customers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-[var(--color-brand-primary)]">{total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Active</p>
          <p className="text-2xl font-bold text-green-500">{customers.filter(c => !c.isBlocked).length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Blocked</p>
          <p className="text-2xl font-bold text-red-500">{customers.filter(c => c.isBlocked).length}</p>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Customer</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Joined</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-400">
                {search ? 'No customers match your search.' : 'No customers yet. Add your first one!'}
              </td></tr>
            ) : filtered.map((c) => (
              <tr key={c._id} className={`hover:bg-gray-50 ${c.isBlocked ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-gray-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{c.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${c.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {c.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleBlockToggle(c._id, c.isBlocked)}
                    className={`flex items-center gap-1.5 text-[11px] font-bold uppercase px-3 py-1.5 rounded transition-colors ml-auto ${c.isBlocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  >
                    {c.isBlocked ? <Shield size={13} /> : <ShieldAlert size={13} />}
                    {c.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[var(--color-brand-primary)]">Add New Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Email Address *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Initial Password *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black" placeholder="Min. 6 characters" />
              </div>
              <p className="text-xs text-gray-400">The customer can change their password after logging in.</p>
              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-black">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-[var(--color-brand-primary)] text-white px-6 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-[#383838] transition-colors disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersAdmin;
