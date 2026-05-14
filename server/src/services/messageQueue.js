const { getChannel, isRabbitMQAvailable, QUEUES } = require('../config/rabbitmq');

/**
 * Belirtilen kuyruga bir event mesaji gonderir
 * RabbitMQ baglantisi yoksa sessizce devam eder (graceful fallback)
 *
 * @param {string} queue - Kuyruk adi (QUEUES enum'dan)
 * @param {object} eventData - Event verisi
 */
const publishEvent = async (queue, eventData) => {
  if (!isRabbitMQAvailable()) {
    console.warn(`[MessageQueue] RabbitMQ bagli degil, event atlanis: ${eventData.type}`);
    return false;
  }

  try {
    const channel = getChannel();
    const message = {
      ...eventData,
      timestamp: new Date().toISOString(),
      id: generateEventId(),
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true, // Mesaj kalici olsun (disk'e yazilir)
    });

    console.log(`[MessageQueue] Event gonderildi: ${queue} -> ${eventData.type}`);
    return true;
  } catch (err) {
    console.warn('[MessageQueue] Event gonderme hatasi:', err.message);
    return false;
  }
};

/**
 * Yeni post olusturuldiginda event yayinla
 */
const publishPostCreated = async (post) => {
  return publishEvent(QUEUES.POST_EVENTS, {
    type: 'POST_CREATED',
    data: {
      postId: post._id,
      title: post.title,
      authorId: post.authorId,
      authorName: post.authorName,
    },
  });
};

/**
 * Yeni yorum olusturuldiginda event yayinla
 */
const publishCommentCreated = async (comment) => {
  return publishEvent(QUEUES.COMMENT_EVENTS, {
    type: 'COMMENT_CREATED',
    data: {
      commentId: comment._id,
      postId: comment.postId,
      authorId: comment.authorId,
      authorName: comment.authorName,
      text: comment.text,
    },
  });
};

/**
 * Yeni chat mesaji gonderildiginde event yayinla
 */
const publishMessageSent = async (message) => {
  return publishEvent(QUEUES.CHAT_EVENTS, {
    type: 'MESSAGE_SENT',
    data: {
      messageId: message._id,
      chatId: message.chatId,
      from: message.from,
      text: message.text,
    },
  });
};

/**
 * Bildirim event'i yayinla
 */
const publishNotification = async (userId, title, body) => {
  return publishEvent(QUEUES.NOTIFICATION_EVENTS, {
    type: 'NOTIFICATION',
    data: { userId, title, body },
  });
};

// Benzersiz event ID uret
const generateEventId = () => {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

module.exports = {
  publishEvent,
  publishPostCreated,
  publishCommentCreated,
  publishMessageSent,
  publishNotification,
};
