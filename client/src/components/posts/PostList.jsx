import React from "react";
import PostCard from "./PostCard";

export default function PostList({
  filtered,
  newCardId,
  CATEGORIES,
  CAT_COLORS,
  loading,
  error,
}) {
  if (loading) {
    return (
      <main className="post-list">
        <div className="empty-state">Yükleniyor...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="post-list">
        <div className="empty-state" style={{ color: "#c44" }}>
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="post-list">
      {filtered.length === 0 && (
        <div className="empty-state">Bu kategoride henüz gönderi yok.</div>
      )}

      {filtered.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          i={i}
          newCardId={newCardId}
          CATEGORIES={CATEGORIES}
          CAT_COLORS={CAT_COLORS}
        />
      ))}
    </main>
  );
}