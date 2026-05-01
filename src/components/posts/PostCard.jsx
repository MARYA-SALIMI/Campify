import { BookOpen, Megaphone, MessageCircle, MoreVertical, Pencil, Search, Trash2, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EditPostModal from './EditPostModal';

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

    // GÜVENLİK: Menüyü yalnızca gönderi sahibi görür
    const isOwner = post?.authorId === currentUserId;

    const catKey = getCategoryKey(post);
    const meta = CATEGORY_META[catKey];
    const Icon = meta.icon;

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
                        {isOwner ? (currentUserName?.trim() ? currentUserName : 'Sen') : (post?.authorName || 'Anonim')}
                    </Text>

                    {/* 🚪 MELİSA İÇİN KAPI: Yorum butonu — Melisa kendi kodlarını buraya bağlayacak */}
                    <TouchableOpacity
                        style={styles.commentBtn}
                        onPress={() => console.log('Melisa: Yorumlar açılacak')}
                        activeOpacity={0.7}
                        hitSlop={6}
                    >
                        <MessageCircle size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.commentCount}>{post?.commentCount ?? 0}</Text>
                    </TouchableOpacity>

                    <Text style={styles.createdAt}>{formatDate(post?.createdAt)}</Text>
                </View>
            </View>

            {/* ── Düzenle / Sil Açılır Menüsü ── */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleEdit}
                            activeOpacity={0.75}
                        >
                            <Pencil size={16} color="#A3E635" strokeWidth={2} />
                            <Text style={styles.menuItemText}>Düzenle</Text>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleDelete}
                            activeOpacity={0.75}
                        >
                            <Trash2 size={16} color="#F43F5E" strokeWidth={2} />
                            <Text style={[styles.menuItemText, { color: '#F43F5E' }]}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
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
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        paddingVertical: 6,
        width: 180,
        borderWidth: 1,
        borderColor: '#2D3748',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#E5E7EB',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#2D3748',
        marginHorizontal: 12,
    },
});