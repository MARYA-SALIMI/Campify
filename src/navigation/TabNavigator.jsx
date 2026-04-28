import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageSquare, User } from 'lucide-react-native';

import ChatListScreen from '../screens/chats/ChatListScreen';
import HomeScreen from '../screens/main/HomeScreen';

// ─────────────────────────────────────────────────────────────────────────────
// 🚪 TAKIM ARKADAŞLARI İÇİN KAPI
// HomeScreen ve ProfileScreen hazır olduğunda aşağıdaki dummy bileşenleri
// silip gerçek import'larla değiştirin:
//
//   import HomeScreen    from '../screens/home/HomeScreen';
//   import ProfileScreen from '../screens/profile/ProfileScreen';
// ─────────────────────────────────────────────────────────────────────────────


const ProfileScreen = () => (
    <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>👤</Text>
        <Text style={styles.placeholderTitle}>Profil</Text>
        <Text style={styles.placeholderSub}>Bu ekran yakında hazır olacak.</Text>
    </View>
);
// ─────────────────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

const TAB_BAR_STYLE = {
    backgroundColor: '#0D1117',
    borderTopColor: '#21262D',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: TAB_BAR_STYLE,
                tabBarActiveTintColor: '#10B981',
                tabBarInactiveTintColor: '#4B5563',
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'HomeTab') {
                        return <Home size={size} color={color} />;
                    }
                    if (route.name === 'ChatsTab') {
                        return <MessageSquare size={size} color={color} />;
                    }
                    if (route.name === 'ProfileTab') {
                        return <User size={size} color={color} />;
                    }
                },
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ tabBarLabel: 'Ana Sayfa' }}
            />
            <Tab.Screen
                name="ChatsTab"
                component={ChatListScreen}
                options={{ tabBarLabel: 'Mesajlar' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Profil' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    placeholder: {
        flex: 1,
        backgroundColor: '#0D1117',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    placeholderIcon: { fontSize: 48 },
    placeholderTitle: {
        color: '#F3F4F6',
        fontSize: 20,
        fontWeight: '700',
    },
    placeholderSub: {
        color: '#4B5563',
        fontSize: 13,
    },
});

export default TabNavigator;