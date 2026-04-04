// src/components/comments/commentForm.jsx
import { useState } from 'react';

export default function CommentForm({ onAddComment, currentUser }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 py-4 border-b border-gray-700/50">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
          {currentUser?.name?.charAt(0).toUpperCase() || 'C'}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col pt-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Yanıtını Gönder..."
          className="w-full bg-transparent text-gray-100 text-[15px] placeholder-gray-500 focus:outline-none resize-none"
          rows="2"
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
          >
            Yanıtla
          </button>
        </div>
      </div>
    </form>
  );
}