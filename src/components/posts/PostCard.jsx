import { BookOpen, Megaphone, MessageCircle, MoreVertical, Pencil, Search, Trash2, Users, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import commentService from '../../services/commentService';
import CommentsModal from '../comments/CommentsModal';
import EditPostModal from './EditPostModal';
import { authService } from '../../services/authService';

// console.log('Melisa: Profil sayfasında kullanıcı avatarı ve gönderi sayısı buradan gelecek')

/**
 * CATEGORY_META anahtarları EditPostModal'daki id'lerle BİREBİR eşleşiyor:
 * 'book' | 'team' | 'announcement' | 'lost'
 *
 * post.category veya post.type üzerinden otomatik algılanır —
 * her iki alan adı da aşağıdaki getCategoryKey() ile normalize edilir.
 */
const CATEGORY_META = {
    book: {
        label: 'Kitap İlanı',
        color: '#F59E0B',
        bg: 'rgba(245,158,11,0.12)',
        icon: BookOpen,
    },
    team: {
        label: 'Ekip Arama',
        color: '#A855F7',
        bg: 'rgba(168,85,247,0.12)',
        icon: Users,
    },
    announcement: {
        label: 'Duyuru',
        color: '#F43F5E',
        bg: 'rgba(244,63,94,0.12)',
        icon: Megaphone,
    },
    lost: {
        label: 'Kayıp Eşya',
        color: '#0EA5E9',
        bg: 'rgba(14,165,233,0.12)',
        icon: Search,
    },
};

/**
 * createdAt değerini sadece tarih olarak formatlar — saat gösterilmez.
 * Örnek çıktı: "10 Nisan 2026"
 * ISO string, timestamp (number) veya Date nesnesi kabul eder.
 */
const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Gelen post objesinde hem `category` hem `type` alanı olabilir.
 * İkisini de kontrol ederek geçerli bir CATEGORY_META anahtarı döndürür.
 * Eşleşme yoksa 'announcement' varsayılanına düşer.
 */
const getCategoryKey = (post) => {
    const raw = post?.category || post?.type || '';
    return CATEGORY_META[raw] ? raw : 'announcement';
};

/**
 * PostCard — Tek bir gönderiyi gösteren kart bileşeni
 *
 * Props:
 * @param {object}   post          — { id, category|type, title, content, authorId, authorName, createdAt }
 * @param {string}   currentUserId — Aktif kullanıcının ID'si (sahiplik kontrolü)
 * @param {function} onUpdate      — (postId, updatedData) => void
 * @param {function} onDelete      — (postId) => void
 */
export default function PostCard({ post, currentUserId, currentUserName, onUpdate, onDelete }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [localCommentCount, setLocalCommentCount] = useState(post?.commentCount ?? 0);
    const [fetchedAuthorName, setFetchedAuthorName] = useState(null);

    React.useEffect(() => {
        const fetchInitialCommentCount = async () => {
            const id = post?.id || post?._id;
            if (id) {
                try {
                    const comments = await commentService.getComments(id);
                    setLocalCommentCount(comments.length);
                } catch (error) {
                    // Hata olursa sessizce geç
                }
            }
        };

        if (post?.commentCount !== undefined && post?.commentCount !== null && post?.commentCount !== 0) {
            setLocalCommentCount(post.commentCount);
        } else {
            // Backend'den sayıyı çek
            fetchInitialCommentCount();
        }

        // Eğer backend bize sadece string ID gönderdiyse profil servisine sor:
        const authorIdStr = typeof post?.userId === 'string' ? post.userId : 
                            (typeof post?.authorId === 'string' ? post.authorId : null);
        if (authorIdStr && !post?.userId?.ad && !post?.userId?.firstName && !post?.authorId?.ad) {
            console.log(`[PostCard] Profil çekiliyor: ${authorIdStr}`);
            authService.getProfile(authorIdStr)
                .then(profile => {
                    console.log(`[PostCard] Profil geldi:`, profile?.name || profile?.username || profile?.ad || "İsimsiz");
                    if (profile?.ad || profile?.soyad) {
                        setFetchedAuthorName(`${profile.ad || ''} ${profile.soyad || ''}`.trim());
                    } else if (profile?.firstName || profile?.lastName) {
                        setFetchedAuthorName(`${profile.firstName || ''} ${profile.lastName || ''}`.trim());
                    } else if (profile?.name) {
                        setFetchedAuthorName(profile.name);
                    } else if (profile?.username) {
                        setFetchedAuthorName(profile.username);
                    }
                })
                .catch(err => {
                    console.log(`[PostCard] Profil çekme HATASI:`, err.message);
                });
        }

    }, [post?.id, post?._id, post?.commentCount, post?.userId, post?.authorId]);

    // GÜVENLİK: Menüyü yalnızca gönderi sahibi görür
    const postAuthorId = post?.authorId?._id || post?.authorId || post?.author?._id || post?.user?._id;
    const actualCurrentUserId = currentUserId?._id || currentUserId?.id || currentUserId;
    const isOwner = postAuthorId && actualCurrentUserId &&
        String(postAuthorId).trim().toLowerCase() === String(actualCurrentUserId).trim().toLowerCase();

    const catKey = getCategoryKey(post);
    const meta = CATEGORY_META[catKey];
    const Icon = meta.icon;

    console.log('POST OBJ KEYS:', Object.keys(post || {}));
    console.log(`[PostCard] isOwner: ${isOwner}, currentUserName: "${currentUserName}"`);

    const handleEdit = () => {
        setMenuVisible(false);
        // Kısa gecikme: menü kapanma animasyonu tamamlansın
        setTimeout(() => setEditModalVisible(true), 150);
    };

    const handleDelete = () => {
        setMenuVisible(false);
        onDelete && onDelete(post.id);
    };

    const handleUpdate = (updatedData) => {
        onUpdate && onUpdate(post.id, updatedData);
    };

    return (
        <>
            <View style={styles.card}>
                {/* ── Üst Satır: Kategori Etiketi + 3 Nokta (sadece sahibe) ── */}
                <View style={styles.topRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: meta.bg }]}>
                        <Icon size={12} color={meta.color} strokeWidth={2.5} />
                        <Text style={[styles.categoryText, { color: meta.color }]}>{meta.label}</Text>
                    </View>

                    {isOwner && (
                        <TouchableOpacity
                            onPress={() => setMenuVisible(true)}
                            style={styles.moreButton}
                            hitSlop={8}
                            activeOpacity={0.7}
                        >
                            <MoreVertical size={18} color="#6B7280" strokeWidth={2} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Başlık ── */}
                <Text style={styles.title} numberOfLines={2}>{post?.title}</Text>

                {/* ── İçerik ── */}
                <Text style={styles.content} numberOfLines={3}>{post?.content}</Text>

                {/* ── Footer: Yazar | Yorum Butonu | Tarih ── */}
                <View style={styles.footer}>
                    <Text style={styles.authorName}>
                        {fetchedAuthorName ||
                            (post?.userId?.firstName ? `${post.userId.firstName} ${post.userId.lastName || ''}` : null) ||
                            (post?.userId?.ad ? `${post.userId.ad} ${post.userId.soyad || ''}` : null) ||
                            (post?.authorId?.firstName ? `${post.authorId.firstName} ${post.authorId.lastName || ''}` : null) ||
                            (post?.authorId?.ad ? `${post.authorId.ad} ${post.authorId.soyad || ''}` : null) ||
                            (post?.author?.firstName ? `${post.author.firstName} ${post.author.lastName || ''}` : null) ||
                            (post?.author?.ad ? `${post.author.ad} ${post.author.soyad || ''}` : null) ||
                            (post?.user?.firstName ? `${post.user.firstName} ${post.user.lastName || ''}` : null) ||
                            (post?.user?.ad ? `${post.user.ad} ${post.user.soyad || ''}` : null) ||
                            (isOwner && currentUserName !== 'Kullanıcı' ? currentUserName : null) ||
                            post?.userId?.name ||
                            post?.userId?.username ||
                            post?.authorName ||
                            post?.author?.name ||
                            post?.author?.username ||
                            post?.authorId?.name ||
                            post?.authorId?.username ||
                            post?.user?.name ||
                            post?.user?.username ||
                            '...'}
                    </Text>

                    {/* Yorum butonu — CommentsModal'ı açar */}
                    <TouchableOpacity
                        style={styles.commentBtn}
                        onPress={() => setCommentsVisible(true)}
                        activeOpacity={0.7}
                        hitSlop={6}
                    >
                        <MessageCircle size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.commentCount}>{localCommentCount}</Text>
                    </TouchableOpacity>

                    <Text style={styles.createdAt}>{formatDate(post?.createdAt)}</Text>
                </View>
            </View>

            {/* ── Instagram Tarzı Düzenle / Sil Açılır Menüsü ── */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.menuBackdrop}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.instagramMenu}>
                        <View style={styles.menuIndicator} />

                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Gönderi Seçenekleri</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.instagramMenuItem}
                            onPress={handleEdit}
                        >
                            <View style={[styles.menuIconBg, { backgroundColor: 'rgba(163,230,53,0.1)' }]}>
                                <Pencil size={20} color="#A3E635" />
                            </View>
                            <Text style={styles.instagramMenuText}>Gönderiyi Düzenle</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.instagramMenuItem}
                            onPress={handleDelete}
                        >
                            <View style={[styles.menuIconBg, { backgroundColor: 'rgba(244,63,94,0.1)' }]}>
                                <Trash2 size={20} color="#F43F5E" />
                            </View>
                            <Text style={[styles.instagramMenuText, { color: '#F43F5E' }]}>Gönderiyi Sil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.instagramMenuItem, { marginTop: 10 }]}
                            onPress={() => setMenuVisible(false)}
                        >
                            <View style={[styles.menuIconBg, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                                <X size={20} color="#9CA3AF" />
                            </View>
                            <Text style={[styles.instagramMenuText, { color: '#9CA3AF' }]}>Vazgeç</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* ── Düzenleme Modalı ── */}
            <EditPostModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleUpdate}
                initialData={{
                    category: catKey,       // normalize edilmiş key kullanılıyor
                    title: post?.title,
                    content: post?.content,
                }}
            />

            {/* ── Yorumlar Modalı ── */}
            <CommentsModal
                visible={commentsVisible}
                onClose={() => setCommentsVisible(false)}
                postId={post?.id || post?._id}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                postOwnerId={post?.authorId}
                onCommentCountChange={(count) => setLocalCommentCount(count)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#161B22',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#21293A',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    moreButton: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F9FAFB',
        marginBottom: 6,
        lineHeight: 22,
    },
    content: {
        fontSize: 14,
        color: '#9CA3AF',
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#21293A',
        paddingTop: 10,
    },
    authorName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    commentBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    commentCount: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    createdAt: {
        fontSize: 12,
        color: '#4B5563',
    },
    menuBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    instagramMenu: {
        backgroundColor: '#161B22',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: '#30363D',
    },
    menuIndicator: {
        width: 36,
        height: 4,
        backgroundColor: '#30363D',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20
    },
    menuHeader: {
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#30363D',
        marginBottom: 10
    },
    menuTitle: {
        color: '#F9FAFB',
        fontSize: 16,
        fontWeight: '700'
    },
    instagramMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 15
    },
    menuIconBg: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center'
    },
    instagramMenuText: {
        color: '#F9FAFB',
        fontSize: 16,
        fontWeight: '600'
    },
});