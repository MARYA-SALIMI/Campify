import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api'; // Kendi api servisimiz

import AuthButton from '../../components/auth/AuthButton';
import AuthInput from '../../components/auth/AuthInput';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    // Mühendislik kontrolü: Boş alan bırakma
    if (!email || !password) {
      Alert.alert("Eksik Bilgi", "Lütfen email ve şifrenizi giriniz.");
      return;
    }

    setLoading(true);
    try {
      // Firebase bitti, artık doğrudan Campify API'sine gidiyoruz
      const response = await api.post('/v1/auth/login', {
        email: email.trim().toLowerCase(),
        password: password
      });

      // Backend'in bize bir token ve user objesi dönmeli
      const { token, user } = response.data;

      if (token && user) {
        // Context'e verileri kaydediyoruz (Artık middleware bu token'ı tanıyacak)
        await login(token, user);
      } else {
        throw new Error("Sunucudan eksik veri geldi.");
      }

    } catch (error) {
      console.error("Giriş Hatası:", error);
      
      // Backend'den gelen spesifik hata mesajını göster, yoksa genel hata ver
      const errorMsg = error.response?.data?.message || "E-posta veya şifre hatalı.";
      Alert.alert("Giriş Başarısız", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoInitial}>C</Text>
          </View>
          <Text style={styles.logoText}>Campify</Text>
          <Text style={styles.welcomeText}>Welcome back, developer.</Text>
        </View>

        <View style={styles.glassForm}>
          <AuthInput
            leftIcon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={styles.inputMargin}
            wrapperStyle={styles.loginInputWrapper}
          />

          <AuthInput
            leftIcon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            containerStyle={styles.inputMargin}
            wrapperStyle={styles.loginInputWrapper}
          />

          <AuthButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
        </View>

        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.linkHighlight}>Register</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1, justifyContent: 'center', padding: 28 },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  logoBadge: { 
    width: 60, 
    height: 60, 
    borderRadius: 18, 
    backgroundColor: '#10b981', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  logoInitial: { fontSize: 30, fontWeight: 'bold', color: '#fff' },
  logoText: { fontSize: 38, fontWeight: '900', color: '#f8fafc', letterSpacing: -1 },
  welcomeText: { color: '#94a3b8', fontSize: 16, marginTop: 4 },
  glassForm: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputMargin: { marginBottom: 16 },
  loginInputWrapper: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b'
  },
  loginButton: { height: 56, borderRadius: 16, marginTop: 8 },
  loginButtonText: { fontSize: 16, fontWeight: '700' },
  footerLink: { marginTop: 32, alignItems: 'center' },
  footerText: { color: '#64748b' },
  linkHighlight: { color: '#10b981', fontWeight: 'bold' }
});

export default LoginScreen;