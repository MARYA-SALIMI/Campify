import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Doğru paket ismi ve ihtiyacın olan ikonlar
import { Home, MessageSquare, UserCircle, Users } from 'lucide-react-native';
import ChatListScreen from '../screens/chats/ChatListScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import TeamsScreen from '../screens/teams/TeamsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#0f172a', 
          borderTopColor: '#1e293b',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarActiveTintColor: '#10b981', // Emerald Yeşil (Modern ve profesyonel)
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({color, size}) => <Home color={color} size={size} /> 
        }} 
      />

      <Tab.Screen 
        name="Teams" 
        component={TeamsScreen} 
        options={{ 
          tabBarLabel: 'Ekipler',
          tabBarIcon: ({color, size}) => <Users color={color} size={size} /> 
        }} 
      />

      <Tab.Screen 
        name="Chats" 
        component={ChatListScreen} 
        options={{ 
          tabBarLabel: 'Sohbet',
          tabBarIcon: ({color, size}) => <MessageSquare color={color} size={size} /> 
        }} 
      />

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Profil',
          tabBarIcon: ({color, size}) => <UserCircle color={color} size={size} /> 
        }} 
      />
    </Tab.Navigator>
  );
}