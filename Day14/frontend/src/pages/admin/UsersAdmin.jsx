import React, { useEffect, useState } from 'react';
import { getUsers, blockUser, updateUserRole } from '../../services/adminService';
import { Shield, ShieldAlert, User as UserIcon, ShieldCheck } from 'lucide-react';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      const data = await blockUser(id, !isBlocked);
      if (data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const data = await updateUserRole(id, newRole);
      if (data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user role');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-[var(--color-brand-primary)]">User Management</h1>
      
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Role</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserIcon size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  {user.role === 'superadmin' ? (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600">
                      superadmin
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer outline-none ${user.role === 'admin' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.isBlocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-500 font-semibold">Active</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.role !== 'superadmin' && (
                    <button 
                      onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                      className={`flex items-center gap-1 text-[11px] font-bold uppercase px-3 py-1.5 rounded transition-colors ${user.isBlocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                    >
                      {user.isBlocked ? <Shield size={14} /> : <ShieldAlert size={14} />}
                      {user.isBlocked ? 'UNBLOCK' : 'BLOCK'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersAdmin;
