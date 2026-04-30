import api from './chatApi';

const BASE = '/posts';

export const getAllPosts = async () => {
  const response = await api.get(BASE);
  return Array.isArray(response.data) ? response.data : response.data.posts ?? [];
};

export const getPostById = async (postId) => {
  const response = await api.get(`${BASE}/${postId}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post(BASE, postData);
  return response.data;
};

export const updatePost = async (postId, postData) => {
  const response = await api.put(`${BASE}/${postId}`, postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`${BASE}/${postId}`);
  return { success: true };
};