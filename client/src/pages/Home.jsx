import { useState, useEffect } from "react";
import "./Home.css";
import PostList from "../components/posts/PostList";
import PostCreate from "../components/posts/PostCreate";

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
      
      {/* ÜST BAŞLIK VE BUTON ALANI */}
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

      {/* GÖNDERİ LİSTESİ BİLEŞENİ */}
      <PostList 
        filtered={filtered} 
        newCardId={newCardId} 
        CATEGORIES={CATEGORIES} 
        CAT_COLORS={CAT_COLORS} 
      />

      {/* YENİ GÖNDERİ MODAL BİLEŞENİ */}
      <PostCreate 
        showModal={showModal} 
        setShowModal={setShowModal} 
        newPost={newPost} 
        setNewPost={setNewPost} 
        handleCreate={handleCreate} 
        CATEGORIES={CATEGORIES} 
        CAT_COLORS={CAT_COLORS} 
      />

    </div>
  );
}