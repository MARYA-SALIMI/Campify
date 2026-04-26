import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react-native';

// ── Mevcut kullanıcı — backend entegrasyonunda auth'tan gelecek ──────────────
const CURRENT_USER_ID = 'sinem_user_01';

// ── Mock mesajlar ────────────────────────────────────────────────────────────
const MOCK_MESSAGES = [
    { id: 'm1', content: 'Merhaba! Nasıl gidiyor?', senderId: 'other', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'm2', content: 'İyiyim, teşekkürler! Proje nasıl?', senderId: CURRENT_USER_ID, createdAt: new Date(Date.now() - 3500000).toISOString() },
    { id: 'm3', content: 'Projeyi bugün bitirirsek harika olur!', senderId: 'other', createdAt: new Date(Date.now() - 300000).toISOString() },
];

const formatMsgTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

// ── Bileşen ──────────────────────────────────────────────────────────────────
const ChatRoomScreen = () => {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();

    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    // ── Mesaj gönderme ───────────────────────────────────────────────────────
    const handleSend = useCallback(() => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        const newMsg = {
            id: Date.now().toString(),
            content: trimmed,
            senderId: CURRENT_USER_ID,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // TODO: Backend'e gönderim buraya gelecek (chatId: id)
        console.log(`Mesaj gönderildi — sohbet: ${id}`, newMsg);
    }, [inputText, id]);

    // ── Mesaj balonu ─────────────────────────────────────────────────────────
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
            {/* ── Expo Router varsayılan header'ı gizle ── */}
            <Stack.Screen options={{ headerShown: false }} />

            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

            {/* ── Özel Header ── */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={22} color="#F3F4F6" />
                </TouchableOpacity>

                {/* headerAvatar ve MessageCircle ikonu kaldırıldı */}
                <View style={styles.headerCenter}>
                    <Text style={styles.headerName} numberOfLines={1}>
                        {name ?? 'Sohbet'}
                    </Text>
                    <Text style={styles.headerSub}>Sohbet #{id}</Text>
                </View>

                {/* 🚪 MELİSA İÇİN KAPI: Sohbet seçenekleri menüsü */}
                <TouchableOpacity
                    style={styles.moreBtn}
                    onPress={() => console.log('Melisa: Sohbet seçenekleri menüsü buraya bağlanacak')}
                    activeOpacity={0.7}
                >
                    <MoreVertical size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            {/* ── Mesaj listesi + Klavye kaçınma ── */}
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                />

                {/* ── Input alanı ── */}
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

// ── Stiller ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: '#0D1117' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#21262D',
        gap: 12,
    },
    backBtn: {
        padding: 4,
        borderRadius: 8,
    },
    headerCenter: {
        flex: 1,
        justifyContent: 'center',
    },
    headerName: {
        color: '#F3F4F6',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    headerSub: {
        color: '#4B5563',
        fontSize: 11,
        marginTop: 1,
    },
    moreBtn: {
        padding: 6,
        borderRadius: 8,
    },

    // Mesajlar
    messageList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    msgRow: {
        flexDirection: 'row',
        marginVertical: 3,
    },
    msgRowRight: { justifyContent: 'flex-end' },
    msgRowLeft: { justifyContent: 'flex-start' },

    bubble: {
        maxWidth: '78%',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 9,
        gap: 4,
    },
    bubbleMine: {
        backgroundColor: '#10B981',
        borderBottomRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: '#161B22',
        borderWidth: 1,
        borderColor: '#21262D',
        borderBottomLeftRadius: 4,
    },
    bubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    bubbleTextMine: { color: '#000', fontWeight: '500' },
    bubbleTextOther: { color: '#E5E7EB' },
    bubbleTime: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    bubbleTimeMine: { color: 'rgba(0,0,0,0.5)' },
    bubbleTimeOther: { color: '#4B5563' },

    // Input
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#21262D',
        backgroundColor: '#0D1117',
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        backgroundColor: '#161B22',
        borderWidth: 1,
        borderColor: '#21262D',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: '#F3F4F6',
        fontSize: 14,
        lineHeight: 20,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#161B22',
        borderWidth: 1,
        borderColor: '#21262D',
    },
});

export default ChatRoomScreen;