import api from './api';

export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
};
export const createProduct = async (productData) => {
  const isFormData = productData instanceof FormData;
  const { data } = await api.post('/admin/products', productData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return data;
};

export const updateProduct = async (id, productData) => {
  const isFormData = productData instanceof FormData;
  const { data } = await api.put(`/admin/products/${id}`, productData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return data;
};
