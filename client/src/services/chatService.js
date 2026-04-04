const BASE_URL = import.meta.env.VITE_API_URL;

// Mesajları getir
export const getMessages = async (chatId) => {
  const res = await fetch(`${BASE_URL}/api/chat?chatId=${chatId}`);
  return res.json();
};

// Mesaj gönder
export const sendMessage = async (from, text, chatId) => {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, text, chatId }),
  });
  return res.json();
};

// Mesaj sil
export const deleteMessage = async (messageId) => {
  const res = await fetch(`${BASE_URL}/api/chat/${messageId}`, {
    method: 'DELETE',
  });
  return res.json();
};