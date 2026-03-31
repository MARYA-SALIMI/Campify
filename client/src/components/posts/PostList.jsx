import React from "react";
import PostDetail from "../posts/PostDetail";

export default function PostList({ filtered, newCardId, CATEGORIES, CAT_COLORS }) {
  return (
    <main className="post-list">
      {filtered.length === 0 && (
        <div className="empty-state">Bu kategoride henüz gönderi yok.</div>
      )}
      
      {filtered.map((post, i) => (
        <PostDetail
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