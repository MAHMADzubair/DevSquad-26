import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../services/adminService';
import { Users, ShoppingBag, Euro, Box } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAnalytics();
        if (data.success) setStats(data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-[var(--color-brand-primary)]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Revenue" value={`€${stats?.revenue?.toFixed(2) || 0}`} icon={Euro} color="bg-green-500" />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={Box} color="bg-purple-500" />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="bg-orange-500" />
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Welcome to Admin Panel</h2>
        <p className="text-gray-600">Use the sidebar to manage products, users, and orders.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
