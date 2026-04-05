import { useEffect, useState } from 'react';
import { getComments } from '../../services/commentService';

export default function CommentList({ postId, refreshKey }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getComments(postId);
      setComments(data);
    };
    if (postId) fetch();
  }, [postId, refreshKey]); // refreshKey eklendi ki yeni yorum yazınca liste güncellensin

  return (
    <div className="space-y-4 mt-4">
      {comments.map(c => (
        <div key={c._id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p className="text-sm">{c.text}</p>
        </div>
      ))}
    </div>
  );
}