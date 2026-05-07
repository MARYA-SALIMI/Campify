import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://campify-api-l1vf.onrender.com/api/posts';

const handleError = async (response, label) => {
  const errData = await response.json().catch(() => ({}));
  console.error(`BACKEND HATASI [${label}]:`, errData);
  throw new Error(`HTTP ${response.status}`);
};

// ── Yardımcı: Her istekte güncel token'ı AsyncStorage'dan çeker ──────────────
const authHeaders = async (extra = {}) => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

export const getAllPosts = async () => {
  const response = await fetch(BASE_URL, {
    headers: await authHeaders(),
  });
  if (!response.ok) await handleError(response, 'GET /posts');
  const data = await response.json();
  return Array.isArray(data) ? data : data.posts ?? [];
};

export const getPostById = async (postId) => {
  const response = await fetch(`${BASE_URL}/${postId}`, {
    headers: await authHeaders(),
  });
  if (!response.ok) await handleError(response, `GET /posts/${postId}`);
  return await response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(postData),
  });
  if (!response.ok) await handleError(response, 'POST /posts');
  return await response.json();
};

export const updatePost = async (postId, postData) => {
  const response = await fetch(`${BASE_URL}/${postId}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(postData),
  });
  if (!response.ok) await handleError(response, `PUT /posts/${postId}`);
  return await response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/${postId}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  if (!response.ok) await handleError(response, `DELETE /posts/${postId}`);
  return { success: true };
};