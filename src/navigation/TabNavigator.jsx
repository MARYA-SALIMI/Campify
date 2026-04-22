import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User } from 'lucide-react-native';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import TeamsScreen from '../screens/teams/TeamsScreen';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false,
      tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
      tabBarActiveTintColor: '#10b981',
      tabBarInactiveTintColor: '#64748b'
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({color}) => <Home color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({color}) => <User color={color} /> }} />
      <Tab.Screen name="Teams" component={TeamsScreen} options={{ tabBarIcon: ({color}) => <User color={color} /> }} />
    </Tab.Navigator>
  );
}