import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import { X, BookOpen, Users, Megaphone, Search } from 'lucide-react-native';

/**
 * Kategori id'leri backend ile BİREBİR eşleşiyor:
 * 'book' | 'team' | 'announcement' | 'lost'
 *
 * PostCard'daki CATEGORY_META anahtarlarıyla aynı olmak zorunda —
 * bu sayede kartlar asla yanlış renk/etiket göstermez.
 */
const CATEGORIES = [
    {
        id: 'book',
        label: 'Kitap İlanı',
        icon: BookOpen,
        color: '#F59E0B',
        bgActive: 'rgba(245,158,11,0.18)',
        borderActive: '#F59E0B',
    },
    {
        id: 'team',
        label: 'Ekip Arama',
        icon: Users,
        color: '#A855F7',
        bgActive: 'rgba(168,85,247,0.18)',
        borderActive: '#A855F7',
    },
    {
        id: 'announcement',
        label: 'Duyuru',
        icon: Megaphone,
        color: '#F43F5E',
        bgActive: 'rgba(244,63,94,0.18)',
        borderActive: '#F43F5E',
    },
    {
        id: 'lost',
        label: 'Kayıp Eşya',
        icon: Search,
        color: '#0EA5E9',
        bgActive: 'rgba(14,165,233,0.18)',
        borderActive: '#0EA5E9',
    },
];

/**
 * EditPostModal — Gönderi oluşturma / düzenleme modalı
 *
 * Props:
 * @param {boolean}  visible      — Görünürlük
 * @param {function} onClose      — Kapat callback'i
 * @param {function} onSubmit     — ({ category, title, content }) => void
 * @param {object}   initialData  — Düzenleme: { category: 'book'|'team'|'announcement'|'lost', title, content }
 *                                  Oluşturma modunda null/undefined geçilebilir
 */
export default function EditPostModal({ visible, onClose, onSubmit, initialData }) {
    const [selectedCategory, setSelectedCategory] = useState('book');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (!visible) return;
        if (initialData) {
            // Bilinmeyen category gelirse 'book' varsayılanına düş
            const safeCategory = CATEGORIES.find((c) => c.id === initialData.category)
                ? initialData.category
                : 'book';
            setSelectedCategory(safeCategory);
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
        } else {
            setSelectedCategory('book');
            setTitle('');
            setContent('');
        }
    }, [visible, initialData]);

    const isFormValid = title.trim().length > 0 && content.trim().length > 0;
    const isEditMode = !!initialData;

    const handleSubmit = () => {
        if (!isFormValid) return;
        onSubmit({ category: selectedCategory, title: title.trim(), content: content.trim() });
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.kvView}
                >
                    <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                            {/* ── Başlık ── */}
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>
                                    {isEditMode ? 'Gönderiyi Düzenle' : 'Yeni Gönderi'}
                                </Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                                    <X size={18} color="#9CA3AF" strokeWidth={2} />
                                </TouchableOpacity>
                            </View>

                            {/* ── Kategori ── */}
                            <Text style={styles.label}>KATEGORİ</Text>
                            <View style={styles.catGrid}>
                                {CATEGORIES.map((cat) => {
                                    const isSelected = selectedCategory === cat.id;
                                    const Icon = cat.icon;
                                    return (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.catBtn,
                                                isSelected && { backgroundColor: cat.bgActive, borderColor: cat.borderActive },
                                            ]}
                                            onPress={() => setSelectedCategory(cat.id)}
                                            activeOpacity={0.75}
                                        >
                                            <Icon size={16} color={isSelected ? cat.color : '#6B7280'} strokeWidth={2} />
                                            <Text style={[styles.catLabel, isSelected && { color: cat.color }]}>
                                                {cat.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* ── Başlık Alanı ── */}
                            <Text style={styles.label}>BAŞLIK</Text>
                            <View style={styles.inputBox}>
                                <TextInput
                                    style={styles.titleInput}
                                    placeholder="Gönderi başlığı..."
                                    placeholderTextColor="#4B5563"
                                    value={title}
                                    onChangeText={setTitle}
                                    maxLength={120}
                                    returnKeyType="next"
                                />
                            </View>

                            {/* ── İçerik Alanı ── */}
                            <Text style={styles.label}>İÇERİK</Text>
                            <View style={styles.inputBox}>
                                <TextInput
                                    style={styles.contentInput}
                                    placeholder="Ne paylaşmak istiyorsun?"
                                    placeholderTextColor="#4B5563"
                                    value={content}
                                    onChangeText={setContent}
                                    multiline
                                    textAlignVertical="top"
                                    maxLength={2000}
                                />
                            </View>

                            {/* ── Eylem Butonları ── */}
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.cancelBtn}>
                                    <Text style={styles.cancelText}>İptal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    activeOpacity={0.85}
                                    disabled={!isFormValid}
                                    style={[styles.submitBtn, !isFormValid && styles.submitDisabled]}
                                >
                                    <Text style={styles.submitText}>{isEditMode ? 'Kaydet' : 'Yayınla'}</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    kvView: {
        width: '100%',
        maxWidth: 520,
        justifyContent: 'center',
    },
    container: {
        backgroundColor: '#161B22',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 24,
        elevation: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#F9FAFB',
        letterSpacing: 0.2,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
        letterSpacing: 1.1,
        marginBottom: 10,
    },
    catGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 22,
    },
    catBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#2D3748',
        backgroundColor: '#1F2937',
        width: '47%',
    },
    catLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    inputBox: {
        backgroundColor: '#1F2937',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2D3748',
        marginBottom: 18,
        overflow: 'hidden',
    },
    titleInput: {
        paddingHorizontal: 16,
        paddingVertical: 13,
        fontSize: 15,
        color: '#F9FAFB',
    },
    contentInput: {
        paddingHorizontal: 16,
        paddingTop: 13,
        paddingBottom: 13,
        fontSize: 15,
        color: '#F9FAFB',
        minHeight: 130,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    cancelBtn: {
        paddingHorizontal: 18,
        paddingVertical: 11,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    submitBtn: {
        backgroundColor: '#10B981',
        paddingHorizontal: 24,
        paddingVertical: 11,
        borderRadius: 10,
    },
    submitDisabled: {
        backgroundColor: '#064E3B',
        opacity: 0.55,
    },
    submitText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
});