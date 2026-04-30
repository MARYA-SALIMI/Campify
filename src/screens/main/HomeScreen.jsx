import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import PostList from '../../components/posts/PostList';
import EditPostModal from '../../components/posts/EditPostModal';

const BASE_URL = 'https://campify-api-l1vf.onrender.com/api';

const FILTERS = [
    { key: 'all', label: 'Tümü', color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: '◆' },
    { key: 'book', label: 'Kitap İlanı', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: '📚' },
    { key: 'team', label: 'Ekip Arama', color: '#A855F7', bg: 'rgba(168,85,247,0.15)', icon: '👥' },
    { key: 'announcement', label: 'Duyuru', color: '#F43F5E', bg: 'rgba(244,63,94,0.15)', icon: '📢' },
    { key: 'lost', label: 'Kayıp Eşya', color: '#0EA5E9', bg: 'rgba(14,165,233,0.15)', icon: '💬' },
];

const CURRENT_USER_ID = '60d0fe4f5311236168a109ca';
const CURRENT_USER = { name: 'Sinem', username: 'sinem' };

const HomeScreen = () => {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('all');
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/posts`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            const raw = Array.isArray(data) ? data : data.posts ?? [];

            const normalized = raw.map((p) => ({
                ...p,
                id: p._id ?? p.id,
                type: p.tags?.[0] ?? 'announcement',
                authorId: p.userId, // 🎯 3 NOKTA ÇÖZÜMÜ: Backend'den gelen userId'yi authorId'ye çevirdik
            }));

            setPosts(normalized);
        } catch (error) {
            console.error('Gönderiler çekilemedi:', error);
            Alert.alert('Hata', 'Gönderiler yüklenirken bir sorun oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const filteredPosts = activeFilter === 'all'
        ? posts
        : posts.filter((p) => p.type === activeFilter);

    const handleOpenCreate = () => {
        setModalVisible(true);
    };

    const handlePostSubmit = async (postData) => {
        const resolvedType = postData.type ?? postData.category ?? 'announcement';

        const payload = {
            title: postData.title,
            content: postData.content,
            userId: CURRENT_USER_ID,
            tags: [resolvedType],
        };

        try {
            const response = await fetch(`${BASE_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const createdPost = await response.json();

            const newPost = {
                ...createdPost,
                id: createdPost._id ?? createdPost.id,
                type: createdPost.tags?.[0] ?? resolvedType,
                authorId: CURRENT_USER_ID, // 🎯 3 NOKTA ÇÖZÜMÜ
                author: createdPost.author ?? {
                    name: CURRENT_USER.name,
                    username: CURRENT_USER.username,
                },
                commentCount: createdPost.commentCount ?? 0,
            };

            setPosts((prev) => [newPost, ...prev]);
            setModalVisible(false);
        } catch (error) {
            console.error('Gönderi oluşturulamadı:', error);
            Alert.alert('Hata', 'Gönderi paylaşılırken bir sorun oluştu.');
        }
    };

    // ── GÖREV 1: Güncelleme — PUT /posts/:id ─────────────────────────────
    const handleUpdate = async (postId, updatedData) => {
        // Modal'dan gelen category verisini backend'in anladığı 'tags' formatına çeviriyoruz
        const resolvedType = updatedData.category ?? updatedData.type ?? 'announcement';

        const payload = {
            title: updatedData.title,
            content: updatedData.content,
            tags: [resolvedType],
        };

        try {
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const savedPost = await response.json();

            // Backend'den dönen veriyi ekrana uygun hale getiriyoruz
            const normalized = {
                ...savedPost,
                id: savedPost._id ?? savedPost.id,
                type: savedPost.tags?.[0] ?? resolvedType,
                authorId: savedPost.userId ?? CURRENT_USER_ID,
            };

            // Sadece güncellenen postu bul ve değiştir
            setPosts((prev) =>
                prev.map((p) => (p.id === postId ? { ...p, ...normalized } : p))
            );
            console.log('Gönderi güncellendi:', normalized);
        } catch (error) {
            console.error('Gönderi güncellenemedi:', error);
            Alert.alert('Hata', 'Gönderi güncellenirken bir sorun oluştu.');
        }
    };

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            setPosts((prev) => prev.filter((p) => p.id !== postId));
        } catch (error) {
            console.error('Gönderi silinemedi:', error);
            Alert.alert('Hata', 'Gönderi silinirken bir sorun oluştu.');
        }
    };

    const ListHeader = (
        <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {FILTERS.map((f) => {
                    const isActive = activeFilter === f.key;
                    return (
                        <TouchableOpacity
                            key={f.key}
                            style={[styles.pill, isActive && { backgroundColor: f.bg, borderColor: f.color }]}
                            onPress={() => setActiveFilter(f.key)}
                            activeOpacity={0.75}
                        >
                            <Text style={styles.pillIcon}>{f.icon}</Text>
                            <Text style={[styles.pillText, isActive && { color: f.color }]}>{f.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.logo}>Campify</Text>
                    <Text style={styles.logoSub}>Sana uygun gönderileri bul veya kendi gönderini paylaş</Text>
                </View>
                <TouchableOpacity style={styles.createBtn} onPress={handleOpenCreate} activeOpacity={0.8}>
                    <Plus size={16} color="#000" strokeWidth={3} />
                    <Text style={styles.createBtnText}>Gönderi Oluştur</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Gönderiler yükleniyor...</Text>
                </View>
            ) : (
                <PostList
                    posts={filteredPosts}
                    onPostPress={(post) => router.push({ pathname: '/PostDetail', params: { id: post.id } })}
                    ListHeaderComponent={ListHeader}
                    currentUserId={CURRENT_USER_ID}
                    onDeletePost={handleDelete} // 🎯 DOĞRU PROP İSİMLERİ
                    onUpdatePost={handleUpdate} // 🎯 DOĞRU PROP İSİMLERİ
                />
            )}

            <EditPostModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handlePostSubmit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D1117' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#21262D', gap: 12, zIndex: 10, elevation: 10 },
    logo: { fontSize: 26, fontWeight: '800', color: '#10B981', letterSpacing: -0.8 },
    logoSub: { fontSize: 11, color: '#4B5563', marginTop: 3, lineHeight: 15, maxWidth: 200 },
    createBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B981', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, flexShrink: 0 },
    createBtnText: { fontSize: 13, fontWeight: '800', color: '#000', letterSpacing: -0.2 },
    filterWrapper: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#21262D' },
    filterScroll: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
    pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D' },
    pillIcon: { fontSize: 12 },
    pillText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
});

export default HomeScreen;