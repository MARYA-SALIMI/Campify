import { Ionicons } from "@expo/vector-icons"; // İkonlar için
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Alt barın genel stili
        tabBarActiveTintColor: "#2D6A4F", // Aktifken Campify Yeşili
        tabBarInactiveTintColor: "#8e8e8e", // Pasifken gri
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false, // Sayfa üstündeki varsayılan başlığı kapatıyoruz (kendimiz yaptık)
      }}
    >
      {/* 1. Sekme: Team (Ana Sayfa yaptık) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Team",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Sekme: Feed */}
      <Tabs.Screen
        name="explore" // Burayı daha sonra 'feed' olarak yeniden adlandırabilirsin
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Sekme: Messages */}
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Sekme: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
