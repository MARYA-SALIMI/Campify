import { Check, Heart, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../../services/authService';

const formatCommentTime = (dateString) => {
    if (!dateString) return 'Şimdi';
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'şimdi';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}d`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}s`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}g`;

    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

export default function CommentItem({ comment, currentUserId, currentUserName, postOwnerId, onDelete, onUpdate, onLike, onReply, isReply }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [showActions, setShowActions] = useState(false);
    const [showLikers, setShowLikers] = useState(false);
    const [fetchedAuthorName, setFetchedAuthorName] = useState(null);

    useEffect(() => {
        const authorIdStr = typeof comment?.authorId === 'string' ? comment.authorId :
            (typeof comment?.userId === 'string' ? comment.userId : null);
        if (authorIdStr && !comment?.authorId?.ad && !comment?.authorId?.firstName) {
            console.log(`[CommentItem] Profil çekiliyor: ${authorIdStr}`);
            authService.getProfile(authorIdStr)
                .then(profile => {
                    console.log(`[CommentItem] Profil geldi:`, profile?.name || profile?.username || profile?.ad || "İsimsiz");
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
                    console.log(`[CommentItem] Profil çekme HATASI:`, err.message);
                });
        }
    }, [comment?.authorId, comment?.userId]);

    const commentAuthorId = comment.authorId?._id || comment.authorId || comment.author?._id || comment.author?.id || comment.user?._id || comment.user?.id;
    const actualCurrentUserId = currentUserId?._id || currentUserId?.id || currentUserId;

    const isCommentOwner = commentAuthorId && actualCurrentUserId &&
        String(commentAuthorId).trim().toLowerCase() === String(actualCurrentUserId).trim().toLowerCase();

    // postOwnerId'nin de nesne olma ihtimaline karşı
    const actualPostOwnerId = postOwnerId?._id || postOwnerId;
    const isPostOwner = actualPostOwnerId && actualCurrentUserId &&
        String(actualPostOwnerId).trim().toLowerCase() === String(actualCurrentUserId).trim().toLowerCase();

    console.log('--- COMMENT SAHİPLİK ---');
    console.log('Yorum Sahibi ID:', commentAuthorId);
    console.log('Aktif Kullanıcı ID:', actualCurrentUserId);
    console.log('Eşleşme:', isCommentOwner);

    const canDelete = isCommentOwner || isPostOwner;
    const canEdit = isCommentOwner;

    console.log('COMMENT OBJ AUTHOR DATA:', comment.authorId, comment.author, comment.user);

    const isLiked = comment.likes?.some(l => {
        const likerId = l.userId?._id || l.userId;
        return likerId === currentUserId;
    });
    const likeCount = comment.likes?.length || 0;

    const handleSaveEdit = () => {
        const trimmed = editText.trim();
        if (!trimmed) return;
        onUpdate(comment.id || comment._id, trimmed);
        setIsEditing(false);
    };

    return (
        <View style={[styles.container, isReply && styles.replyContainer]}>
            <TouchableOpacity
                onPress={() => onReply && onReply(comment)}
                onLongPress={() => {
                    console.log('Yoruma uzun basıldı! canEdit:', canEdit, 'canDelete:', canDelete);
                    setShowActions(true);
                }}
                delayLongPress={300}
                activeOpacity={0.8}
                style={styles.mainRow}
            >
                <View style={styles.contentCol}>
                    <View style={styles.headerRow}>
                        <Text style={styles.authorName}>
                            {fetchedAuthorName ||
                                (comment.authorId?.firstName ? `${comment.authorId.firstName} ${comment.authorId.lastName || ''}` : null) ||
                                (comment.authorId?.ad ? `${comment.authorId.ad} ${comment.authorId.soyad || ''}` : null) ||
                                (comment.author?.firstName ? `${comment.author.firstName} ${comment.author.lastName || ''}` : null) ||
                                (comment.author?.ad ? `${comment.author.ad} ${comment.author.soyad || ''}` : null) ||
                                (comment.user?.firstName ? `${comment.user.firstName} ${comment.user.lastName || ''}` : null) ||
                                (comment.user?.ad ? `${comment.user.ad} ${comment.user.soyad || ''}` : null) ||
                                comment.authorName ||
                                (currentUserName !== 'Kullanıcı' ? currentUserName : null) ||
                                comment.author?.name ||
                                comment.author?.username ||
                                comment.authorId?.name ||
                                comment.authorId?.username ||
                                comment.user?.name ||
                                comment.user?.username ||
                                '...'}
                        </Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.timeText}>{formatCommentTime(comment.createdAt)}</Text>
                    </View>

                    {isEditing ? (
                        <View style={styles.editWrapper}>
                            <TextInput
                                style={styles.editInput}
                                value={editText}
                                onChangeText={setEditText}
                                multiline
                                autoFocus
                                placeholderTextColor="#6B7280"
                            />
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.editBtn}>
                                    <X size={14} color="#F43F5E" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSaveEdit}
                                    style={[styles.editBtn, styles.editBtnSave]}
                                    disabled={!editText.trim()}
                                >
                                    <Check size={14} color="#10B981" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.commentText}>
                            {comment.replyToName && (
                                <Text style={styles.replyToNameText}>@{comment.replyToName} </Text>
                            )}
                            {comment.text}
                        </Text>
                    )}

                    <View style={styles.footerRow}>
                        {!isReply && (
                            <TouchableOpacity
                                style={styles.footerAction}
                                onPress={() => onReply && onReply(comment)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.footerActionText}>Yanıtla</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.likeCol}>
                    <TouchableOpacity
                        onPress={() => onLike && onLike(comment.id || comment._id)}
                        onLongPress={() => { if (likeCount > 0) setShowLikers(true); }}
                        activeOpacity={0.6}
                        style={styles.likeBtn}
                    >
                        <Heart
                            size={16}
                            color={isLiked ? '#10B981' : '#4B5563'}
                            fill={isLiked ? '#10B981' : 'transparent'}
                        />
                        {likeCount > 0 && (
                            <Text style={[styles.likeCount, isLiked && { color: '#10B981' }]}>{likeCount}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            {/* --- INSTAGRAM STYLE ACTIONS MODAL --- */}
            <Modal visible={showActions} transparent animationType="slide">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowActions(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalIndicator} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Yorum Seçenekleri</Text>
                        </View>

                        {canEdit && (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => { setShowActions(false); setIsEditing(true); }}
                            >
                                <View style={[styles.modalIconBg, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                                    <Pencil size={20} color="#10B981" />
                                </View>
                                <Text style={styles.modalItemText}>Yorumu Düzenle</Text>
                            </TouchableOpacity>
                        )}

                        {canDelete && (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => { setShowActions(false); onDelete(comment.id || comment._id); }}
                            >
                                <View style={[styles.modalIconBg, { backgroundColor: 'rgba(244,63,94,0.1)' }]}>
                                    <Trash2 size={20} color="#F43F5E" />
                                </View>
                                <Text style={[styles.modalItemText, { color: '#F43F5E' }]}>Yorumu Sil</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.modalItem, { marginTop: 10 }]}
                            onPress={() => setShowActions(false)}
                        >
                            <View style={[styles.modalIconBg, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                                <X size={20} color="#9CA3AF" />
                            </View>
                            <Text style={[styles.modalItemText, { color: '#9CA3AF' }]}>Vazgeç</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* --- CUSTOM LIKERS MODAL --- */}
            <Modal visible={showLikers} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLikers(false)}>
                    <View style={[styles.modalContent, { maxHeight: '50%' }]}>
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>Beğenenler</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {comment.likes?.map((liker, idx) => (
                                <View key={idx} style={styles.likerItem}>
                                    <View style={styles.likerAvatar}>
                                        <Text style={styles.likerInitial}>{(liker.userName || '?')[0].toUpperCase()}</Text>
                                    </View>
                                    <Text style={styles.likerName}>{liker.userName}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginBottom: 4,
    },
    replyContainer: {
        marginLeft: 40,
        borderLeftWidth: 1,
        borderLeftColor: '#21262D',
        paddingLeft: 12,
        paddingVertical: 8,
    },
    mainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentCol: {
        flex: 1,
        paddingRight: 10
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6
    },
    authorName: {
        color: '#F9FAFB',
        fontSize: 13,
        fontWeight: '700'
    },
    dot: {
        color: '#4B5563',
        fontSize: 10,
    },
    timeText: {
        color: '#6B7280',
        fontSize: 12
    },
    commentText: {
        color: '#E5E7EB',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8
    },
    replyToNameText: {
        color: '#3897f0', // Instagram Tag Blue
        fontWeight: '700'
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    footerAction: {
        paddingVertical: 4,
    },
    footerActionText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600'
    },
    likeCol: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 4,
        width: 30,
    },
    likeBtn: {
        alignItems: 'center',
        gap: 2,
    },
    likeCount: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500'
    },
    editWrapper: {
        marginBottom: 8,
        backgroundColor: '#161B22',
        borderRadius: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#21262D'
    },
    editInput: {
        color: '#F9FAFB',
        fontSize: 14,
        lineHeight: 20,
        minHeight: 40,
        textAlignVertical: 'top'
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 6
    },
    editBtn: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#0D1117',
        borderWidth: 1,
        borderColor: '#21262D'
    },
    editBtnSave: {
        backgroundColor: 'rgba(16,185,129,0.1)'
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#161B22',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#21262D'
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#30363D',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20
    },
    modalHeader: {
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#30363D',
        marginBottom: 10
    },
    modalTitle: {
        color: '#F9FAFB',
        fontSize: 16,
        fontWeight: '700'
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 15
    },
    modalIconBg: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalItemText: {
        color: '#F9FAFB',
        fontSize: 16,
        fontWeight: '600'
    },
    likerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12
    },
    likerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center'
    },
    likerInitial: {
        color: '#0D1117',
        fontSize: 16,
        fontWeight: '700'
    },
    likerName: {
        color: '#F9FAFB',
        fontSize: 15,
        fontWeight: '500'
    }
});