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
import api from '../../services/api';

// Firebase Gereksinimleri
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

import AuthButton from '../../components/auth/AuthButton';
import AuthInput from '../../components/auth/AuthInput';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      // 1. ADIM: Firebase ile kimlik ve mail onayı kontrolü
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      // Güncel durumu Firebase sunucusundan çek (Onay linkine tıklandı mı?)
      await firebaseUser.reload(); 
      
      // 2. ADIM: Mail onaylı değilse içeri girmeyi engelle
      if (!firebaseUser.emailVerified) {
        Alert.alert(
          "E-posta Onayı Gerekli", 
          "Lütfen e-postanıza gönderilen linke tıklayarak hesabınızı doğrulayın."
        );
        setLoading(false);
        return; 
      }

      // 3. ADIM: Kendi Backend API'ne git
      // Firebase UID kullanmıyoruz, sadece email ve şifre ile kendi DB'mizden giriş yapıyoruz
      const response = await api.post('/v1/auth/login', { 
        email: email.trim().toLowerCase(),
        password: password // Kendi backend'in şifreyi kontrol edip JWT token dönecek
      });

      const { token, user } = response.data;

      if (token && user) {
        // 4. ADIM: Kendi backend'inden gelen token ve user objesiyle oturum aç
        await login(token, user);
      } else {
        throw new Error("Sunucudan eksik veri geldi.");
      }

    } catch (error) {
      console.log("Giriş Hatası:", error);
      
      let errorMsg = "E-posta veya şifre hatalı.";
      
      // Firebase hatalarını yakala
      if (error.code === 'auth/user-not-found') errorMsg = "Kullanıcı bulunamadı.";
      if (error.code === 'auth/wrong-password') errorMsg = "Şifre hatalı.";
      
      // Kendi Backend'inden gelen hata mesajını önceliklendir
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
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