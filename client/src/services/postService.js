import axios from "axios";

// .env dosyasını devre dışı bırakıp doğrudan canlı domaini sabitliyoruz
const postsBase = "https://campify-api-l1vf.onrender.com/api";

const api = axios.create({
  baseURL: postsBase, 
  headers: { "Content-Type": "application/json" },
});


function formatRelativeTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(Math.abs(diffMs) / 60000);
  if (diffMs < 0) return "yakında";
  if (diffMin < 1) return "az önce";
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} saat önce`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} gün önce`;
  return d.toLocaleString("tr-TR");
}

export function mapPostFromServer(p) {
  if (!p) return null;
  const id = p._id ?? p.id;
  const author =
    typeof p.author === "string" && p.author
      ? p.author
      : typeof p.userId === "object" && p.userId?.username
        ? p.userId.username
        : "kampüs";
  const initial = author.charAt(0).toUpperCase();
  return {
    id: String(id),
    category: p.category || "book",
    title: p.title,
    content: p.content,
    author,
    avatar: initial || "K",
    time: formatRelativeTime(p.createdAt),
  };
}

export async function fetchPosts(params = {}) {
  const { data } = await api.get("/posts", { params: { limit: 100, ...params } });
  const list = Array.isArray(data) ? data : data?.posts ?? data?.items ?? [];
  return list.map(mapPostFromServer).filter(Boolean);
}

export async function fetchPostById(postId) {
  const { data } = await api.get(`/posts/${postId}`);
  return mapPostFromServer(data);
}



export async function createPost(payload) {
    // Önce localStorage'da giriş yapmış bir kullanıcı var mı diye bakıyoruz,
    // Yoksa arkadaşının kullandığı gibi geçici bir ID atıyoruz.
    const currentUserId = localStorage.getItem("userId") || "650000000000000000000001"; 
  
    const dataToSend = {
      ...payload,
      userId: currentUserId, 
      author: currentUserId  
    };
  
    const { data } = await api.post("/posts", dataToSend);
    return mapPostFromServer(data);
  }



export { api };