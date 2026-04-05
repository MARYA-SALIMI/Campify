import { useState } from 'react';
import { createComment } from '../../services/api'; // veya commentService

export default function CommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createComment(postId, { text });
      setText('');
      onCommentAdded(); // Listeyi yenilemek için tetikleyici
    } catch (err) {
      alert("Yorum gönderilemedi!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 border rounded-lg dark:bg-gray-700"
        placeholder="Yorum yaz..."
      />
      <button type="submit" className="bg-emerald-500 text-white px-4 rounded-lg">Gönder</button>
    </form>
  );
}