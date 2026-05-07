import chatApi from './chatApi';

const commentService = {
  // GET /api/comments/:postId — Yorumları listele
  getComments: async (postId) => {
    const response = await chatApi.get(`/api/comments/${postId}`);
    return response.data;
  },

  // POST /api/comments/:postId — Yorum ekle
  addComment: async (postId, data) => {
    // data: { text, authorId, authorName, parentId }
    const response = await chatApi.post(`/api/comments/${postId}`, data);
    return response.data;
  },

  // POST /api/comments/:commentId/like — Yorum beğen
  toggleLike: async (commentId, userId, userName) => {
    const response = await chatApi.post(`/api/comments/${commentId}/like`, { userId, userName });
    return response.data;
  },

  // PUT /api/comments/:commentId — Yorum güncelle
  updateComment: async (commentId, data) => {
    const response = await chatApi.put(`/api/comments/${commentId}`, data);
    return response.data;
  },

  // DELETE /api/comments/:commentId — Yorum sil
  deleteComment: async (postId, commentId) => {
    const response = await chatApi.delete(`/api/comments/${commentId}`);
    return response.data;
  }
};

export default commentService;