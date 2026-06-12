import axiosInstance from './axios';

const productAPI = {
  // Get all products with filters
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single product by ID
  getById: async (productId) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add review to product
  addReview: async (productId, reviewData) => {
    try {
      const response = await axiosInstance.post(`/products/${productId}/review`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create product (admin only)
  create: async (productData) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update product (admin only)
  update: async (productId, productData) => {
    try {
      const response = await axiosInstance.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete product (admin only)
  delete: async (productId) => {
    try {
      const response = await axiosInstance.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default productAPI;
