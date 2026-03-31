import React from "react";

export default function PostDetail({ post, i, newCardId, CATEGORIES, CAT_COLORS }) {
  return (
    <article
      className={`post-card ${newCardId === post.id ? "post-card--new" : ""}`}
      style={{ "--i": i, "--accent": CAT_COLORS[post.category] || "#aaa" }}
    >
      <div className="card-accent-bar" />
      <div className="card-inner">
        <div className="card-meta-row">
          <span className="post-badge">
            {CATEGORIES.find((c) => c.id === post.category)?.icon}{" "}
            {CATEGORIES.find((c) => c.id === post.category)?.label}
          </span>
          <span className="post-time">{post.time}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-body">{post.content}</p>
        <div className="post-author-row">
          <div className="author-avatar">{post.avatar}</div>
          <span className="author-name">@{post.author}</span>
        </div>
      </div>
    </article>
  );
}