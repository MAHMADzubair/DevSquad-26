"use client";

import { useEffect, useState } from "react";
import { Loader2, User as UserIcon, ShieldAlert } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">Users</h1>
           <p className="text-gray-400 text-sm">View and manage all registered users.</p>
         </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
               <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 tracking-wider">
                  <tr>
                     <th className="px-6 py-4">Name</th>
                     <th className="px-6 py-4">Email</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Joined</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/10">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-gray-400" />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center font-bold text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : users.map(user => (
                       <tr key={user.id} className="hover:bg-white/5 transition">
                         <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                           {user.role === "ADMIN" ? <ShieldAlert size={16} className="text-noon-yellow"/> : <UserIcon size={16} className="text-gray-500" />}
                           {user.name}
                         </td>
                         <td className="px-6 py-4 text-gray-400">{user.email}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-noon-yellow/20 text-noon-yellow' : 'bg-white/10 text-gray-400'}`}>
                              {user.role}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                         </td>
                       </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
