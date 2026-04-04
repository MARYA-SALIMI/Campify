import { useState, useEffect } from "react";
import { MessageCircle, Heart, X, Plus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Kendi yoluna göre ayarla
import "./Home.css";

// 1. DÜZELTME: MongoDB'nin çökmeyeceği geçerli ID'ler atadık
const MOCK_POSTS = [
  {
    id: "65f0a2b3c4d5e6f7a8b9c001", 
    category: "book",
    title: "Suç ve Ceza — Dostoyevski",
    content: "2. el, iyi durumda. 40 TL'ye satıyorum. DM atabilirsiniz.",
    author: "ayse.k",
    avatar: "A",
    time: "2 saat önce",
  },
  {
    id: "65f0a2b3c4d5e6f7a8b9c002",
    category: "team",
    title: "Hackathon ekibi arıyorum",
    content: "Nisan sonundaki TechFest için takım kuruyorum. Backend veya UI/UX bilen arkadaşlar yazabilir.",
    author: "mert.dev",
    avatar: "M",
    time: "5 saat önce",
  },
  {
    id: "65f0a2b3c4d5e6f7a8b9c003",
    category: "announcement",
    title: "Kütüphane Saatleri Değişti",
    content: "Bu hafta Cuma günü kütüphane 17:00'de kapanacaktır. Bilgilerinize.",
    author: "admin",
    avatar: "A",
    time: "1 gün önce",
  },
];

const CATEGORY_LABELS = {
  book: { label: "KİTAP İLANI", emoji: "📚", color: "#f59e0b" },
  team: { label: "EKİP ARAMA", emoji: "🧩", color: "#6366f1" },
  announcement: { label: "DUYURU", emoji: "📢", color: "#ec4899" },
  lost: { label: "KAYIP EŞYA", emoji: "🔍", color: "#14b8a6" },
};

const FILTERS = [
  { key: "all", label: "Tümü", emoji: "✦" },
  { key: "book", label: "Kitap İlanı", emoji: "📚" },
  { key: "team", label: "Ekip Arama", emoji: "🧩" },
  { key: "announcement", label: "Duyuru", emoji: "📢" },
  { key: "lost", label: "Kayıp Eşya", emoji: "🔍" },
];

/* ── Beğenenler Modalı (Aynı kaldı) ── */
function LikesModal({ users, onClose }) {
  return (
    <div className="modal-overlay likes-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="likes-modal">
        <div className="likes-header">
          <h3>Beğenenler</h3>
          <button className="likes-close-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="likes-list">
          {users.length === 0 ? <div className="likes-empty">Henüz beğeni yok.</div> : users.map((user, i) => (
            <div key={i} className="like-user-row">
              <div className="like-avatar">{user[0].toUpperCase()}</div>
              <span>@{user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tek Yorum Bileşeni (Aynı kaldı) ── */
function CommentItem({ comment, level = 0, onLike, onReply, onShowLikes, currentUser }) {
  const [showReplies, setShowReplies] = useState(false);
  // Tasarımı bozmamak için boş varsayılanlar
  const likedUsers = comment.likedUsers || [];
  const replies = comment.replies || [];
  const liked = likedUsers.includes(currentUser?.name);
  const hasReplies = replies.length > 0;

  return (
    <div className="ig-comment" style={{ marginLeft: `${level * 28}px` }}>
      <div className="ig-avatar">{comment.avatar || "U"}</div>
      <div className="ig-body">
        <div className="ig-main-row">
          <div className="ig-text-block">
            <span className="ig-username">{comment.author || "Öğrenci"}</span>
            <span className="ig-comment-text"> {comment.text}</span>
          </div>
          <button className={`ig-heart-btn ${liked ? "liked" : ""}`} onClick={() => onLike(comment._id || comment.id)}>
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
        
        <div className="ig-actions-row">
          <span className="ig-time">{comment.time || "şimdi"}</span>
          <button className="ig-action-link" onClick={() => onShowLikes(likedUsers)}>{likedUsers.length} beğeni</button>
          <button className="ig-action-link" onClick={() => onReply(comment._id || comment.id)}>Yanıtla</button>
        </div>
      </div>
    </div>
  );
}

/* ── 2. DÜZELTME: Veritabanına Bağlanan Yorum Modalı ── */
function CommentsModalContent({ post }) {
  const [commentsData, setCommentsData] = useState([]);
  const [inputText, setInputText] = useState("");
  const [likesModalUsers, setLikesModalUsers] = useState(null);
  
  const { currentUser } = useAuth(); 
  // API URL'ini kendi Vercel adresine göre güncelle
  const API_URL = 'https://campify-melisa.vercel.app/api/comments'; 

  // Veritabanından Yorumları Çek
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_URL}/${post.id}`);
        setCommentsData(res.data);
      } catch (err) {
        console.error("Yorumlar yüklenemedi", err);
      }
    };
    fetchComments();
  }, [post.id]);

  // Veritabanına Gerçek Yorum Gönder
  const handleAdd = async () => {
    if (!inputText.trim()) return;
    if (!currentUser) {
      alert("Yorum yapmak için giriş yapmalısın.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/${post.id}`, {
        text: inputText,
        authorId: currentUser.id // Context'ten gelen kullanıcı ID'niz
      });
      
      // Gelen gerçek veriyi listeye ekle
      setCommentsData((prev) => [...prev, res.data]);
      setInputText("");
    } catch (err) {
      alert("Yorum gönderilirken hata oluştu.");
    }
  };

  // Sadece ekranda çalışan sahte beğeni butonu (tasarım bozulmasın diye)
  const handleLike = (id) => {
    console.log("Beğeni özelliği backend'e bağlı değil.");
  };

  return (
    <>
      <div className="ig-comments-container">
        <div className="ig-comments-list">
          {commentsData.length === 0 ? (
            <div className="ig-empty">Henüz yorum yok. İlk yorumu sen yap!</div>
          ) : (
            commentsData.map((comment) => (
              <CommentItem
                key={comment._id || comment.id}
                comment={comment}
                onLike={handleLike}
                onReply={() => console.log("Yanıt sistemi backend'e bağlı değil")}
                onShowLikes={setLikesModalUsers}
                currentUser={currentUser}
              />
            ))
          )}
        </div>

        <div className="ig-form-fixed">
          <div className="form-input-row">
            <div className="ig-avatar-small">{currentUser ? currentUser.name[0].toUpperCase() : "?"}</div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Yorum ekle..."
              className="ig-input"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button onClick={handleAdd} className="ig-submit">Paylaş</button>
          </div>
        </div>
      </div>

      {likesModalUsers !== null && (
        <LikesModal users={likesModalUsers} onClose={() => setLikesModalUsers(null)} />
      )}
    </>
  );
}

/* ── Ana Bileşen (Aynı kaldı) ── */
export default function Home() {
  const [posts] = useState(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const filtered = activeFilter === "all" ? posts : posts.filter((p) => p.category === activeFilter);

  return (
    <div className="home-root">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Kampüs Akışı</h1>
          <p>Sana uygun gönderileri bul veya kendi gönderini paylaş</p>
        </div>
        <button className="create-post-btn"><Plus size={16} /> Gönderi Oluştur</button>
      </div>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button key={f.key} className={`filter-chip ${activeFilter === f.key ? "active" : ""}`} onClick={() => setActiveFilter(f.key)}>
            <span>{f.emoji}</span> {f.label}
          </button>
        ))}
      </div>

      <main className="post-list">
        {filtered.map((post) => {
          const cat = CATEGORY_LABELS[post.category];
          return (
            <article key={post.id} className="post-card">
              <div className="card-inner">
                <div className="post-meta-top">
                  <span className="category-badge" style={{ "--cat-color": cat?.color }}>{cat?.emoji} {cat?.label}</span>
                  <span className="post-time">{post.time}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.content}</p>
                <div className="post-footer">
                  <div className="post-author">
                    <div className="author-avatar">{post.avatar}</div>
                    <span className="author-name">@{post.author}</span>
                  </div>
                  <button className="action-btn" onClick={() => setActiveCommentPost(post)}>
                    <MessageCircle size={16} /> Yorumlar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {activeCommentPost && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActiveCommentPost(null)}>
          <div className="modal comment-modal">
            <div className="premium-comment-header">Yorumlar</div>
            <CommentsModalContent post={activeCommentPost} />
          </div>
        </div>
      )}
    </div>
  );
}