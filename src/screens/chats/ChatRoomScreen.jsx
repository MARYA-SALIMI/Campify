import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Check, CheckCheck, Heart, MoreVertical, Pencil, Send, Trash2, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator, Alert,
    Animated,
    FlatList,
    KeyboardAvoidingView, Modal, Platform, SafeAreaView, StatusBar,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';
import { deleteMessage, editMessage, getMessages, markAsRead, sendMessage, toggleLikeMessage } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

const formatMsgTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

const normalizeMessage = (raw) => {
    if (!raw) return null;
    const senderId = typeof raw.sender === 'object' ? raw.sender?._id ?? raw.sender?.id : raw.sender ?? raw.senderId ?? raw.from;
    return {
        id: raw._id ?? raw.id ?? Date.now().toString(),
        content: raw.content ?? raw.text ?? '',
        senderId: senderId ?? '',
        createdAt: raw.createdAt ?? new Date().toISOString(),
        isEdited: raw.isEdited ?? false,
        likes: raw.likes ?? [],
        isSeen: raw.isSeen ?? false,
    };
};

const AnimatedHeart = ({ visible, onComplete }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scale, { toValue: 1.5, useNativeDriver: true, friction: 3 }),
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
            ]).start(() => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(scale, { toValue: 0, duration: 200, useNativeDriver: true }),
                        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true })
                    ]).start(onComplete);
                }, 500);
            });
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.heartOverlay, { transform: [{ scale }], opacity }]}>
            <Heart size={50} color="#F43F5E" fill="#F43F5E" />
        </Animated.View>
    );
};

const ChatRoomScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, name } = route.params ?? {};
    
    const { user } = useAuth();
    const currentUserId = user?.id || user?._id;

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [headerName, setHeaderName] = useState(name || 'Sohbet');
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [animatingLikeId, setAnimatingLikeId] = useState(null);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const flatListRef = useRef(null);
    const lastPressRef = useRef(0);
    const typingTimeoutRef = useRef(null);

    // --- İSİM ÇEKME MANTIĞI ---
    useEffect(() => {
        const isGeneric = !headerName || headerName === 'Sohbet' || headerName === 'Yükleniyor...' || headerName === 'Kampüs Sakini' || headerName.includes('Kullanıcı');
        
        if (isGeneric && id) {
            const fetchOtherUserName = async () => {
                try {
                    const chatData = await getMessages(id);
                    const otherId = chatData.participants?.find(uid => uid !== currentUserId);
                    if (otherId) {
                        try {
                            const { authService } = await import('../../services/authService');
                            let profile = await authService.getProfile(otherId);
                            
                            // 2nzn Fallback if main fails
                            if (!profile || (!profile.name && !profile.ad)) {
                                const { default: axios } = await import('axios');
                                try {
                                    const res = await axios.get(`https://campify-api-2nzn.onrender.com/v1/users/${otherId}`);
                                    if (res.data) profile = res.data;
                                } catch (e1) {
                                    // l1vf Fallback
                                    try {
                                        const res2 = await axios.get(`https://campify-api-l1vf.onrender.com/api/users/${otherId}`);
                                        if (res2.data) profile = res2.data;
                                    } catch (e2) {}
                                }
                            }

                            if (profile) {
                                const finalName = profile.name || 
                                    (profile.ad || profile.firstName ? `${profile.ad || profile.firstName || ''} ${profile.soyad || profile.lastName || ''}`.trim() : null) ||
                                    profile.username || `Kullanıcı (${String(otherId).slice(-4)})`;
                                setHeaderName(finalName);
                            }
                        } catch (e) {
                            // GENEL FALLBACK
                            try {
                                const { default: axios } = await import('axios');
                                const hosts = [
                                    `https://campify-api-2nzn.onrender.com/v1/users/${otherId}`,
                                    `https://campify-api-l1vf.onrender.com/api/users/${otherId}`
                                ];
                                for (const host of hosts) {
                                    try {
                                        const res = await axios.get(host);
                                        if (res.data) {
                                            const p = res.data;
                                            const n = p.name || `${p.ad || p.firstName || ''} ${p.soyad || p.lastName || ''}`.trim() || p.username || `Kullanıcı (${String(otherId).slice(-4)})`;
                                            setHeaderName(n);
                                            return;
                                        }
                                    } catch (eHost) {}
                                }
                            } catch (eFinal) {}
                        }
                    }
                } catch (error) {
                    console.log("[ChatRoom] İsim çekme hatası:", error);
                }
            };
            fetchOtherUserName();
        }
    }, [id, currentUserId]);

    useFocusEffect(
        useCallback(() => {
            const chatId = id || route.params?.id;
            if (!chatId) return;

            let cancelled = false;

            const fetchMessages = async () => {
                setIsLoading(true);
                try {
                    const data = await getMessages(chatId);
                    if (cancelled) return;
                    
                    const rawMsgs = Array.isArray(data) ? data : (data.messages ?? []);
                    setMessages(rawMsgs.map(normalizeMessage).filter(Boolean));
                    
                    // Diğer kullanıcı yazıyor mu?
                    const typing = data.typingUsers || [];
                    setIsOtherTyping(typing.some(uid => uid !== currentUserId));
                    
                    await markAsRead(chatId);
                } catch (error) {
                    if (cancelled) return;
                    console.error('Mesajlar çekilemedi:', error);
                    setMessages([]);
                } finally {
                    if (!cancelled) setIsLoading(false);
                }
            };

            fetchMessages();

            return () => { cancelled = true; };
        }, [id, route.params?.id, currentUserId])
    );

    const handleSend = useCallback(async () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        if (editingMsgId) {
            // DÜZENLEME MODU
            const msgId = editingMsgId;
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: trimmed, isEdited: true } : m));
            setEditingMsgId(null);
            setInputText('');
            try {
                await editMessage(msgId, trimmed);
            } catch (error) {
                console.error("Düzenleme hatası:", error);
            }
            return;
        }

        const tempMsg = {
            id: `temp_${Date.now()}`,
            content: trimmed,
            senderId: currentUserId,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempMsg]);
        setInputText('');

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            const saved = await sendMessage(id, {
                content: trimmed,
                senderId: currentUserId,
            });

            const rawMsg = saved?.data ?? saved;
            const savedMsg = normalizeMessage(rawMsg);

            if (!savedMsg) return;

            setMessages((prev) =>
                prev.map((m) => (m.id === tempMsg.id ? savedMsg : m))
            );
        } catch (error) {
            console.error('Mesaj gönderilemedi:', error);
            setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        }
    }, [inputText, id, editingMsgId]);

    // Yazıyor durumunu yönet
    useEffect(() => {
        if (!id) return;

        if (inputText.length > 0) {
            import('../../services/chatService').then(s => s.setTypingStatus(id, true));
            
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                import('../../services/chatService').then(s => s.setTypingStatus(id, false));
            }, 3000);
        } else {
            import('../../services/chatService').then(s => s.setTypingStatus(id, false));
        }

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [inputText, id]);

    const handleDoubleTap = async (msg) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (now - lastPressRef.current < DOUBLE_PRESS_DELAY) {
            // Animasyonu başlat
            setAnimatingLikeId(msg.id);
            
            // BEĞENİ
            try {
                // İyimser güncelleme
                setMessages(prev => prev.map(m => {
                    if (m.id === msg.id) {
                        const likes = m.likes || [];
                        const alreadyLiked = likes.includes(currentUserId);
                        return {
                            ...m,
                            likes: alreadyLiked ? likes.filter(uid => uid !== currentUserId) : [...likes, currentUserId]
                        };
                    }
                    return m;
                }));
                await toggleLikeMessage(msg.id);
            } catch (error) {
                console.error("Beğeni hatası:", error);
            }
        }
        lastPressRef.current = now;
    };

    const handleLongPress = (msg) => {
        if (msg.senderId !== currentUserId) return;
        setSelectedMsg(msg);
        setShowActions(true);
    };

    const confirmDelete = async () => {
        if (!selectedMsg) return;
        const msgId = selectedMsg.id;
        try {
            setShowActions(false);
            await deleteMessage(id, msgId);
            setMessages(prev => prev.filter(m => m.id !== msgId));
            setSelectedMsg(null);
        } catch (error) {
            console.error("Mesaj silme hatası:", error);
            Alert.alert("Hata", "Mesaj silinemedi.");
        }
    };

    const startEditing = () => {
        if (!selectedMsg) return;
        setEditingMsgId(selectedMsg.id);
        setInputText(selectedMsg.content);
        setShowActions(false);
        setSelectedMsg(null);
    };

    const renderMessage = ({ item, index }) => {
        const isMine = item.senderId === currentUserId;
        const isLiked = item.likes?.includes(currentUserId);
        const likeCount = item.likes?.length || 0;
        
        // Son mesaj mı ve okundu mu?
        const isLastMessage = index === messages.length - 1;
        const showSeen = isMine && isLastMessage && item.isSeen;

        return (
            <View style={[styles.msgRow, isMine ? styles.msgRowRight : styles.msgRowLeft]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleDoubleTap(item)}
                    onLongPress={() => handleLongPress(item)}
                    style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}
                >
                    <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextOther]}>
                        {item.content}
                    </Text>
                    <View style={styles.bubbleFooter}>
                        {item.isEdited && (
                            <Text style={[styles.editedText, isMine ? styles.editedTextMine : styles.editedTextOther]}>
                                düzenlendi
                            </Text>
                        )}
                        <View style={styles.timeAndStatus}>
                            <Text style={[styles.bubbleTime, isMine ? styles.bubbleTimeMine : styles.bubbleTimeOther]}>
                                {formatMsgTime(item.createdAt)}
                            </Text>
                            {isMine && (
                                item.isSeen ? <CheckCheck size={12} color="rgba(0,0,0,0.5)" /> : <Check size={12} color="rgba(0,0,0,0.4)" />
                            )}
                        </View>
                    </View>

                    {likeCount > 0 && (
                        <View style={[styles.likeBadge, isMine ? styles.likeBadgeMine : styles.likeBadgeOther]}>
                            <Heart size={10} color="#F43F5E" fill="#F43F5E" />
                        </View>
                    )}

                    <AnimatedHeart 
                        visible={animatingLikeId === item.id} 
                        onComplete={() => setAnimatingLikeId(null)} 
                    />
                </TouchableOpacity>
                {showSeen && (
                    <Text style={styles.seenText}>Görüldü</Text>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={22} color="#F3F4F6" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerName} numberOfLines={1}>
                        {headerName}
                    </Text>
                    <Text style={styles.headerSub}>Sohbet #{id}</Text>
                </View>

                <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
                    <MoreVertical size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#10B981" />
                        <Text style={styles.loadingText}>Mesajlar yükleniyor...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.messageList}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Henüz mesaj yok.</Text>
                                <Text style={styles.emptySubText}>İlk mesajı sen gönder! 👋</Text>
                            </View>
                        }
                    />
                )}

                {isOtherTyping && (
                    <View style={styles.typingIndicator}>
                        <Text style={styles.typingText}>yazıyor...</Text>
                    </View>
                )}

                {editingMsgId && (
                    <View style={styles.editIndicator}>
                        <View style={styles.editIndicatorContent}>
                            <Text style={styles.editIndicatorText} numberOfLines={1}>Mesajı düzenle: {messages.find(m => m.id === editingMsgId)?.content}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setEditingMsgId(null); setInputText(''); }}>
                            <X size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={editingMsgId ? "Düzenle…" : "Bir mesaj yaz…"}
                        placeholderTextColor="#4B5563"
                        multiline
                        maxLength={1000}
                        autoFocus={!!editingMsgId}
                        returnKeyType="default"
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        activeOpacity={0.8}
                        disabled={!inputText.trim()}
                    >
                        <Send size={18} color={inputText.trim() ? '#000' : '#4B5563'} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>

                {/* --- CUSTOM MESSAGE ACTIONS MODAL --- */}
                <Modal visible={showActions} transparent animationType="fade">
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActions(false)}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIndicator} />
                            <TouchableOpacity style={styles.modalItem} onPress={startEditing}>
                                <Pencil size={20} color="#10B981" />
                                <Text style={styles.modalItemText}>Mesajı Düzenle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={confirmDelete}>
                                <Trash2 size={20} color="#F43F5E" />
                                <Text style={[styles.modalItemText, { color: '#F43F5E' }]}>Mesajı Sil</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: '#0D1117' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#21262D', gap: 12 },
    backBtn: { padding: 4, borderRadius: 8 },
    headerCenter: { flex: 1, justifyContent: 'center' },
    headerName: { color: '#F3F4F6', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
    headerSub: { color: '#4B5563', fontSize: 11, marginTop: 1 },
    moreBtn: { padding: 6, borderRadius: 8 },
    messageList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    msgRow: { flexDirection: 'row', marginVertical: 3 },
    msgRowRight: { justifyContent: 'flex-end' },
    msgRowLeft: { justifyContent: 'flex-start' },
    bubble: { maxWidth: '78%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 9, gap: 4, position: 'relative' },
    bubbleMine: { backgroundColor: '#10B981', borderBottomRightRadius: 4 },
    bubbleOther: { backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D', borderBottomLeftRadius: 4 },
    bubbleText: { fontSize: 14, lineHeight: 20 },
    bubbleTextMine: { color: '#000', fontWeight: '500' },
    bubbleTextOther: { color: '#E5E7EB' },
    bubbleFooter: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 6, marginTop: 2 },
    timeAndStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    bubbleTime: { fontSize: 10 },
    bubbleTimeMine: { color: 'rgba(0,0,0,0.5)' },
    bubbleTimeOther: { color: '#4B5563' },
    editedText: { fontSize: 9, fontStyle: 'italic' },
    editedTextMine: { color: 'rgba(0,0,0,0.4)' },
    editedTextOther: { color: '#4B5563' },
    likeBadge: { position: 'absolute', bottom: -10, backgroundColor: '#1E293B', padding: 3, borderRadius: 10, borderWidth: 1, borderColor: '#21262D' },
    likeBadgeMine: { right: 10 },
    likeBadgeOther: { left: 10 },
    heartOverlay: { position: 'absolute', top: '50%', left: '50%', marginLeft: -25, marginTop: -25, zIndex: 10, alignItems: 'center', justifyContent: 'center' },
    seenText: { fontSize: 10, color: '#4B5563', alignSelf: 'flex-end', marginRight: 16, marginTop: 2 },
    typingIndicator: { paddingHorizontal: 16, paddingVertical: 4 },
    typingText: { fontSize: 11, color: '#10B981', fontStyle: 'italic' },
    editIndicator: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#161B22', borderTopWidth: 1, borderTopColor: '#21262D', alignItems: 'center', justifyContent: 'space-between' },
    editIndicatorContent: { flex: 1, marginRight: 10 },
    editIndicatorText: { color: '#9CA3AF', fontSize: 12 },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#21262D', backgroundColor: '#0D1117' },
    input: { flex: 1, minHeight: 44, maxHeight: 120, backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, color: '#F3F4F6', fontSize: 14, lineHeight: 20 },
    sendBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
    sendBtnDisabled: { backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 6 },
    emptyText: { color: '#4B5563', fontSize: 15, fontWeight: '600' },
    emptySubText: { color: '#374151', fontSize: 13 },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#161B22',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#21262D'
    },
    modalIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#30363D',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 20
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 12
    },
    modalItemText: {
        color: '#F9FAFB',
        fontSize: 16,
        fontWeight: '600'
    },
});

export default ChatRoomScreen;