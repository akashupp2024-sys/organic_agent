import axiosInstance from './axios';

const orderAPI = {
  // Create new order
  create: async (orderData) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get logged-in user's orders
  getMyOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get order by ID
  getById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all orders (admin only)
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update order status (admin only)
  updateStatus: async (orderId, statusData) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default orderAPI;
