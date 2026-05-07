import { Check, Search, Users, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createChat, searchUsers } from '../../services/chatService';

export default function NewChatModal({ visible, onClose, onStartChat }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if (!visible) {
            setSearchQuery('');
            setSearchResults([]);
            setSelectedUsers([]);
        }
    }, [visible]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            // 1. Vercel (Melisa) araması
            let combinedResults = await searchUsers(query);
            
            // 2. Render Sunucuları (Marya & Emine)
            try {
                const { default: axios } = await import('axios');
                const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
                const token = await AsyncStorage.getItem('token');
                
                const renderHosts = [
                    'https://campify-api-2nzn.onrender.com/v1/users',
                    'https://campify-api-l1vf.onrender.com/api/users'
                ];

                for (const host of renderHosts) {
                    try {
                        const res = await axios.get(host, {
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                            params: { q: query, search: query }
                        });
                        if (res.data) {
                            const rawUsers = Array.isArray(res.data) ? res.data : (res.data.users || []);
                            rawUsers.forEach(u => {
                                const id = u._id || u.id;
                                if (id && !combinedResults.find(r => r.id === id)) {
                                    combinedResults.push({
                                        id: id,
                                        name: u.name || `${u.ad || u.firstName || ''} ${u.soyad || u.lastName || ''}`.trim() || u.username || 'Kullanıcı',
                                        username: u.username || `@${u.email?.split('@')[0] || 'ogrenci'}`
                                    });
                                }
                            });
                        }
                    } catch (e) {}
                }
            } catch (e) {}

            // 3. FALLBACK: Manuel liste (Garanti olsun diye)
            const knownUsers = [
                { id: '69ef68dee8e87060bf7b7e89', name: 'Sinem Havan', username: '@sinem' },
                { id: '69f2279d89e63ae5a547e6f6', name: 'Marya Salimi', username: '@marya' },
                { id: 'emine_id_placeholder', name: 'Emine', username: '@emine' },
            ];

            knownUsers.forEach(u => {
                const alreadyFound = combinedResults.find(r => 
                    r.id === u.id || r.name.toLowerCase().includes(u.name.toLowerCase())
                );
                if (!alreadyFound && (u.name.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase()))) {
                    combinedResults.push(u);
                }
            });
            
            // Filtreleme (Client-side)
            const filtered = combinedResults.filter(u => 
                (u.name?.toLowerCase().includes(query.toLowerCase()) || 
                 u.username?.toLowerCase().includes(query.toLowerCase()))
            );

            setSearchResults(filtered);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleUserSelection = (user) => {
        if (selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const renderSelectedUsers = () => {
        if (selectedUsers.length === 0) return null;
        return (
            <View style={styles.selectedContainer}>
                <FlatList
                    horizontal
                    data={selectedUsers}
                    keyExtractor={item => item.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.selectedBubble} onPress={() => toggleUserSelection(item)}>
                            <View style={styles.selectedAvatar}>
                                <Text style={styles.selectedAvatarText}>{getInitials(item.name)}</Text>
                            </View>
                            <Text style={styles.selectedName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
                            <View style={styles.removeIconBg}>
                                <X size={10} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };

    const renderUserItem = ({ item }) => {
        const isSelected = !!selectedUsers.find(u => u.id === item.id);

        return (
            <TouchableOpacity
                style={styles.userItem}
                onPress={() => toggleUserSelection(item)}
                activeOpacity={0.7}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userUsername}>{item.username}</Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Check size={14} color="#fff" />}
                </View>
            </TouchableOpacity>
        );
    };

    const { user } = useAuth();
    const currentUserId = user?.id || user?._id;

    const handleStart = async () => {
        if (selectedUsers.length === 0) return;

        try {
            // Seçilen kullanıcıların yanına kendimizi de ekliyoruz ki sohbet listemizde görünsün
            const participantIds = [...selectedUsers.map(u => u.id), currentUserId];

            const chatName = selectedUsers.length === 1
                ? ''
                : selectedUsers.map(u => u.name.split(' ')[0]).join(', ');

            const result = await createChat(participantIds, chatName);
            const chatId = result._id || result.id;

            onStartChat(chatId, chatName || selectedUsers[0].name);
        } catch (error) {
            console.error("Sohbet oluşturulamadı:", error);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
                            <X size={24} color="#F3F4F6" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Yeni Sohbet</Text>
                        <TouchableOpacity
                            onPress={handleStart}
                            style={[styles.startBtn, selectedUsers.length === 0 && styles.startBtnDisabled]}
                            disabled={selectedUsers.length === 0}
                        >
                            <Text style={[styles.startBtnText, selectedUsers.length === 0 && styles.startBtnTextDisabled]}>
                                Başlat
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Text style={styles.toLabel}>Kime:</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Kullanıcı ara..."
                            placeholderTextColor="#6B7280"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>

                    {/* Selected Users Horizontal List */}
                    {renderSelectedUsers()}

                    {/* Group Chat Banner (if multiple) */}
                    {selectedUsers.length > 1 && (
                        <View style={styles.groupBanner}>
                            <Users size={16} color="#10B981" />
                            <Text style={styles.groupBannerText}>Grup sohbeti oluşturulacak ({selectedUsers.length} kişi)</Text>
                        </View>
                    )}

                    {/* Search Results */}
                    {isSearching ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#F97316" />
                        </View>
                    ) : (
                        <FlatList
                            data={searchResults}
                            keyExtractor={item => item.id}
                            renderItem={renderUserItem}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                searchQuery.length > 0 ? (
                                    <View style={styles.centerContainer}>
                                        <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
                                    </View>
                                ) : (
                                    <View style={styles.centerContainer}>
                                        <Search size={40} color="#374151" style={{ marginBottom: 10 }} />
                                        <Text style={styles.emptyText}>Mesajlaşmak için birini arayın</Text>
                                    </View>
                                )
                            }
                        />
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: '#0D1117' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#21262D' },
    headerBtn: { padding: 4 },
    headerTitle: { color: '#F3F4F6', fontSize: 18, fontWeight: '700' },
    startBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#F97316' },
    startBtnDisabled: { backgroundColor: '#1F2937' },
    startBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    startBtnTextDisabled: { color: '#6B7280' },

    searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#21262D' },
    toLabel: { color: '#F9FAFB', fontSize: 16, fontWeight: '600', marginRight: 10 },
    searchInput: { flex: 1, color: '#F9FAFB', fontSize: 16, paddingVertical: 4 },

    selectedContainer: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#21262D' },
    selectedBubble: { alignItems: 'center', marginRight: 16, position: 'relative' },
    selectedAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    selectedAvatarText: { color: '#9CA3AF', fontSize: 16, fontWeight: '600' },
    selectedName: { color: '#F9FAFB', fontSize: 11, maxWidth: 60, textAlign: 'center' },
    removeIconBg: { position: 'absolute', top: 0, right: 0, backgroundColor: '#374151', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#0D1117' },

    groupBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
    groupBannerText: { color: '#10B981', fontSize: 13, fontWeight: '500', marginLeft: 8 },

    listContent: { padding: 16 },
    userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 5 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
    userInfo: { flex: 1, marginLeft: 12 },
    userName: { color: '#F9FAFB', fontSize: 15, fontWeight: '500', marginBottom: 2 },
    userUsername: { color: '#6B7280', fontSize: 13 },
    checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#4B5563', alignItems: 'center', justifyContent: 'center' },
    checkboxSelected: { backgroundColor: '#F97316', borderColor: '#F97316' },

    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
    emptyText: { color: '#6B7280', fontSize: 15, fontWeight: '500' }
});
