import axios from 'axios';

// Backend linkin (Vercel'e deploy ettiğin adres)
const API_URL = 'https://campify-melisa.vercel.app/api/comments';

export const getComments = async (postId) => {
  const response = await axios.get(`${API_URL}/${postId}`);
  return response.data;
};

export const createComment = async (postId, commentData) => {
  const response = await axios.post(`${API_URL}/${postId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId) => {
  await axios.delete(`${API_URL}/${commentId}`);
};