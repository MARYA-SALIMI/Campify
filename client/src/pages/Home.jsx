import { useState, useRef, useEffect } from "react";
import "./Home.css";

const CATEGORIES = [
  { id: "all", label: "Tümü", icon: "◈" },
  { id: "book", label: "Kitap İlanı", icon: "📚" },
  { id: "team", label: "Ekip Arama", icon: "👥" },
  { id: "announcement", label: "Duyuru", icon: "📢" },
  { id: "lost", label: "Kayıp Eşya", icon: "🔍" },
];

const MOCK_POSTS = [
  {
    id: 1,
    category: "book",
    title: "Suç ve Ceza — Dostoyevski",
    content: "2. el, iyi durumda. 40 TL'ye satıyorum. DM atabilirsiniz.",
    author: "ayse.k",
    avatar: "A",
    time: "2 saat önce",
  },
  {
    id: 2,
    category: "team",
    title: "Hackathon ekibi arıyorum",
    content: "Nisan sonundaki TechFest için takım kuruyorum. Backend veya UI/UX bilen arkadaşlar yazabilir.",
    author: "mert.dev",
    avatar: "M",
    time: "5 saat önce",
  },
  {
    id: 3,
    category: "announcement",
    title: "Kütüphane Saatleri Değişti",
    content: "Bu hafta Cuma günü kütüphane 17:00'de kapanacaktır. Bilgilerinize.",
    author: "admin",
    avatar: "★",
    time: "1 gün önce",
  },
  {
    id: 4,
    category: "lost",
    title: "Siyah şemsiye kayboldu",
    content: "Kafeterya yakınında siyah şemsiyemi kaybettim. Gören olursa lütfen ulaşsın.",
    author: "zeynep.s",
    avatar: "Z",
    time: "3 saat önce",
  },
  {
    id: 5,
    category: "book",
    title: "Dune — Frank Herbert (İngilizce)",
    content: "Orijinal İngilizce baskı. Hiç okunmamış gibi. 80 TL.",
    author: "can.b",
    avatar: "C",
    time: "12 saat önce",
  },
  {
    id: 6,
    category: "team",
    title: "Proje grubu — Veri Madenciliği",
    content: "Veri Madenciliği dersi için 3. ve 4. üye arıyoruz. Toplantı günü Çarşamba.",
    author: "elif.y",
    avatar: "E",
    time: "6 saat önce",
  },
];

const CAT_COLORS = {
  book: "#f0a04b",
  team: "#6c9eeb",
  announcement: "#e06b6b",
  lost: "#7ec88b",
};

export default function Home() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "book" });
  const [newCardId, setNewCardId] = useState(null);

  const filtered =
    activeFilter === "all" ? posts : posts.filter((p) => p.category === activeFilter);

  const handleCreate = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const post = {
      id: Date.now(),
      ...newPost,
      author: "sen",
      avatar: "S",
      time: "şimdi",
    };
    setPosts([post, ...posts]);
    setNewCardId(post.id);
    setShowModal(false);
    setNewPost({ title: "", content: "", category: "book" });
    setActiveFilter("all");
    setTimeout(() => setNewCardId(null), 800);
  };

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
  }, [showModal]);

  return (
    <div className="home-root">
      
      {/* YENİ EKLENEN ÜST BAŞLIK VE BUTON ALANI */}
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

      <main className="post-list">
        {filtered.length === 0 && (
          <div className="empty-state">Bu kategoride henüz gönderi yok.</div>
        )}
        {filtered.map((post, i) => (
          <article
            key={post.id}
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
        ))}
      </main>

      {showModal && (
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

            {/* Modal Actions (İptal ve Yayınla Butonları) */}
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
      )}
    </div>
  );
}