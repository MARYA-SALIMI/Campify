const BASE_URL = 'https://campify-api-l1vf.onrender.com/api/posts';

// ── Yardımcı: Hata durumunda backend mesajını logla ──────────────────────────
const handleError = async (response, label) => {
  const errData = await response.json().catch(() => ({}));
  console.error(`BACKEND HATASI [${label}]:`, errData);
  throw new Error(`HTTP ${response.status}`);
};

// ── GET /posts ───────────────────────────────────────────────────────────────
export const getAllPosts = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) await handleError(response, 'GET /posts');
  const data = await response.json();
  return Array.isArray(data) ? data : data.posts ?? [];
};

// ── GET /posts/:postId ───────────────────────────────────────────────────────
export const getPostById = async (postId) => {
  const response = await fetch(`${BASE_URL}/${postId}`);
  if (!response.ok) await handleError(response, `GET /posts/${postId}`);
  return await response.json();
};

// ── POST /posts ──────────────────────────────────────────────────────────────
export const createPost = async (postData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) await handleError(response, 'POST /posts');
  return await response.json();
};

// ── PUT /posts/:postId ───────────────────────────────────────────────────────
export const updatePost = async (postId, postData) => {
  const response = await fetch(`${BASE_URL}/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) await handleError(response, `PUT /posts/${postId}`);
  return await response.json();
};

// ── DELETE /posts/:postId ────────────────────────────────────────────────────
export const deletePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/${postId}`, {
    method: 'DELETE',
  });
  if (!response.ok) await handleError(response, `DELETE /posts/${postId}`);
  return { success: true };
};