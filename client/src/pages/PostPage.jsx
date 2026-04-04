// src/pages/PostPage.jsx
import { useState, useEffect } from 'react';
import { MessageSquare, XCircle } from 'lucide-react';
import CommentForm from '../components/comments/commentForm';
import CommentList from '../components/comments/commentList';
import { useAuth } from '../context/AuthContext'; 

export default function PostPage({ isDark = false, postId = "1" }) { // postId normalde URL parametresi (useParams) ile alınır
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Yorumları Getir (API Call)
  useEffect(() => {
    // fetch(`/api/posts/${postId}/comments`) ...
    setTimeout(() => {
      setComments([
        { id: 1, text: "Bu kampüs etkinliği gerçekten harikaydı!", author: { id: 'u1', name: "Ahmet Yılmaz" }, createdAt: "2 saat önce" }
      ]);
      setFetching(false);
    }, 1000);
  }, [postId]);

  const handleAddComment = async (text) => {
    setLoading(true);
    try {
      // POST API
      const newObj = { id: Date.now(), text, author: { id: currentUser?.id, name: currentUser?.name || "Ben" }, createdAt: "Şimdi" };
      setComments([...comments, newObj]);
    } catch (err) {
      setError('Yorum eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if(!window.confirm('Emin misiniz?')) return;
    try {
      // DELETE API
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      setError('Silinemedi.');
    }
  };

  const handleUpdateComment = async (commentId, newText) => {
    try {
      // PUT API
      setComments(comments.map(c => c.id === commentId ? { ...c, text: newText } : c));
    } catch (err) {
      setError('Güncellenemedi.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Burada Post'un kendi detayları (Başlık, içerik, vs) yer alacak */}
      
      <div className={`relative rounded-3xl shadow-xl transition-all duration-500 ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-gray-100'} backdrop-blur-xl p-6 md:p-8 mt-8`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Tartışmaya Katıl</h3>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        <CommentForm onAddComment={handleAddComment} isDark={isDark} loading={loading} />
        <CommentList 
          comments={comments} 
          fetching={fetching} 
          currentUser={currentUser} 
          isDark={isDark} 
          onDelete={handleDeleteComment} 
          onUpdate={handleUpdateComment} 
        />
      </div>
    </div>
  );
}