import React from 'react';
// 🎯 DEĞİŞİKLİK 1: NavigationIndependentTree eklendi
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import ChatRoomScreen from '../screens/chats/ChatRoomScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        // 🎯 DEĞİŞİKLİK 2: Konteyner bağımsız bir ağaç içine alındı
        <NavigationIndependentTree>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {/* Ana sekme navigasyonu */}
                    <Stack.Screen name="Tabs" component={TabNavigator} />

                    {/* Tam ekran stack ekranları */}
                    <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </NavigationIndependentTree>
    );
};

export default AppNavigator;