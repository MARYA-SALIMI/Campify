import api from './api';

export const authService = {
  // Rota backend'de router.get('/:userId') şeklinde, o yüzden id göndermeliyiz
  getProfile: async (userId) => {
    const response = await api.get(`/v1/users/${userId}`);
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/v1/profile', userData);
    return response.data;
  },
  deleteProfile: async () => {
    const response = await api.delete('/v1/profile');
    return response.data;
  }
};