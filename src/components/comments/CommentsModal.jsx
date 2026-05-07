import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import commentService from '../../services/commentService';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CommentsModal({ visible, onClose, postId, currentUserId, currentUserName, postOwnerId, onCommentCountChange }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyTo, setReplyTo] = useState(null);
    const [expandedParents, setExpandedParents] = useState([]);

    const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Sadece aşağı kaydırmaya izin ver
                return gestureState.dy > 0;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 150 || gestureState.vy > 0.5) {
                    closeModal();
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                        friction: 8
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(panY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8
            }).start();
            if (postId) fetchComments();
        }
    }, [visible, postId]);

    const closeModal = () => {
        Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true
        }).start(onClose);
    };

    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await commentService.getComments(postId);
            setComments(data);
        } catch (error) {
            console.error("Yorumlar yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (text) => {
        try {
            const payload = {
                text,
                authorId: currentUserId,
                authorName: currentUserName,
                parentId: replyTo?.id || null,
                replyToName: replyTo?.authorName || null
            };
            const newComment = await commentService.addComment(postId, payload);

            setComments([...comments, newComment]);
            setReplyTo(null);
            if (replyTo?.id) {
                setExpandedParents(prev => [...new Set([...prev, replyTo.id])]);
            }
            if (onCommentCountChange) onCommentCountChange(comments.length + 1);
        } catch (error) {
            console.error("Yorum eklenemedi:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            // Local state update
            setComments(comments.filter(c => (c.id || c._id) !== commentId));
            if (onCommentCountChange) onCommentCountChange(comments.length - 1);

            // Backend call
            await commentService.deleteComment(postId, commentId);
        } catch (error) {
            console.error("Yorum silinemedi:", error);
            // Hata olursa geri yükle (Opsiyonel: Daha sağlam bir yapı için fetchComments çağrılabilir)
        }
    };

    const handleUpdateComment = async (commentId, newText) => {
        try {
            // Local state update
            setComments(comments.map(c => (c.id || c._id) === commentId ? { ...c, text: newText } : c));

            // Backend call
            await commentService.updateComment(commentId, { text: newText });
        } catch (error) {
            console.error("Yorum güncellenemedi:", error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            setComments(prev => prev.map(c => {
                const cId = c.id || c._id;
                if (cId === commentId) {
                    const likes = c.likes || [];
                    const alreadyLiked = likes.some(l => l.userId === currentUserId);
                    return {
                        ...c,
                        likes: alreadyLiked
                            ? likes.filter(l => l.userId !== currentUserId)
                            : [...likes, { userId: currentUserId, userName: currentUserName }]
                    };
                }
                return c;
            }));
            await commentService.toggleLike(commentId, currentUserId, currentUserName);
        } catch (error) {
            console.error("Beğeni hatası:", error);
        }
    };

    const handleReplyClick = (parentComment) => {
        setReplyTo({
            id: parentComment.id || parentComment._id,
            authorName: parentComment.authorName || 'Kullanıcı'
        });
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={closeModal}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeModal} />
                <Animated.View
                    style={[styles.sheet, { transform: [{ translateY: panY }] }]}
                >
                    <View {...panResponder.panHandlers} style={styles.dragArea}>
                        <View style={styles.dragHandle} />
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Yorumlar</Text>
                        </View>
                    </View>

                    <View style={styles.listWrapper}>
                        {loading ? (
                            <View style={styles.loader}>
                                <ActivityIndicator color="#10B981" />
                            </View>
                        ) : (
                            <FlatList
                                data={(() => {
                                    const parents = comments.filter(c => !c.parentId);
                                    const organized = [];
                                    parents.forEach(p => {
                                        organized.push(p);
                                        const pId = p.id || p._id;
                                        const replies = comments.filter(c => c.parentId === pId);
                                        if (replies.length > 0) {
                                            const isExpanded = expandedParents.includes(pId);
                                            organized.push({ _type: 'toggle', parentId: pId, count: replies.length, isExpanded });
                                            if (isExpanded) organized.push(...replies);
                                        }
                                    });
                                    return organized;
                                })()}
                                keyExtractor={item => item._type === 'toggle' ? `toggle-${item.parentId}` : (item.id || item._id || Math.random().toString())}
                                renderItem={({ item }) => {
                                    if (item._type === 'toggle') {
                                        return (
                                            <TouchableOpacity
                                                style={styles.toggleBtn}
                                                onPress={() => {
                                                    setExpandedParents(prev =>
                                                        item.isExpanded
                                                            ? prev.filter(id => id !== item.parentId)
                                                            : [...prev, item.parentId]
                                                    );
                                                }}
                                            >
                                                <View style={styles.toggleLine} />
                                                <Text style={styles.toggleText}>
                                                    {item.isExpanded ? 'Yanıtları gizle' : `Yanıtları gör (${item.count})`}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                    return (
                                        <CommentItem
                                            comment={item}
                                            currentUserId={currentUserId}
                                            currentUserName={currentUserName}
                                            postOwnerId={postOwnerId}
                                            onDelete={handleDeleteComment}
                                            onUpdate={handleUpdateComment}
                                            onLike={handleLikeComment}
                                            onReply={handleReplyClick}
                                            isReply={!!item.parentId}
                                        />
                                    );
                                }}
                                contentContainerStyle={styles.listContent}
                                ListEmptyComponent={<Text style={styles.emptyText}>Henüz yorum yok. İlk yorumu sen yap!</Text>}
                            />
                        )}
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
                        <SafeAreaView edges={['bottom']} style={styles.inputArea}>
                            {replyTo && (
                                <View style={styles.replyBar}>
                                    <Text style={styles.replyText}>@{replyTo.authorName} kullanıcısına yanıt veriliyor</Text>
                                    <TouchableOpacity onPress={() => setReplyTo(null)}>
                                        <Text style={[styles.replyText, { color: '#10B981', fontWeight: 'bold' }]}>Vazgeç</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <CommentInput onSend={handleAddComment} placeholder={replyTo ? `${replyTo.authorName} kullanıcısına yanıt ver...` : "Yorum ekle..."} />
                        </SafeAreaView>
                    </KeyboardAvoidingView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject },
    sheet: {
        backgroundColor: '#0D1117',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        height: '88%',
        borderWidth: 1,
        borderColor: '#21262D',
        overflow: 'hidden'
    },
    dragArea: {
        width: '100%',
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: '#0D1117',
    },
    dragHandle: {
        width: 36,
        height: 4,
        backgroundColor: '#30363D',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#21262D',
        alignItems: 'center'
    },
    headerTitle: { color: '#F9FAFB', fontSize: 16, fontWeight: '700' },
    listWrapper: { flex: 1 },
    listContent: { paddingHorizontal: 16, paddingBottom: 20 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#6B7280', textAlign: 'center', marginTop: 40, fontSize: 14 },
    inputArea: {
        backgroundColor: '#0D1117',
        borderTopWidth: 1,
        borderTopColor: '#21262D'
    },
    replyBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#161B22',
    },
    replyText: { color: '#9CA3AF', fontSize: 12 },
    toggleBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 44, marginVertical: 6, paddingVertical: 4 },
    toggleLine: { width: 28, height: 1, backgroundColor: '#374151', marginRight: 10 },
    toggleText: { color: '#6B7280', fontSize: 12, fontWeight: '700' }
});