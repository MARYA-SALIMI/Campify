import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import PostList from '../../components/posts/PostList';

// ── Filtreler — görseldeki sıra ve renkler birebir ─────────────────────────
const FILTERS = [
    { key: 'all', label: 'Tümü', color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: '◆' },
    { key: 'book', label: 'Kitap İlanı', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: '📚' },
    { key: 'team', label: 'Ekip Arama', color: '#A855F7', bg: 'rgba(168,85,247,0.15)', icon: '👥' },
    { key: 'announcement', label: 'Duyuru', color: '#F43F5E', bg: 'rgba(244,63,94,0.15)', icon: '📢' },
    { key: 'lost', label: 'Kayıp Eşya', color: '#0EA5E9', bg: 'rgba(14,165,233,0.15)', icon: '💬' },
];

// ── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_POSTS = [
    {
        id: '1',
        type: 'book',
        title: 'raket sporları topluluğu',
        content: 'etkinliğimize herkesi bekleriz',
        author: { name: 'Kampüs', username: 'kampüs' },
        commentCount: 0,
        createdAt: new Date('2026-04-08T13:10:45').toISOString(),
    },
    {
        id: '2',
        type: 'book',
        title: 'teknofest',
        content: 'ekip arkadaşı arıyorum',
        author: { name: 'Kampüs', username: 'kampüs' },
        commentCount: 2,
        createdAt: new Date('2026-04-08T13:10:17').toISOString(),
    },
    {
        id: '3',
        type: 'book',
        title: 'kimlik kaybettim',
        content: 'dogru ilan başlığında yayınlıyorum',
        author: { name: 'Kampüs', username: 'kampüs' },
        commentCount: 0,
        createdAt: new Date('2026-04-08T13:09:49').toISOString(),
    },
    {
        id: '4',
        type: 'team',
        title: 'TechBridge Hackathon Takımı',
        content: 'ML ve React bilen arkadaşlar başvurabilir.',
        author: { name: 'Selin Yıldız', username: 'seliny' },
        commentCount: 11,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: '5',
        type: 'announcement',
        title: 'Google Yaz Stajı Başvuruları',
        content: '3. ve 4. sınıf öğrencileri başvurabilir. Son tarih 10 Nisan.',
        author: { name: 'İTÜ Kariyer', username: 'itu_kariyer' },
        commentCount: 17,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        id: '6',
        type: 'lost',
        title: 'Kırmızı Stanley Termos',
        content: 'Kütüphane 2. katta unuttu. Son görülen: Masa 14B.',
        author: { name: 'Deniz Avcı', username: 'deniz_cs' },
        commentCount: 8,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
];

const HomeScreen = () => {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('all');
    const [posts] = useState(MOCK_POSTS);

    const filteredPosts =
        activeFilter === 'all'
            ? posts
            : posts.filter((p) => p.type === activeFilter);

    // 🚪 MELİSA İÇİN KAPI: Gönderi oluşturma
    const handleCreatePost = () => {
        console.log('Melisa: Gönderi oluşturma sayfasına yönlendirme buraya bağlanacak');
    };

    const ListHeader = (
        <View style={styles.filterWrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
            >
                {FILTERS.map((f) => {
                    const isActive = activeFilter === f.key;
                    return (
                        <TouchableOpacity
                            key={f.key}
                            style={[
                                styles.pill,
                                isActive && { backgroundColor: f.bg, borderColor: f.color },
                            ]}
                            onPress={() => setActiveFilter(f.key)}
                            activeOpacity={0.75}
                        >
                            <Text style={styles.pillIcon}>{f.icon}</Text>
                            <Text style={[styles.pillText, isActive && { color: f.color }]}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

            {/* ── Header ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.logo}>Campify</Text>
                    <Text style={styles.logoSub}>Sana uygun gönderileri bul veya kendi gönderini paylaş</Text>
                </View>
                {/* Görseldeki yeşil "Gönderi Oluştur" butonu */}
                <TouchableOpacity
                    style={styles.createBtn}
                    onPress={handleCreatePost}
                    activeOpacity={0.8}
                >
                    <Plus size={16} color="#000" strokeWidth={3} />
                    <Text style={styles.createBtnText}>Gönderi Oluştur</Text>
                </TouchableOpacity>
            </View>

            {/* ── Feed ── */}
            <PostList
                posts={filteredPosts}
                onPostPress={(post) => router.push({ pathname: '/PostDetail', params: { id: post.id } })}
                ListHeaderComponent={ListHeader}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#21262D',
        gap: 12,
    },
    logo: {
        fontSize: 26,
        fontWeight: '800',
        color: '#10B981',   // Orijinal yeşil — turuncu DEĞİL
        letterSpacing: -0.8,
    },
    logoSub: {
        fontSize: 11,
        color: '#4B5563',
        marginTop: 3,
        lineHeight: 15,
        maxWidth: 200,
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#10B981',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
        flexShrink: 0,
    },
    createBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#000',
        letterSpacing: -0.2,
    },

    // Filtreler
    filterWrapper: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#21262D',
    },
    filterScroll: {
        paddingHorizontal: 16,
        gap: 8,
        flexDirection: 'row',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 100,
        backgroundColor: '#161B22',
        borderWidth: 1,
        borderColor: '#21262D',
    },
    pillIcon: {
        fontSize: 12,
    },
    pillText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
});

export default HomeScreen;
