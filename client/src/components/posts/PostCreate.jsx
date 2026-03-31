import React from "react";

export default function PostCreate({
  showModal,
  setShowModal,
  newPost,
  setNewPost,
  handleCreate,
  CATEGORIES,
  CAT_COLORS
}) {
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

        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setShowModal(false)}>İptal</button>
          <button
            className="btn-publish"
            style={{ "--pub": CAT_COLORS[newPost.category] }}
            onClick={handleCreate}
          >
            Yayınla
          </button>
        </div>
      </div>
    </div>
  );
}