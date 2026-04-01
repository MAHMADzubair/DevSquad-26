import api from './api';

export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const addToCart = async (productId, variantId, quantity) => {
  const { data } = await api.post('/cart', { productId, variantId, quantity });
  return data;
};

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await api.put(`/cart/${itemId}`, { quantity });
  return data;
};

export const removeFromCart = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data;
};
