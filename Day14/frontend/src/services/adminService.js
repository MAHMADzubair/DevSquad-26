import api from './api';

export const getAnalytics = async () => {
  const { data } = await api.get('/admin/analytics');
  return data;
};

export const getUsers = async (page = 1, limit = 20) => {
  const { data } = await api.get('/admin/users', { params: { page, limit } });
  return data;
};

export const blockUser = async (id, shouldBlock) => {
  const path = shouldBlock ? `/admin/users/${id}/block` : `/admin/users/${id}/unblock`;
  const { data } = await api.put(path);
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data;
};

export const getAdminOrders = async () => {
  const { data } = await api.get('/admin/orders');
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status });
  return data;
};

export const getCustomers = async (page = 1, limit = 20) => {
  const { data } = await api.get('/admin/customers', { params: { page, limit } });
  return data;
};

export const addCustomer = async (customerData) => {
  const { data } = await api.post('/admin/customers', customerData);
  return data;
};
