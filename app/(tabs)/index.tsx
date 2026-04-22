import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../../src/context/AuthContext'; // İki kat yukarı çıktık
import AppNavigator from '../../src/navigation/AppNavigator'; // İki kat yukarı çıktık

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}