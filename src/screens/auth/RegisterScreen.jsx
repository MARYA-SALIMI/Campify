import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView, Platform,
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';
import { auth } from '../../../firebaseConfig';
import api from '../../services/api';

import AuthButton from '../../components/auth/AuthButton';
import AuthInput from '../../components/auth/AuthInput';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { email, password, firstName, lastName } = formData;
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await sendEmailVerification(userCredential.user);
      await api.post('/v1/auth/register', { email: email.trim(), password, firstName, lastName });
      Alert.alert("Success ✨", "Check your inbox for the verification link.");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.mainBackground}>
      <StatusBar barStyle="light-content" />
      
      {/* Dekoratif Işık Efektleri */}
      <View style={styles.lightBlob1} />
      <View style={styles.lightBlob2} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Join the{"\n"}<Text style={styles.brandText}>Community</Text></Text>
              <Text style={styles.subtitle}>Create your profile to begin.</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <AuthInput
                    label="First Name"
                    placeholder="Marya"
                    value={formData.firstName}
                    onChangeText={(v) => setFormData({...formData, firstName: v})}
                  />
                </View>
                <View style={[styles.halfWidth, { marginLeft: 12 }]}>
                  <AuthInput
                    label="Last Name"
                    placeholder="Salimi"
                    value={formData.lastName}
                    onChangeText={(v) => setFormData({...formData, lastName: v})}
                  />
                </View>
              </View>

              <AuthInput
                label="Email"
                placeholder="StudentNumber@ogr.sdu.edu.tr"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(v) => setFormData({...formData, email: v})}
                containerStyle={styles.inputMargin}
              />

              <AuthInput
                label="Password"
                placeholder="**********"
                isPassword={true}
                value={formData.password}
                onChangeText={(v) => setFormData({...formData, password: v})}
                containerStyle={styles.inputMargin}
              />

              <AuthButton 
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                style={styles.registerBtn}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already part of us? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBackground: { flex: 1, backgroundColor: '#020617' },
  lightBlob1: { position: 'absolute', top: -100, right: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(16, 185, 129, 0.08)' },
  lightBlob2: { position: 'absolute', bottom: 100, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(59, 130, 246, 0.05)' },
  scrollContainer: { padding: 24, paddingBottom: 50 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginBottom: 20 },
  header: { marginBottom: 35 },
  title: { fontSize: 40, fontWeight: '900', color: '#fff', lineHeight: 46, letterSpacing: -1.5 },
  brandText: { color: '#10b981' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 12, fontWeight: '500' },
  formContainer: { marginTop: 10 },
  row: { flexDirection: 'row', width: '100%', marginBottom: 24 },
  halfWidth: { flex: 1 },
  inputMargin: { marginBottom: 24 },
  registerBtn: { marginTop: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  footerText: { color: '#64748b', fontSize: 16 },
  footerLink: { color: '#10b981', fontWeight: '900', fontSize: 16, marginLeft: 6 }
});

export default RegisterScreen;