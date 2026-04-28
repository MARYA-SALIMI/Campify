import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
// 🎯 DEĞİŞTİRİLDİ: expo-router yerine React Navigation kancaları geldi
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react-native';

const BASE_URL = 'https://campify-api-l1vf.onrender.com/api';
const CURRENT_USER_ID = '60d0fe4f5311236168a109ca';

const formatMsgTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

const normalizeMessage = (raw) => {
    if (!raw) return null;
    const senderId = typeof raw.sender === 'object' ? raw.sender?._id ?? raw.sender?.id : raw.sender ?? raw.senderId;
    return {
        id: raw._id ?? raw.id ?? Date.now().toString(),
        content: raw.content ?? '',
        senderId: senderId ?? '',
        createdAt: raw.createdAt ?? new Date().toISOString(),
    };
};

const ChatRoomScreen = () => {
    // 🎯 DEĞİŞTİRİLDİ: Yönlendirme ve parametre alma işlemleri React Navigation ile yapılıyor
    const navigation = useNavigation();
    const route = useRoute();
    const { id, name } = route.params || {};

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const flatListRef = useRef(null);

    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/chats/${id}/messages`);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error('BACKEND HATASI [GET /chats/:id/messages]:', errData);
                setMessages([]);
                return;
            }
            const data = await response.json();
            const raw = Array.isArray(data) ? data : data.messages ?? data.data ?? [];
            setMessages(raw.map(normalizeMessage).filter(Boolean));
        } catch (error) {
            console.error('Mesajlar çekilemedi:', error);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleSend = useCallback(async () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        const tempMsg = {
            id: `temp_${Date.now()}`,
            content: trimmed,
            senderId: CURRENT_USER_ID,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempMsg]);
        setInputText('');

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            const response = await fetch(`${BASE_URL}/chats/${id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: trimmed, senderId: CURRENT_USER_ID }),
            });

            if (!response.ok) {
                setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
                return;
            }

            const saved = await response.json();
            const savedMsg = normalizeMessage(saved.data);

            if (!savedMsg) return;

            setMessages((prev) =>
                prev.map((m) => (m.id === tempMsg.id ? savedMsg : m))
            );
        } catch (error) {
            console.error('Mesaj gönderilemedi:', error);
            setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        }
    }, [inputText, id]);

    const renderMessage = ({ item }) => {
        const isMine = item.senderId === CURRENT_USER_ID;
        return (
            <View style={[styles.msgRow, isMine ? styles.msgRowRight : styles.msgRowLeft]}>
                <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
                    <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextOther]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.bubbleTime, isMine ? styles.bubbleTimeMine : styles.bubbleTimeOther]}>
                        {formatMsgTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()} // 🎯 DEĞİŞTİRİLDİ
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={22} color="#F3F4F6" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerName} numberOfLines={1}>
                        {name ?? 'Sohbet'}
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

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Bir mesaj yaz…"
                        placeholderTextColor="#4B5563"
                        multiline
                        maxLength={1000}
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
    bubble: { maxWidth: '78%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 9, gap: 4 },
    bubbleMine: { backgroundColor: '#10B981', borderBottomRightRadius: 4 },
    bubbleOther: { backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D', borderBottomLeftRadius: 4 },
    bubbleText: { fontSize: 14, lineHeight: 20 },
    bubbleTextMine: { color: '#000', fontWeight: '500' },
    bubbleTextOther: { color: '#E5E7EB' },
    bubbleTime: { fontSize: 10, alignSelf: 'flex-end' },
    bubbleTimeMine: { color: 'rgba(0,0,0,0.5)' },
    bubbleTimeOther: { color: '#4B5563' },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#21262D', backgroundColor: '#0D1117' },
    input: { flex: 1, minHeight: 44, maxHeight: 120, backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, color: '#F3F4F6', fontSize: 14, lineHeight: 20 },
    sendBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
    sendBtnDisabled: { backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 6 },
    emptyText: { color: '#4B5563', fontSize: 15, fontWeight: '600' },
    emptySubText: { color: '#374151', fontSize: 13 },
});

export default ChatRoomScreen;