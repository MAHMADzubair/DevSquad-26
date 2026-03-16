import api from './api';

export const getMyOrders = async () => {
  const { data } = await api.get('/orders/my');
  return data;
};

export const placeOrder = async (shippingAddress) => {
  const { data } = await api.post('/orders', { shippingAddress });
  return data;
};

// Admin routes
export const getAllOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};
