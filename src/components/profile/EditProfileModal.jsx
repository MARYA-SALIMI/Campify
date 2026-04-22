import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../../services/api';

const EditProfileModal = ({ visible, onClose, currentUser, onUpdateSuccess, onLogout }) => {
  // Temel Bilgiler
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  
  // Dizi (Array) Bilgileri
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);
  
  // Input Geçici State'leri
  const [interestInput, setInterestInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Modal açıldığında mevcut verileri yükle
  useEffect(() => {
    if (visible && currentUser) {
      setFirstName(currentUser.ad || '');
      setLastName(currentUser.soyad || '');
      setDepartment(currentUser.bolum || '');
      setInterests(currentUser.ilgi_alanlari || []);
      setSkills(currentUser.yetenekler || []);
    }
  }, [visible, currentUser]);

  // Listeye eleman ekleme (Enter/Submit)
  const addItem = (type) => {
    if (type === 'interest' && interestInput.trim()) {
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
      }
      setInterestInput('');
    } else if (type === 'skill' && skillInput.trim()) {
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  // Listeden eleman çıkarma
  const removeItem = (type, index) => {
    if (type === 'interest') {
      setInterests(interests.filter((_, i) => i !== index));
    } else {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  // PROFİL GÜNCELLEME (PUT)
  const handleUpdate = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Hata", "Ad ve soyad boş bırakılamaz.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        department: department.trim(),
        interests: interests,
        skills: skills
      };

      // Backend rotan: PUT /v1/users (ID'yi token'dan alır)
      const response = await api.put('/v1/users', payload);
      const updatedUser = response.data;

      const formattedData = {
        id: updatedUser._id || updatedUser.id,
        ad: updatedUser.firstName,
        soyad: updatedUser.lastName,
        bolum: updatedUser.department || "",
        email: updatedUser.email,
        ilgi_alanlari: updatedUser.interests || [],
        yetenekler: updatedUser.skills || []
      };

      onUpdateSuccess(formattedData);
      Alert.alert("Başarılı", "Profiliniz güncellendi.");
      onClose();
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.message || "Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  // HESAP SİLME (DELETE)
  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesabı Sil",
      "Hesabınızı silmek istediğinize emin misiniz? Tüm verileriniz kalıcı olarak silinecektir.",
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Evet, Sil", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoading(true);
              // Backend rotan: DELETE /v1/users
              await api.delete('/v1/users');
              onClose();
              if (onLogout) onLogout(); // Uygulamadan çıkış yaptır
            } catch (error) {
              Alert.alert("Hata", "Hesap silinemedi.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Chip Render Bileşeni
  const renderChips = (data, type) => (
    <View style={styles.chipContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.chip}>
          <Text style={styles.chipText}>{item}</Text>
          <TouchableOpacity onPress={() => removeItem(type, index)}>
            <Ionicons name="close-circle" size={16} color="#10b981" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.modalContainer}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Profili Düzenle</Text>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
            
            {/* Kişisel Bilgiler */}
            <View style={styles.section}>
              <Text style={styles.label}>KİŞİSEL BİLGİLER</Text>
              <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Ad" placeholderTextColor="#475569" />
              <TextInput style={[styles.input, {marginTop: 10}]} value={lastName} onChangeText={setLastName} placeholder="Soyad" placeholderTextColor="#475569" />
              <TextInput style={[styles.input, {marginTop: 10}]} value={department} onChangeText={setDepartment} placeholder="Bölüm (Örn: Bilgisayar Müh.)" placeholderTextColor="#475569" />
            </View>

            {/* İlgi Alanları */}
            <View style={styles.section}>
              <Text style={styles.label}>İLGİ ALANLARI (Eklemek için Enter'a basın)</Text>
              <TextInput 
                style={styles.input} 
                value={interestInput} 
                onChangeText={setInterestInput} 
                onSubmitEditing={() => addItem('interest')}
                placeholder="Yeni ekle..." 
                placeholderTextColor="#475569" 
              />
              {renderChips(interests, 'interest')}
            </View>

            {/* Yetenekler */}
            <View style={styles.section}>
              <Text style={styles.label}>YETENEKLER (Eklemek için Enter'a basın)</Text>
              <TextInput 
                style={styles.input} 
                value={skillInput} 
                onChangeText={setSkillInput} 
                onSubmitEditing={() => addItem('skill')}
                placeholder="Yeni ekle..." 
                placeholderTextColor="#475569" 
              />
              {renderChips(skills, 'skill')}
            </View>

            {/* Aksiyon Butonları */}
            <View style={styles.actionGroup}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Kaydet</Text>}
              </TouchableOpacity>
            </View>

            {/* Tehlikeli Bölge */}
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
              <Text style={styles.deleteText}>Hesabımı Kalıcı Olarak Sil</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.9)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#1e293b', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
  handle: { width: 40, height: 4, backgroundColor: '#334155', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 24 },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', marginBottom: 8, letterSpacing: 0.5 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#10b981' },
  chipText: { color: '#fff', marginRight: 6, fontSize: 13 },
  actionGroup: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 14, backgroundColor: '#334155' },
  saveBtn: { flex: 2, padding: 16, alignItems: 'center', borderRadius: 14, backgroundColor: '#10b981' },
  cancelText: { color: '#fff', fontWeight: '600' },
  saveText: { color: '#fff', fontWeight: 'bold' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, padding: 12, gap: 8 },
  deleteText: { color: '#ef4444', fontSize: 13, fontWeight: '600' }
});

export default EditProfileModal;