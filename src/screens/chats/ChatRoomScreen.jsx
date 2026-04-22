import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { ArrowLeft, Send, MoreVertical, Phone } from 'lucide-react-native';

// Kurgusal mevcut kullanıcı (DEĞİŞTİRİLMEDİ)
const CURRENT_USER_ID = 'current-user-id';

// --- Mock Mesajlar --- (DEĞİŞTİRİLMEDİ)
const INITIAL_MESSAGES = [
    {
        id: 'm1',
        content: 'Merhaba! Proje nasıl gidiyor?',
        senderId: 'other-user-id',
        createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    },
    {
        id: 'm2',
        content: 'İyi gidiyor, mesajlaşma kısmını bitirmek üzereyim 🎉',
        senderId: CURRENT_USER_ID,
        createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    },
    {
        id: 'm3',
        content: 'Harika! Ben de sohbet oluşturma kısmına başlıyorum.',
        senderId: 'other-user-id',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
        id: 'm4',
        content: 'Çok iyi bir ekibiz 💪 Başarılar!',
        senderId: CURRENT_USER_ID,
        createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
];

const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const ChatRoomScreen = ({ route, navigation }) => {
    const { chatId, chatName } = route.params;

    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    // ✅ SİNEM'İN GÖREVİ: Mesaj Gönderme (DEĞİŞTİRİLMEDİ)
    const handleSend = () => {
        const text = inputText.trim();
        if (!text) return;

        const newMessage = {
            id: `m-${Date.now()}`,
            content: text,
            senderId: CURRENT_USER_ID,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 80);
    };

    const renderMessage = ({ item, index }) => {
        const isMine = item.senderId === CURRENT_USER_ID;
        const prevMsg = messages[index - 1];
        const isSameSenderAsPrev = prevMsg && prevMsg.senderId === item.senderId;

        return (
            // 🚪 MELİSA İÇİN KAPI: onLongPress → Mesaj Silme (DEĞİŞTİRİLMEDİ)
            <TouchableOpacity
                activeOpacity={0.85}
                onLongPress={() => {
                    console.log('Melisa: Mesaj silme fonksiyonu buraya bağlanacak');
                }}
                style={[
                    styles.messageRow,
                    isMine ? styles.rowRight : styles.rowLeft,
                    !isSameSenderAsPrev && styles.rowSpacing,
                ]}
            >
                {/* Karşı taraf avatarı */}
                {!isMine && !isSameSenderAsPrev && (
                    <View style={styles.msgAvatar}>
                        <Text style={styles.msgAvatarText}>{getInitials(chatName)}</Text>
                    </View>
                )}
                {!isMine && isSameSenderAsPrev && (
                    <View style={styles.msgAvatarPlaceholder} />
                )}

                <View
                    style={[
                        styles.bubble,
                        isMine ? styles.myBubble : styles.theirBubble,
                        isMine
                            ? isSameSenderAsPrev
                                ? styles.myBubbleChain
                                : styles.myBubbleFirst
                            : isSameSenderAsPrev
                                ? styles.theirBubbleChain
                                : styles.theirBubbleFirst,
                    ]}
                >
                    <Text style={[styles.bubbleText, isMine && styles.myBubbleText]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.bubbleTime, isMine && styles.myBubbleTime]}>
                        {formatTime(item.createdAt)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={21} color="#F3F4F6" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <View style={styles.headerAvatar}>
                        <Text style={styles.headerAvatarText}>{getInitials(chatName)}</Text>
                    </View>
                    <View>
                        <Text style={styles.headerName}>{chatName}</Text>
                        <Text style={styles.headerOnline}>● Çevrimiçi</Text>
                    </View>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
                        <Phone size={19} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
                        <MoreVertical size={19} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Mesaj Listesi */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                />

                {/* Input alanı */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mesaj yaz..."
                        placeholderTextColor="#4B5563"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        activeOpacity={0.8}
                    >
                        <Send size={17} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    flex: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#21262D',
        backgroundColor: '#0D1117',
    },
    headerBtn: {
        padding: 7,
        borderRadius: 10,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 4,
    },
    headerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(249,115,22,0.1)',
        borderWidth: 2,
        borderColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerAvatarText: {
        color: '#F97316',
        fontSize: 13,
        fontWeight: '700',
    },
    headerName: {
        color: '#F3F4F6',
        fontSize: 15,
        fontWeight: '700',
    },
    headerOnline: {
        color: '#22C55E',
        fontSize: 11,
        fontWeight: '500',
        marginTop: 1,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 2,
    },

    // Mesajlar
    messagesList: {
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 7,
    },
    rowLeft: { justifyContent: 'flex-start' },
    rowRight: { justifyContent: 'flex-end' },
    rowSpacing: { marginTop: 12 },

    // Karşı taraf avatarı
    msgAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#161B22',
        borderWidth: 1.5,
        borderColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    msgAvatarText: {
        color: '#9CA3AF',
        fontSize: 9,
        fontWeight: '700',
    },
    msgAvatarPlaceholder: {
        width: 28,
        flexShrink: 0,
    },

    // Balonlar
    bubble: {
        maxWidth: '74%',
        paddingHorizontal: 13,
        paddingVertical: 9,
        marginVertical: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },

    // BENİM mesajlarım — koyu turuncu/kiremit
    myBubble: {
        backgroundColor: '#7C2D12',
        borderWidth: 1,
        borderColor: '#F97316',
    },
    myBubbleFirst: {
        borderRadius: 18,
        borderBottomRightRadius: 4,
    },
    myBubbleChain: {
        borderRadius: 18,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 4,
    },
    myBubbleText: {
        color: '#FED7AA',
    },
    myBubbleTime: {
        color: '#FB923C',
        opacity: 0.8,
    },

    // KARŞI TARAF mesajları — koyu gri
    theirBubble: {
        backgroundColor: '#161B22',
        borderWidth: 1,
        borderColor: '#21262D',
    },
    theirBubbleFirst: {
        borderRadius: 18,
        borderBottomLeftRadius: 4,
    },
    theirBubbleChain: {
        borderRadius: 18,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 4,
    },

    bubbleText: {
        color: '#D1D5DB',
        fontSize: 14,
        lineHeight: 20,
    },
    bubbleTime: {
        color: '#4B5563',
        fontSize: 10,
        marginTop: 5,
        textAlign: 'right',
    },

    // Input
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#21262D',
        backgroundColor: '#0D1117',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#161B22',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#21262D',
        color: '#F3F4F6',
        fontSize: 14,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        maxHeight: 120,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.45,
        shadowRadius: 6,
        elevation: 5,
    },
    sendBtnDisabled: {
        backgroundColor: '#21262D',
        shadowOpacity: 0,
        elevation: 0,
    },
});

export default ChatRoomScreen;