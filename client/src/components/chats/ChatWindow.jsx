import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

function ChatWindow({ chat, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="chat-window">
        <div className="chat-window-empty">Select a conversation to start messaging</div>
      </div>
    );
  }

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-avatar">
          {chat.avatar}
          <span className={`chat-avatar-dot${chat.online ? "" : " offline"}`} />
        </div>
        <div className="chat-window-header-info">
          <p className="chat-window-name">{chat.name}</p>
          <span className={`chat-window-status${chat.online ? " online" : " offline"}`}>
            <span className="chat-window-status-dot" />
            {chat.online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message-row${msg.from === "me" ? " from-me" : ""}`}
          >
            <div className={`chat-bubble${msg.from === "me" ? " from-me" : " from-them"}`}>
              {msg.text}
              <div className="chat-bubble-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-window-input-area">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={handleSend} aria-label="Send">
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;