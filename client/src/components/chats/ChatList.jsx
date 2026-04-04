import { useState } from "react";
import { Search } from "lucide-react";

function ChatList({ chats, selectedId, onSelect, onCreateChat }) {
  const [query, setQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateChat(newName);
    setNewName("");
    setShowNewChat(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") {
      setShowNewChat(false);
      setNewName("");
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2 className="chat-list-title">Messages</h2>

        <div className="chat-search-wrapper">
          <span className="chat-search-icon">
            <Search size={15} />
          </span>
          <input
            className="chat-search-input"
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* YENİ SOHBET */}
        {!showNewChat ? (
          <button
            className="chat-new-simple-btn"
            onClick={() => setShowNewChat(true)}
          >
            + New Conversation
          </button>
        ) : (
          <div className="chat-new-form">
            <input
              autoFocus
              className="chat-new-input"
              type="text"
              placeholder="Enter a name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="chat-new-actions">
              <button
                className="chat-new-cancel-btn"
                onClick={() => { setShowNewChat(false); setNewName(""); }}
              >
                Cancel
              </button>
              <button
                className="chat-new-create-btn"
                onClick={handleCreate}
                disabled={!newName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="chat-list-items">
        {filtered.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item${selectedId === chat.id ? " active" : ""}`}
            onClick={() => onSelect(chat.id)}
          >
            <div className="chat-avatar">
              {chat.avatar}
              <span className={`chat-avatar-dot${chat.online ? "" : " offline"}`} />
            </div>
            <div className="chat-item-body">
              <div className="chat-item-top">
                <span className="chat-item-name">{chat.name}</span>
                <span className="chat-item-time">{chat.time}</span>
              </div>
              <div className="chat-item-bottom">
                <span className="chat-item-preview">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="chat-unread-badge">{chat.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;