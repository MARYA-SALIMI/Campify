import { StatusBar } from 'react-native';
import 'react-native-gesture-handler'; // EN ÜSTTE KALMALI
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Yeni eklenen
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../../src/context/AuthContext';
import AppNavigator from '../../src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar barStyle="light-content" />
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}