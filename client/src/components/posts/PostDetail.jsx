import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../pages/Home.css";
import PostCard from "./PostCard";
import { fetchPostById } from "../../services/postService";

const CATEGORIES = [
  { id: "all", label: "Tümü", icon: "◈" },
  { id: "book", label: "Kitap İlanı", icon: "📚" },
  { id: "team", label: "Ekip Arama", icon: "👥" },
  { id: "announcement", label: "Duyuru", icon: "📢" },
  { id: "lost", label: "Kayıp Eşya", icon: "🔍" },
];

const CAT_COLORS = {
  book: "#f0a04b",
  team: "#6c9eeb",
  announcement: "#e06b6b",
  lost: "#7ec88b",
};

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPost(null);

    if (!postId) {
      setLoading(false);
      setError("Geçersiz gönderi bağlantısı.");
      return () => {
        cancelled = true;
      };
    }

    fetchPostById(postId)
      .then((data) => {
        if (!cancelled) {
          setPost(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const msg =
            err.response?.data?.message ||
            err.message ||
            "Gönderi yüklenirken bir hata oluştu.";
          setError(msg);
          setPost(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <div className="home-root" style={{ padding: "1.5rem", maxWidth: 720, margin: "0 auto" }}>
      <Link to="/" className="filter-chip" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Ana sayfa
      </Link>

      {loading && <p className="empty-state">Yükleniyor...</p>}
      {!loading && error && <p className="empty-state" style={{ color: "#c44" }}>{error}</p>}
      {!loading && !error && post && (
        <PostCard
          post={post}
          i={0}
          newCardId={null}
          CATEGORIES={CATEGORIES}
          CAT_COLORS={CAT_COLORS}
          linkToDetail={false}
        />
      )}
    </div>
  );
}