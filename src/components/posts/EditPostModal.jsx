import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import { X, Send, Pencil, Plus, Tag } from 'lucide-react-native';

const EditPostModal = ({ visible, onClose, onSubmit, post }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!post;

    useEffect(() => {
        if (visible) {
            if (post) {
                setTitle(post.title || '');
                setContent(post.content || '');
                setTags(post.tags || []);
            } else {
                setTitle('');
                setContent('');
                setTags([]);
                setTagInput('');
            }
            setError('');
        }
    }, [visible, post]);

    const addTag = () => {
        const trimmed = tagInput.trim().replace('#', '');
        if (trimmed && !tags.includes(trimmed)) {
            setTags((prev) => [...prev, trimmed]);
        }
        setTagInput('');
    };

    const removeTag = (tag) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError('İçerik boş bırakılamaz.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await onSubmit({ title: title.trim(), content: content.trim(), tags });
            onClose();
        } catch (e) {
            setError(e?.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.sheet}>
                    {/* Handle bar */}
                    <View style={styles.handleBar} />

                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.headerLeft}>
                            {isEditing ? (
                                <Pencil size={18} color="#10B981" />
                            ) : (
                                <Plus size={18} color="#10B981" />
                            )}
                            <Text style={styles.modalTitle}>
                                {isEditing ? 'Gönderiyi Düzenle' : 'Yeni Gönderi'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <ScrollView
                        style={styles.formScroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Title Input */}
                        <Text style={styles.label}>Başlık (İsteğe Bağlı)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Gönderi başlığı..."
                            placeholderTextColor="#6B7280"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                        />

                        {/* Content Input */}
                        <Text style={styles.label}>
                            İçerik <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[styles.input, styles.contentInput]}
                            placeholder="Ne düşünüyorsun?"
                            placeholderTextColor="#6B7280"
                            value={content}
                            onChangeText={setContent}
                            multiline
                            textAlignVertical="top"
                            maxLength={2000}
                        />
                        <Text style={styles.charCount}>{content.length}/2000</Text>

                        {/* Tags */}
                        <Text style={styles.label}>Etiketler</Text>
                        <View style={styles.tagInputRow}>
                            <View style={styles.tagIconWrapper}>
                                <Tag size={14} color="#10B981" />
                            </View>
                            <TextInput
                                style={styles.tagInput}
                                placeholder="Etiket ekle, Enter'a bas"
                                placeholderTextColor="#6B7280"
                                value={tagInput}
                                onChangeText={setTagInput}
                                onSubmitEditing={addTag}
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={addTag} style={styles.addTagBtn}>
                                <Plus size={16} color="#10B981" />
                            </TouchableOpacity>
                        </View>

                        {tags.length > 0 && (
                            <View style={styles.tagsRow}>
                                {tags.map((tag, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={styles.tag}
                                        onPress={() => removeTag(tag)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.tagText}>#{tag}</Text>
                                        <X size={10} color="#34D399" style={{ marginLeft: 4 }} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Error */}
                        {!!error && <Text style={styles.errorText}>{error}</Text>}

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Send size={16} color="#fff" />
                                    <Text style={styles.submitBtnText}>
                                        {isEditing ? 'Güncelle' : 'Paylaş'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={{ height: 24 }} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    keyboardView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    sheet: {
        backgroundColor: '#1F2937',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        maxHeight: '90%',
        borderTopWidth: 1,
        borderColor: '#374151',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 20,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#4B5563',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalTitle: {
        color: '#F3F4F6',
        fontSize: 18,
        fontWeight: '700',
    },
    closeBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#374151',
        marginBottom: 16,
    },
    formScroll: {
        flexGrow: 0,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    required: {
        color: '#F87171',
    },
    input: {
        backgroundColor: '#111827',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#374151',
        color: '#F3F4F6',
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
    },
    contentInput: {
        minHeight: 120,
        maxHeight: 200,
        paddingTop: 12,
    },
    charCount: {
        color: '#6B7280',
        fontSize: 11,
        textAlign: 'right',
        marginTop: -12,
        marginBottom: 16,
    },
    tagInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111827',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#374151',
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    tagIconWrapper: {
        marginRight: 6,
    },
    tagInput: {
        flex: 1,
        color: '#F3F4F6',
        fontSize: 15,
        paddingVertical: 12,
    },
    addTagBtn: {
        padding: 4,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 16,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#064E3B',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    tagText: {
        color: '#34D399',
        fontSize: 12,
        fontWeight: '500',
    },
    errorText: {
        color: '#F87171',
        fontSize: 13,
        backgroundColor: '#2D1515',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#7F1D1D',
    },
    submitBtn: {
        backgroundColor: '#10B981',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EditPostModal;