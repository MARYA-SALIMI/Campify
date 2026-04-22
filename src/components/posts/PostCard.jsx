import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BookOpen, Megaphone, Users, AlertCircle, MessageCircle } from 'lucide-react-native';

const CATEGORY_CONFIG = {
    book: {
        label: 'KİTAP İLANI',
        icon: BookOpen,
        color: '#F59E0B',
        bg: 'rgba(245,158,11,0.15)',
        strip: '#F59E0B',
    },
    team: {
        label: 'EKİP ARAMA',
        icon: Users,
        color: '#A855F7',
        bg: 'rgba(168,85,247,0.15)',
        strip: '#A855F7',
    },
    announcement: {
        label: 'DUYURU',
        icon: Megaphone,
        color: '#F43F5E',
        bg: 'rgba(244,63,94,0.15)',
        strip: '#F43F5E',
    },
    lost: {
        label: 'KAYIP EŞYA',
        icon: AlertCircle,
        color: '#0EA5E9',
        bg: 'rgba(14,165,233,0.15)',
        strip: '#0EA5E9',
    },
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hour}:${min}`;
};

const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const PostCard = ({ post, onPress }) => {
    const type = post?.type || 'announcement';
    const cat = CATEGORY_CONFIG[type] || CATEGORY_CONFIG.announcement;
    const CatIcon = cat.icon;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress?.(post)}
            activeOpacity={0.78}
        >
            {/* Sol renkli şerit */}
            <View style={[styles.strip, { backgroundColor: cat.strip }]} />

            <View style={styles.inner}>
                {/* Üst satır: rozet + tarih */}
                <View style={styles.topRow}>
                    <View style={[styles.badge, { backgroundColor: cat.bg }]}>
                        <CatIcon size={11} color={cat.color} strokeWidth={2.5} />
                        <Text style={[styles.badgeText, { color: cat.color }]}>{cat.label}</Text>
                    </View>
                    <Text style={styles.timeText}>{formatTime(post?.createdAt)}</Text>
                </View>

                {/* Başlık */}
                {post?.title ? (
                    <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
                ) : null}

                {/* İçerik */}
                {post?.content ? (
                    <Text style={styles.content} numberOfLines={2}>{post.content}</Text>
                ) : null}

                {/* Alt: yazar + yorum (beğeni YOK) */}
                <View style={styles.footer}>
                    <View style={styles.authorRow}>
                        <View style={[styles.authorAvatar, { backgroundColor: cat.bg }]}>
                            <Text style={[styles.avatarText, { color: cat.color }]}>
                                {getInitials(post?.author?.name || 'K')}
                            </Text>
                        </View>
                        <Text style={styles.authorHandle}>
                            @{post?.author?.username || 'kampüs'}
                        </Text>
                    </View>

                    {post?.commentCount > 0 && (
                        <View style={styles.commentRow}>
                            <MessageCircle size={13} color="#4B5563" strokeWidth={2} />
                            <Text style={styles.commentCount}>{post.commentCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#161B22',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#21262D',
    },
    strip: {
        width: 4,
        flexShrink: 0,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 13,
        gap: 7,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 100,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.4,
    },
    timeText: {
        fontSize: 11,
        color: '#4B5563',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#F3F4F6',
        lineHeight: 21,
        letterSpacing: -0.2,
    },
    content: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    authorAvatar: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 9,
        fontWeight: '800',
    },
    authorHandle: {
        fontSize: 12,
        color: '#6B7280',
    },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    commentCount: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '600',
    },
});

export default PostCard;