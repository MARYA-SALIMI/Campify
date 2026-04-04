import { useState, useEffect } from "react";
import ChatList from "../components/chats/ChatList";
import ChatWindow from "../components/chats/ChatWindow";
import { getMessages, sendMessage, deleteMessage } from "../services/chatService";
import "./MessagePage.css";

const CHAT_IDS = [
  { id: "1", name: "Alex Morgan", avatar: "AM", online: true },
  { id: "2", name: "Jordan Lee", avatar: "JL", online: false },
  { id: "3", name: "Sam Rivera", avatar: "SR", online: true },
  { id: "4", name: "Casey Park", avatar: "CP", online: false },
  { id: "5", name: "Taylor Kim", avatar: "TK", online: true },
];

function MessagePage() {
  const [chats, setChats] = useState(
    CHAT_IDS.map((c) => ({ ...c, messages: [], lastMessage: "", time: "", unread: 0 }))
  );
  const [selectedId, setSelectedId] = useState(CHAT_IDS[0].id);

  const selectedChat = chats.find((c) => c.id === selectedId);

  // Seçili sohbetin mesajlarını backend'den çek
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages(selectedId);
      if (!Array.isArray(data)) return;
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== selectedId) return c;
          const lastMsg = data[data.length - 1];
          return {
            ...c,
            messages: data.map((m) => ({
              id: m._id,
              from: m.from,
              text: m.text,
              time: new Date(m.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
            })),
            lastMessage: lastMsg ? lastMsg.text : "",
            time: lastMsg
              ? new Date(lastMsg.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "",
          };
        })
      );
    };
    fetchMessages();
  }, [selectedId]);

  const handleSelect = (id) => {
    setSelectedId(id);
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = async (text) => {
    const sent = await sendMessage("me", text, selectedId);
    if (!sent?._id) return;
    const newMsg = {
      id: sent._id,
      from: "me",
      text: sent.text,
      time: new Date(sent.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, time: newMsg.time }
          : c
      )
    );
  };

  const handleDeleteMessage = async (msgId) => {
    await deleteMessage(msgId);
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== selectedId) return c;
        const updatedMessages = c.messages.filter((m) => m.id !== msgId);
        const lastMsg = updatedMessages[updatedMessages.length - 1];
        return {
          ...c,
          messages: updatedMessages,
          lastMessage: lastMsg ? lastMsg.text : "",
        };
      })
    );
  };

  const handleCreateChat = (name) => {
    const initials = name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("");

    const newChat = {
      id: Date.now().toString(),
      name: name.trim(),
      avatar: initials || "?",
      online: false,
      lastMessage: "",
      time: "",
      unread: 0,
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setSelectedId(newChat.id);
  };

  return (
    <div className="message-page">
      <ChatList
        chats={chats}
        selectedId={selectedId}
        onSelect={handleSelect}
        onCreateChat={handleCreateChat}
      />
      <ChatWindow
        chat={selectedChat}
        onSend={handleSend}
        onDeleteMessage={handleDeleteMessage}
      />
    </div>
  );
}

export default MessagePage;