import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post, i, newCardId, CATEGORIES, CAT_COLORS, linkToDetail = true }) {
  const inner = (
    <>
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
    </>
  );

  const className = `post-card ${newCardId === post.id ? "post-card--new" : ""}`;

  if (linkToDetail) {
    return (
      <Link
        to={`/post/${post.id}`}
        className={className}
        style={{ "--i": i, "--accent": CAT_COLORS[post.category] || "#aaa", textDecoration: "none", color: "inherit" }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className={className} style={{ "--i": i, "--accent": CAT_COLORS[post.category] || "#aaa" }}>
      {inner}
    </article>
  );
}