import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/postService";

const emptyPost = { title: "", content: "", category: "book" };

export default function PostCreate({
  showModal,
  setShowModal,
  newPost,
  setNewPost,
  CATEGORIES,
  CAT_COLORS,
  onPostCreated,
}) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handlePublish = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const created = await createPost({
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category,
      });
      setNewPost({ ...emptyPost });
      setShowModal(false);
      onPostCreated?.(created);
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gönderi oluşturulamadı.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
      <div className="modal">
        <div className="modal-header">
          <h2>Yeni Gönderi</h2>
          <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
        </div>

        <div className="modal-field">
          <label>Kategori</label>
          <div className="cat-grid">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-option ${newPost.category === cat.id ? "selected" : ""}`}
                style={{ "--cat": CAT_COLORS[cat.id] }}
                onClick={() => setNewPost({ ...newPost, category: cat.id })}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-field">
          <label>Başlık</label>
          <input
            type="text"
            placeholder="Gönderi başlığı..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
        </div>

        <div className="modal-field">
          <label>İçerik</label>
          <textarea
            placeholder="Ne paylaşmak istiyorsun?"
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </div>

        {submitError && (
          <p className="empty-state" style={{ color: "#c44", margin: "0 0 0.5rem" }}>
            {submitError}
          </p>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={submitting}>
            İptal
          </button>
          <button
            type="button"
            className="btn-publish"
            style={{ "--pub": CAT_COLORS[newPost.category] }}
            onClick={handlePublish}
            disabled={submitting}
          >
            {submitting ? "Gönderiliyor..." : "Yayınla"}
          </button>
        </div>
      </div>
    </div>
  );
}