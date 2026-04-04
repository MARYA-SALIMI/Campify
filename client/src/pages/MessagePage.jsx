import { useState } from "react";
import ChatList from "../components/chats/ChatList";
import ChatWindow from "../components/chats/ChatWindow";
import "./MessagePage.css";

export const mockChats = [
  {
    id: 1,
    name: "Alex Morgan",
    avatar: "AM",
    online: true,
    lastMessage: "Hey, are you joining the camp next weekend?",
    time: "09:41",
    unread: 3,
    messages: [
      { id: 1, from: "them", text: "Hey! How's the prep going for next camp?", time: "09:30" },
      { id: 2, from: "me", text: "Pretty good! Packed most of my gear already.", time: "09:32" },
      { id: 3, from: "them", text: "Nice. Don't forget the rain poncho, forecast says storms.", time: "09:35" },
      { id: 4, from: "me", text: "Oh good call, almost forgot that.", time: "09:38" },
      { id: 5, from: "them", text: "Hey, are you joining the camp next weekend?", time: "09:41" },
    ],
  },
  {
    id: 2,
    name: "Jordan Lee",
    avatar: "JL",
    online: false,
    lastMessage: "The trail map has been updated 🗺️",
    time: "08:15",
    unread: 1,
    messages: [
      { id: 1, from: "them", text: "Just got the new trail map from the ranger station.", time: "08:10" },
      { id: 2, from: "me", text: "Sweet! How many new routes?", time: "08:12" },
      { id: 3, from: "them", text: "The trail map has been updated 🗺️", time: "08:15" },
    ],
  },
  {
    id: 3,
    name: "Sam Rivera",
    avatar: "SR",
    online: true,
    lastMessage: "Campfire tonight at 8, you in?",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, from: "me", text: "What time does the hike start tomorrow?", time: "18:00" },
      { id: 2, from: "them", text: "6 AM sharp, don't be late 😄", time: "18:05" },
      { id: 3, from: "them", text: "Campfire tonight at 8, you in?", time: "20:00" },
    ],
  },
  {
    id: 4,
    name: "Casey Park",
    avatar: "CP",
    online: false,
    lastMessage: "Sent you the gear checklist",
    time: "Mon",
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "Here's the full gear checklist for the trip.", time: "14:00" },
      { id: 2, from: "them", text: "Sent you the gear checklist", time: "14:01" },
      { id: 3, from: "me", text: "Got it, thanks!", time: "14:20" },
    ],
  },
  {
    id: 5,
    name: "Taylor Kim",
    avatar: "TK",
    online: true,
    lastMessage: "Can't wait for the summit! 🏔️",
    time: "Sun",
    unread: 0,
    messages: [
      { id: 1, from: "me", text: "How's your training going?", time: "11:00" },
      { id: 2, from: "them", text: "Running 5k every morning now.", time: "11:05" },
      { id: 3, from: "them", text: "Can't wait for the summit! 🏔️", time: "11:06" },
    ],
  },
];

function MessagePage() {
  const [chats, setChats] = useState(mockChats);
  const [selectedId, setSelectedId] = useState(mockChats[0].id);

  const selectedChat = chats.find((c) => c.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = (text) => {
    const newMsg = {
      id: Date.now(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, time: newMsg.time }
          : c
      )
    );
  };

  return (
    <div className="message-page">
      <ChatList
        chats={chats}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      <ChatWindow chat={selectedChat} onSend={handleSend} />
    </div>
  );
}

export default MessagePage;