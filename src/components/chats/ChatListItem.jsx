import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ChatListItem({ chat, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(chat.id)}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{chat.otherUserName?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.info}>
                <View style={styles.topRow}>
                    <Text style={styles.name}>{chat.otherUserName}</Text>
                    <Text style={styles.time}>{chat.lastMessageTime || ''}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {chat.lastMessage || 'Henüz mesaj yok...'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', padding: 16, backgroundColor: '#0D1117', borderBottomWidth: 1, borderBottomColor: '#21262D', alignItems: 'center' },
    avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#10B981' },
    avatarText: { color: '#10B981', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
    info: { flex: 1, marginLeft: 12 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    name: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
    time: { color: '#6B7280', fontSize: 12 },
    lastMessage: { color: '#9CA3AF', fontSize: 13 }
});