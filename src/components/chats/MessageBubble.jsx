import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function MessageBubble({ message, isMe, onDelete }) {
    const confirmDelete = () => {
        Alert.alert("Mesajı Sil", "Bu mesajı silmek istiyor musun?", [
            { text: "Vazgeç" },
            { text: "Sil", onPress: () => onDelete(message.id), style: "destructive" }
        ]);
    };

    return (
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
            <Text style={[styles.text, isMe ? styles.myText : styles.theirText]}>{message.text}</Text>
            <View style={styles.footer}>
                <Text style={[styles.time, isMe ? styles.myTime : styles.theirTime]}>
                    {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </Text>
                {isMe && (
                    <TouchableOpacity onPress={confirmDelete} hitSlop={10} style={{ marginLeft: 6 }}>
                        <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: { marginHorizontal: 16, marginVertical: 6, padding: 12, borderRadius: 16, maxWidth: '75%' },
    myBubble: { backgroundColor: '#10B981', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    theirBubble: { backgroundColor: '#161B22', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#21293A' },
    text: { fontSize: 15, lineHeight: 20 },
    myText: { color: '#0D1117', fontWeight: '500' },
    theirText: { color: '#E5E7EB' },
    footer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 },
    time: { fontSize: 10 },
    myTime: { color: '#0D1117', opacity: 0.7 },
    theirTime: { color: '#6B7280' },
    deleteIcon: { fontSize: 12 }
});