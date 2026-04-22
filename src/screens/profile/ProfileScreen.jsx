import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Settings, Grid3x3, BookMarked, Star } from 'lucide-react-native';
import PostCard from '../../components/posts/PostCard';
import EditPostModal from '../../components/posts/EditPostModal';
import { getAllPosts, updatePost, deletePost } from '../../services/postService';

// Kurgusal mevcut kullanıcı — gerçekte AuthContext/AsyncStorage'dan gelir
const MOCK_CURRENT_USER = {
    id: 'current-user-id',
    name: 'Sinem Yıldız',
    username: '@sinem.yildiz',
    department: 'Bilgisayar Mühendisliği',
    year: '3. Sınıf',
    bio: 'Kampüs hayatını seven, kod yazan, kahve içen biri ☕',
    followersCount: 142,
    followingCount: 89,
};

const StatBox = ({ label, value }) => (
    <View style={styles.statBox}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const ProfileScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const fetchMyPosts = async () => {
        try {
            const allPosts = await getAllPosts();
            // Sadece mevcut kullanıcıya ait gönderileri filtrele
            const myPosts = allPosts.filter(
                (p) =>
                    p.author?._id === MOCK_CURRENT_USER.id ||
                    p.author?.id === MOCK_CURRENT_USER.id
            );
            setPosts(myPosts);
        } catch (e) {
            console.error('fetchMyPosts error:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchMyPosts();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMyPosts();
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setEditingPost(null);
    };

    const handleSubmit = async (formData) => {
        if (editingPost) {
            const updated = await updatePost(editingPost._id || editingPost.id, formData);
            setPosts((prev) =>
                prev.map((p) =>
                    (p._id || p.id) === (editingPost._id || editingPost.id) ? updated : p
                )
            );
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((p) => (p._id || p.id) !== postId));
        } catch (e) {
            console.error('deletePost error:', e);
        }
    };

    const ProfileHeader = () => (
        <View style={styles.profileHeader}>
            {/* Ayarlar butonu */}
            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
                <Settings size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <View style={styles.avatarRing}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {MOCK_CURRENT_USER.name.split(' ').map((n) => n[0]).join('')}
                        </Text>
                    </View>
                </View>
                <View style={styles.verifiedBadge}>
                    <Star size={10} color="#fff" fill="#fff" />
                </View>
            </View>

            {/* İsim & Kullanıcı adı */}
            <Text style={styles.profileName}>{MOCK_CURRENT_USER.name}</Text>
            <Text style={styles.profileUsername}>{MOCK_CURRENT_USER.username}</Text>

            {/* Departman etiketi */}
            <View style={styles.departmentTag}>
                <Text style={styles.departmentText}>
                    {MOCK_CURRENT_USER.department} · {MOCK_CURRENT_USER.year}
                </Text>
            </View>

            {/* Bio */}
            <Text style={styles.bio}>{MOCK_CURRENT_USER.bio}</Text>

            {/* İstatistikler */}
            <View style={styles.statsRow}>
                <StatBox label="Gönderi" value={posts.length} />
                <View style={styles.statDivider} />
                <StatBox label="Takipçi" value={MOCK_CURRENT_USER.followersCount} />
                <View style={styles.statDivider} />
                <StatBox label="Takip" value={MOCK_CURRENT_USER.followingCount} />
            </View>

            {/* Gönderiler başlığı */}
            <View style={styles.sectionHeader}>
                <Grid3x3 size={15} color="#10B981" />
                <Text style={styles.sectionTitle}>Gönderilerim</Text>
                <BookMarked size={15} color="#6B7280" style={{ marginLeft: 'auto' }} />
            </View>
        </View>
    );

    const renderPost = ({ item }) => (
        <PostCard
            post={item}
            currentUserId={MOCK_CURRENT_USER.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isProfileView={true} // ✅ Profil görünümü aktif → Düzenle/Sil ikonları görünür
        />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Grid3x3 size={40} color="#374151" />
            <Text style={styles.emptyTitle}>Henüz gönderin yok</Text>
            <Text style={styles.emptySubtitle}>
                Ana sayfadan ilk gönderini paylaşmaya başla!
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#111827" />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Profil yükleniyor...</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => String(item._id || item.id)}
                    renderItem={renderPost}
                    ListHeaderComponent={<ProfileHeader />}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#10B981"
                            colors={['#10B981']}
                        />
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <EditPostModal
                visible={modalVisible}
                onClose={handleModalClose}
                onSubmit={handleSubmit}
                post={editingPost}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 40,
    },

    // --- Profil Header ---
    profileHeader: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
        position: 'relative',
    },
    settingsBtn: {
        position: 'absolute',
        top: 16,
        right: 20,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 14,
        marginTop: 8,
    },
    avatarRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 3,
        borderColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#064E3B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#34D399',
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -1,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#111827',
    },
    profileName: {
        color: '#F3F4F6',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.4,
    },
    profileUsername: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 3,
        marginBottom: 10,
    },
    departmentTag: {
        backgroundColor: '#1F2937',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#374151',
        marginBottom: 10,
    },
    departmentText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '500',
    },
    bio: {
        color: '#D1D5DB',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 20,
        maxWidth: '85%',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#1F2937',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#374151',
        paddingVertical: 14,
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
    },
    statValue: {
        color: '#F3F4F6',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    statLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#374151',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        gap: 7,
    },
    sectionTitle: {
        color: '#F3F4F6',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
        gap: 10,
    },
    emptyTitle: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 6,
    },
    emptySubtitle: {
        color: '#4B5563',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default ProfileScreen;