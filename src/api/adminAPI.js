import axiosInstance from './axios';

const adminAPI = {
  getProducts: async () => {
    try {
      const response = await axiosInstance.get('/products/admin/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders', { params: { limit: 1000 } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default adminAPI;
