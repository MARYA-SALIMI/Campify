import { useState } from "react";
import { MessageCircle, Heart, X, Plus } from "lucide-react";
import "./Home.css";

const CURRENT_USER = "sen";

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
    content:
      "Nisan sonundaki TechFest için takım kuruyorum. Backend veya UI/UX bilen arkadaşlar yazabilir.",
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
    avatar: "A",
    time: "1 gün önce",
  },
];

const initialComments = {
  1: [
    {
      id: 101,
      author: "mert.dev",
      avatar: "M",
      text: "Hâlâ mevcut mu?",
      time: "1 saat önce",
      likedUsers: ["zeynep.s", "ayse.k"],
      replies: [
        {
          id: 1011,
          author: "ayse.k",
          avatar: "A",
          text: "Evet mevcut.",
          time: "45 dk önce",
          likedUsers: ["mert.dev"],
          replies: [],
        },
      ],
    },
  ],
  2: [],
  3: [],
};

/* ── Beğenenler Modalı ── */
function LikesModal({ users, onClose }) {
  return (
    <div
      className="modal-overlay likes-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="likes-modal">
        <div className="likes-header">
          <h3>Beğenenler</h3>
          <button className="likes-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="likes-list">
          {users.length === 0 ? (
            <div className="likes-empty">Henüz beğeni yok.</div>
          ) : (
            users.map((user, i) => (
              <div key={i} className="like-user-row">
                <div className="like-avatar">{user[0].toUpperCase()}</div>
                <span>@{user}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tek Yorum Bileşeni (Yanıtları Gör Özelliği Eklendi) ── */
function CommentItem({ comment, level = 0, onLike, onReply, onShowLikes }) {
  const [showReplies, setShowReplies] = useState(false); // Yanıtları göster/gizle state'i
  const liked = comment.likedUsers.includes(CURRENT_USER);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="ig-comment" style={{ marginLeft: `${level * 28}px` }}>
      <div className="ig-avatar">{comment.avatar}</div>
      <div className="ig-body">
        <div className="ig-main-row">
          <div className="ig-text-block">
            <span className="ig-username">{comment.author}</span>
            <span className="ig-comment-text"> {comment.text}</span>
          </div>
          <button
            className={`ig-heart-btn ${liked ? "liked" : ""}`}
            onClick={() => onLike(comment.id)}
            aria-label="Beğen"
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
        
        <div className="ig-actions-row">
          <span className="ig-time">{comment.time}</span>
          <button
            className="ig-action-link"
            onClick={() => onShowLikes(comment.likedUsers)}
          >
            {comment.likedUsers.length} beğeni
          </button>
          <button
            className="ig-action-link"
            onClick={() => onReply(comment.id)}
          >
            Yanıtla
          </button>
        </div>

        {/* Yanıtları Gör / Gizle Bölümü */}
        {hasReplies && (
          <div className="inst-replies-section">
            <button 
              className="inst-view-replies" 
              onClick={() => setShowReplies(!showReplies)}
            >
              <div className="line"></div>
              {showReplies 
                ? "Yanıtları gizle" 
                : `${comment.replies.length} yanıtı gör`}
            </button>

            {/* Sadece tıklandığında (showReplies true ise) yanıtları listele */}
            {showReplies && (
              <div className="inst-replies-list">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    level={1} // Yanıtlar için sabit veya artan girinti
                    onLike={onLike}
                    onReply={onReply}
                    onShowLikes={onShowLikes}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Yorumlar Modal İçeriği ── */
function CommentsModalContent({ post }) {
  const [commentsData, setCommentsData] = useState(
    initialComments[post.id] || []
  );
  const [inputText, setInputText] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [likesModalUsers, setLikesModalUsers] = useState(null);

  const updateRecursive = (list, id, updater) =>
    list.map((c) => {
      if (c.id === id) return updater(c);
      return { ...c, replies: updateRecursive(c.replies || [], id, updater) };
    });

  const handleLike = (id) => {
    setCommentsData((prev) =>
      updateRecursive(prev, id, (c) => {
        const liked = c.likedUsers.includes(CURRENT_USER);
        return {
          ...c,
          likedUsers: liked
            ? c.likedUsers.filter((u) => u !== CURRENT_USER)
            : [...c.likedUsers, CURRENT_USER],
        };
      })
    );
  };

  const handleAdd = () => {
    if (!inputText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: CURRENT_USER,
      avatar: "S",
      text: inputText,
      time: "şimdi",
      likedUsers: [],
      replies: [],
    };
    if (!replyingToId) {
      setCommentsData((prev) => [...prev, newComment]);
    } else {
      setCommentsData((prev) =>
        updateRecursive(prev, replyingToId, (c) => ({
          ...c,
          replies: [...c.replies, newComment],
        }))
      );
    }
    setInputText("");
    setReplyingToId(null);
  };

  return (
    <>
      <div className="ig-comments-container">
        <div className="ig-comments-list">
          {commentsData.length === 0 ? (
            <div className="ig-empty">Henüz yorum yok.</div>
          ) : (
            commentsData.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLike}
                onReply={setReplyingToId}
                onShowLikes={setLikesModalUsers}
              />
            ))
          )}
        </div>

        <div className="ig-form-fixed">
          {replyingToId && (
            <div className="ig-replying-to">
              Yanıtlanıyor…
              <button
                className="ig-cancel-reply"
                onClick={() => setReplyingToId(null)}
              >
                İptal
              </button>
            </div>
          )}
          <div className="form-input-row">
            <div className="ig-avatar-small">S</div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={replyingToId ? "Yanıt yaz..." : "Yorum ekle..."}
              className="ig-input"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button onClick={handleAdd} className="ig-submit">
              Paylaş
            </button>
          </div>
        </div>
      </div>

      {likesModalUsers !== null && (
        <LikesModal
          users={likesModalUsers}
          onClose={() => setLikesModalUsers(null)}
        />
      )}
    </>
  );
}

/* ── Ana Bileşen ── */
export default function Home() {
  const [posts] = useState(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const filtered =
    activeFilter === "all"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  return (
    <div className="home-root">
      {/* Başlık */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Kampüs Akışı</h1>
          <p>Sana uygun gönderileri bul veya kendi gönderini paylaş</p>
        </div>
        <button className="create-post-btn">
          <Plus size={16} />
          Gönderi Oluştur
        </button>
      </div>

      {/* Filtreler */}
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Gönderi Listesi */}
      <main className="post-list">
        {filtered.map((post) => {
          const cat = CATEGORY_LABELS[post.category];
          return (
            <article key={post.id} className="post-card">
              <div className="card-inner">
                {/* Üst satır: etiket + zaman */}
                <div className="post-meta-top">
                  <span
                    className="category-badge"
                    style={{ "--cat-color": cat?.color }}
                  >
                    {cat?.emoji} {cat?.label}
                  </span>
                  <span className="post-time">{post.time}</span>
                </div>

                {/* Başlık & İçerik */}
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.content}</p>

                {/* Alt satır: avatar + yazar + yorumlar */}
                <div className="post-footer">
                  <div className="post-author">
                    <div className="author-avatar">{post.avatar}</div>
                    <span className="author-name">@{post.author}</span>
                  </div>
                  <button
                    className="action-btn"
                    onClick={() => setActiveCommentPost(post)}
                  >
                    <MessageCircle size={16} />
                    Yorumlar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {/* Yorumlar Modalı */}
      {activeCommentPost && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setActiveCommentPost(null)
          }
        >
          <div className="modal comment-modal">
            <div className="premium-comment-header">Yorumlar</div>
            <CommentsModalContent post={activeCommentPost} />
          </div>
        </div>
      )}
    </div>
  );
}
