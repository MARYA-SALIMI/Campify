import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    StatusBar, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
// 🎯 DEĞİŞTİRİLDİ: expo-router yerine useNavigation geldi
import { useNavigation } from '@react-navigation/native';
import { MessageSquarePlus, ChevronRight } from 'lucide-react-native';

const BASE_URL = 'https://campify-api-l1vf.onrender.com/api';
const CURRENT_USER_ID = '60d0fe4f5311236168a109ca';

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${diffMins}d`;
    if (diffHours < 24) return `${diffHours}s`;
    if (diffDays === 1) return 'Dün';
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

const normalizeChat = (raw) => {
    const otherId = raw.participants?.find((id) => id !== CURRENT_USER_ID) ?? null;
    const shortId = otherId ? otherId.slice(-4).toUpperCase() : '????';

    return {
        id: raw._id ?? raw.id,
        otherUser: {
            id: otherId,
            name: `Kampüs Sakini`,
            username: `@kullanici_${shortId}`,
        },
        lastMessage: {
            content: raw.lastMessage?.content ?? 'Henüz mesaj yok',
            createdAt: raw.updatedAt ?? raw.createdAt ?? null,
        },
        unreadCount: raw.unreadCount ?? 0,
        isOnline: false,
    };
};

const ChatListScreen = () => {
    // 🎯 DEĞİŞTİRİLDİ: router yerine navigation kullanıyoruz
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChats = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/chats`);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error('BACKEND HATASI [GET /chats]:', errData);
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            const raw = Array.isArray(data) ? data : data.data ?? [];
            setChats(raw.map(normalizeChat));
            console.log('Sohbetler yüklendi:', raw.length, 'adet');
        } catch (error) {
            console.error('Sohbetler çekilemedi:', error);
            Alert.alert('Hata', 'Sohbetler yüklenirken bir sorun oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    const handleNewChat = () => {
        console.log('Melisa: Sohbet oluşturma modalı buraya bağlanacak');
    };

    const handleChatPress = (item) => {
        setChats((prev) =>
            prev.map((chat) =>
                chat.id === item.id ? { ...chat, unreadCount: 0 } : chat
            )
        );

        // 🎯 DEĞİŞTİRİLDİ: Takımınızın standart yönlendirme komutu eklendi
        navigation.navigate('ChatRoomScreen', {
            id: item.id,
            name: item.otherUser?.name ?? 'Sohbet',
        });
    };

    const renderChat = ({ item }) => {
        const hasUnread = item.unreadCount > 0;
        return (
            <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)} activeOpacity={0.75}>
                {hasUnread && <View style={styles.unreadStrip} />}
                <View style={styles.avatarWrapper}>
                    <View style={[styles.avatar, hasUnread && styles.avatarActive]}>
                        <Text style={[styles.avatarText, hasUnread && styles.avatarTextActive]}>
                            {getInitials(item.otherUser?.name)}
                        </Text>
                    </View>
                    {item.isOnline && <View style={styles.onlineDot} />}
                </View>

                <View style={styles.chatContent}>
                    <View style={styles.chatTop}>
                        <Text style={[styles.chatName, hasUnread && styles.chatNameBold]}>
                            {item.otherUser?.name}
                        </Text>
                        <Text style={[styles.chatTime, hasUnread && styles.chatTimeOrange]}>
                            {formatTime(item.lastMessage?.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.chatBottom}>
                        <Text style={[styles.lastMsg, hasUnread && styles.lastMsgBold]} numberOfLines={1} ellipsizeMode="tail">
                            {item.lastMessage?.content}
                        </Text>
                        {hasUnread ? (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.unreadCount}</Text>
                            </View>
                        ) : (
                            <ChevronRight size={14} color="#374151" />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderSeparator = () => <View style={styles.separator} />;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Mesajlar</Text>
                    <Text style={styles.headerSubtitle}>
                        {isLoading ? 'Yükleniyor...' : `${chats.length} aktif sohbet`}
                    </Text>
                </View>
                <TouchableOpacity style={styles.newChatBtn} onPress={handleNewChat} activeOpacity={0.7}>
                    <MessageSquarePlus size={20} color="#F97316" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F97316" />
                    <Text style={styles.loadingText}>Sohbetler yükleniyor...</Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChat}
                    ItemSeparatorComponent={renderSeparator}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D1117' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#21262D' },
    headerTitle: { color: '#F3F4F6', fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
    headerSubtitle: { color: '#4B5563', fontSize: 12, marginTop: 2 },
    newChatBtn: { padding: 10, borderRadius: 12, backgroundColor: '#161B22', borderWidth: 1, borderColor: 'rgba(249,115,22,0.3)' },
    listContent: { paddingVertical: 6 },
    chatItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12, position: 'relative' },
    unreadStrip: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 0, backgroundColor: '#F97316', borderTopRightRadius: 2, borderBottomRightRadius: 2 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#161B22', borderWidth: 2, borderColor: '#21262D', alignItems: 'center', justifyContent: 'center' },
    avatarActive: { borderColor: '#F97316', backgroundColor: 'rgba(249,115,22,0.08)' },
    avatarText: { color: '#6B7280', fontWeight: '700', fontSize: 15 },
    avatarTextActive: { color: '#F97316' },
    onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2.5, borderColor: '#0D1117' },
    chatContent: { flex: 1, gap: 5 },
    chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    chatName: { color: '#9CA3AF', fontSize: 15, fontWeight: '500' },
    chatNameBold: { color: '#F3F4F6', fontWeight: '700' },
    chatTime: { color: '#374151', fontSize: 11 },
    chatTimeOrange: { color: '#F97316', fontWeight: '600' },
    chatBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    lastMsg: { color: '#4B5563', fontSize: 13, flex: 1, marginRight: 8 },
    lastMsgBold: { color: '#9CA3AF', fontWeight: '500' },
    badge: { backgroundColor: '#F97316', borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, shadowColor: '#F97316', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 3 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    separator: { height: 1, backgroundColor: '#161B22', marginLeft: 80 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
});

export default ChatListScreen;