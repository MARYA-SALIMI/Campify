import { useState, useEffect, useCallback } from "react";
import "./Home.css";
import PostList from "../components/posts/PostList";
import PostCreate from "../components/posts/PostCreate";
import { fetchPosts } from "../services/postService";

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

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "book" });
  const [newCardId, setNewCardId] = useState(null);

  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const list = await fetchPosts();
      setPosts(list);
    } catch (err) {
      let msg =
        err.response?.data?.message ||
        err.message ||
        "Gönderiler yüklenirken bir hata oluştu.";
      if (err.code === "ERR_NETWORK" || /Network Error/i.test(String(err.message))) {
        msg =
          "Backend'e bağlanılamadı. `server` klasöründe API'yi çalıştırın (örn. port 3000) veya client için `.env` içinde VITE_POSTS_API_URL ile canlı API adresinizi verin (örn. https://sunucu.onrender.com/api).";
      }
      setPostsError(msg);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filtered =
    activeFilter === "all" ? posts : posts.filter((p) => p.category === activeFilter);

  const handlePostCreated = (created) => {
    if (created) {
      setPosts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
      setNewCardId(created.id);
      setActiveFilter("all");
      setTimeout(() => setNewCardId(null), 800);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
  }, [showModal]);

  return (
    <div className="home-root">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Kampüs Akışı</h1>
          <p>Sana uygun gönderileri bul veya kendi gönderini paylaş</p>
        </div>
        <button className="btn-create-top" onClick={() => setShowModal(true)}>
          + Gönderi Oluştur
        </button>
      </div>

      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`filter-chip ${activeFilter === cat.id ? "active" : ""}`}
            style={
              activeFilter === cat.id && cat.id !== "all"
                ? { "--chip-accent": CAT_COLORS[cat.id] }
                : {}
            }
            onClick={() => setActiveFilter(cat.id)}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <PostList
        filtered={filtered}
        newCardId={newCardId}
        CATEGORIES={CATEGORIES}
        CAT_COLORS={CAT_COLORS}
        loading={postsLoading}
        error={postsError}
      />

      <PostCreate
        showModal={showModal}
        setShowModal={setShowModal}
        newPost={newPost}
        setNewPost={setNewPost}
        CATEGORIES={CATEGORIES}
        CAT_COLORS={CAT_COLORS}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}