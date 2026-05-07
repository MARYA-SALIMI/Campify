import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';

export default function CommentInput({ onSend, placeholder = "Yorumunu yaz..." }) {
    const [text, setText] = useState('');

    const handlePress = () => {
        if (!text.trim()) return;
        onSend(text);
        setText('');
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={text}
                onChangeText={setText}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#6B7280"
                multiline
            />
            <TouchableOpacity 
                onPress={handlePress} 
                style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
                disabled={!text.trim()}
            >
                <Send size={18} color="#0D1117" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', padding: 12, backgroundColor: '#161B22', borderTopWidth: 1, borderTopColor: '#21262D', alignItems: 'flex-end' },
    input: { flex: 1, backgroundColor: '#0D1117', color: '#F9FAFB', borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, minHeight: 40, maxHeight: 100, borderWidth: 1, borderColor: '#21262D' },
    sendBtn: { backgroundColor: '#10B981', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginBottom: 2 },
    sendBtnDisabled: { backgroundColor: '#059669', opacity: 0.5 }
});