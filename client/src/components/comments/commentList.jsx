// src/components/comments/commentList.jsx
import { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';

export default function CommentList({ comments, currentUser, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  if (!comments || comments.length === 0) {
    return <p className="text-center py-6 text-gray-500 text-sm">İlk yanıt veren sen ol!</p>;
  }

  return (
    <div className="divide-y divide-gray-700/50">
      {comments.map(comment => (
        <div key={comment.id} className="py-4 flex gap-3 hover:bg-white/5 transition-colors">
          
          {/* Sol: Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
              {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* Sağ: İçerik */}
          <div className="flex-1 min-w-0">
            
            {/* Üst Satır: İsim, Kullanıcı Adı ve Tarih */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[15px]">
                <span className="font-bold text-white truncate">{comment.author?.name || 'Anonim'}</span>
                {/* Twitter stili @handle */}
                <span className="text-gray-500 truncate">@{comment.author?.name?.toLowerCase().replace(/\s/g, '') || 'user'}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500 whitespace-nowrap">{comment.createdAt || 'az önce'}</span>
              </div>

              {/* Sadece yetkili kullanıcı silip/düzenleyebilir */}
              {currentUser?.id === comment.author?.id && (
                <div className="flex items-center gap-3">
                  <button onClick={() => { setEditingId(comment.id); setEditContent(comment.text); }} className="text-gray-500 hover:text-emerald-500 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(comment.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Alt Satır: Mesaj Metni veya Düzenleme Alanı */}
            {editingId === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  rows="2"
                />
                <div className="flex justify-end gap-2 mt-2">
                   <button onClick={() => setEditingId(null)} className="px-4 py-1.5 rounded-full text-sm font-bold text-white hover:bg-gray-700 transition-colors">İptal</button>
                   <button onClick={() => { onUpdate(comment.id, editContent); setEditingId(null); }} className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors">Kaydet</button>
                </div>
              </div>
            ) : (
              <p className="text-gray-100 mt-1 text-[15px] whitespace-pre-wrap">{comment.text}</p>
            )}
            
          </div>
        </div>
      ))}
    </div>
  );
}