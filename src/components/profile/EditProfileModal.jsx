import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// ÖNEMLİ: react-native içindeki Modal yerine bunu kullanıyoruz
import Modal from 'react-native-modal';
import api from '../../services/api';

const EditProfileModal = ({ visible, onClose, currentUser, onUpdateSuccess, onLogout }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && currentUser) {
      setFirstName(currentUser.ad || '');
      setLastName(currentUser.soyad || '');
      setDepartment(currentUser.bolum || '');
      setInterests(currentUser.ilgi_alanlari || []);
      setSkills(currentUser.yetenekler || []);
    }
  }, [visible, currentUser]);

  const addItem = (type) => {
    if (type === 'interest' && interestInput.trim()) {
      if (!interests.includes(interestInput.trim())) setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    } else if (type === 'skill' && skillInput.trim()) {
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeItem = (type, index) => {
    if (type === 'interest') setInterests(interests.filter((_, i) => i !== index));
    else setSkills(skills.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = { firstName, lastName, department, interests, skills };
      const response = await api.put('/v1/profile', payload); 
      
      onUpdateSuccess({
        id: response.data._id || response.data.id,
        ad: response.data.firstName,
        soyad: response.data.lastName,
        bolum: response.data.department || "",
        email: response.data.email,
        ilgi_alanlari: response.data.interests || [],
        yetenekler: response.data.skills || []
      });
      Alert.alert("Başarılı", "Profil güncellendi.");
      onClose();
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      Alert.alert("Hata", "Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      Alert.alert(
        "Hesabı Sil",
        "Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
        [
          { text: "Vazgeç", style: "cancel" },
          { 
            text: "Evet, Sil", 
            style: "destructive", 
            onPress: async () => {
              setLoading(true);
              try {
                await api.delete('/v1/profile'); 
                onClose();
                // Buradaki navigation.navigate kısmını projenin yapısına göre 
                // onLogout() fonksiyonunu çağırarak yönetmen daha temiz olur.
                if (onLogout) await onLogout();
              } catch (e) {
                Alert.alert("Hata", "Silme işlemi başarısız.");
              } finally {
                setLoading(false);
              }
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  return (
    <Modal 
      isVisible={visible} // Prop adı isVisible olarak değişti
      onSwipeComplete={onClose} // Çekme bitince kapat
      swipeDirection="down" // Sadece aşağı çekince çalışsın
      onBackdropPress={onClose} // Dışarıya basınca kapat (Opsiyonel)
      onBackButtonPress={onClose} // Android geri tuşu için
      propagateSwipe={true} // ScrollView ile kaydırmanın çakışmasını engeller
      backdropColor="#020617" // Senin orijinal overlay rengin
      backdropOpacity={0.9} // Senin orijinal şeffaflık değerin
      style={{ margin: 0, justifyContent: 'flex-end' }} // Alt kısma yapıştır
      statusBarTranslucent
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.modalContainer}
      >
        {/* Senin handle tasarımın */}
        <View style={styles.handle} />
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={{flex: 1}}
          keyboardShouldPersistTaps="always"
        >
          <Text style={styles.title}>Profili Düzenle</Text>
          
          <View style={styles.section}>
            <Text style={styles.label}>KİŞİSEL BİLGİLER</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Ad" placeholderTextColor="#475569" />
            <TextInput style={[styles.input, {marginTop: 10}]} value={lastName} onChangeText={setLastName} placeholder="Soyad" placeholderTextColor="#475569" />
            <TextInput style={[styles.input, {marginTop: 10}]} value={department} onChangeText={setDepartment} placeholder="Bölüm" placeholderTextColor="#475569" />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>İLGİ ALANLARI</Text>
            <TextInput style={styles.input} value={interestInput} onChangeText={setInterestInput} onSubmitEditing={() => addItem('interest')} placeholder="Ekle ve Enter'a bas" placeholderTextColor="#475569" />
            <View style={styles.chipContainer}>
              {interests.map((item, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeItem('interest', i)}><Ionicons name="close-circle" size={16} color="#10b981" /></TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>YETENEKLER</Text>
            <TextInput style={styles.input} value={skillInput} onChangeText={setSkillInput} onSubmitEditing={() => addItem('skill')} placeholder="Ekle ve Enter'a bas" placeholderTextColor="#475569" />
            <View style={styles.chipContainer}>
              {skills.map((item, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeItem('skill', i)}><Ionicons name="close-circle" size={16} color="#10b981" /></TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.actionGroup}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>İptal</Text></TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Kaydet</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.deleteArea}>
             <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
              <Text style={styles.deleteText}>Hesabımı Kalıcı Olarak Sil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { backgroundColor: '#1e293b', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, height: '90%' },
  handle: { width: 40, height: 4, backgroundColor: '#334155', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 24 },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#10b981' },
  chipText: { color: '#fff', marginRight: 6, fontSize: 13 },
  actionGroup: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 14, backgroundColor: '#334155' },
  saveBtn: { flex: 2, padding: 16, alignItems: 'center', borderRadius: 14, backgroundColor: '#10b981' },
  cancelText: { color: '#fff', fontWeight: '600' },
  saveText: { color: '#fff', fontWeight: 'bold' },
  deleteArea: { marginTop: 30, marginBottom: 50, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 20 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, gap: 8 },
  deleteText: { color: '#ef4444', fontSize: 14, fontWeight: 'bold' }
});

export default EditProfileModal;