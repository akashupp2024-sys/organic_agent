import axiosInstance from './axios';

const paymentAPI = {
  // Create Razorpay order
  createOrder: async (paymentData) => {
    try {
      const response = await axiosInstance.post('/payment/create-order', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify payment signature
  verifyPayment: async (verificationData) => {
    try {
      const response = await axiosInstance.post('/payment/verify', verificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default paymentAPI;
