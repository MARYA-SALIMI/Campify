import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Servisimizi import ediyoruz
import TeamService from "../../services/teamService";

// onSuccess prop'unu ekliyoruz ki güncelleme bitince liste yenilensin
const EditTeamModal = ({ visible, onClose, initialData, onSuccess }) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [capacity, setCapacity] = useState("");

  const [loading, setLoading] = useState(false); // Backend'e istek atılırken butonu kilitlemek için

  // Modal her açıldığında veya initialData değiştiğinde formu doldur
  useEffect(() => {
    if (initialData) {
      // DİKKAT: Artık MongoDB'den gelen gerçek model field'larını kullanıyoruz
      setTeamName(initialData.baslik || "");
      setDescription(initialData.aciklama || "");
      setSkills(initialData.arananYetkinlikler || []);
      setCapacity(initialData.kontenjan?.toString() || "");
    }
  }, [initialData, visible]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // İlanı Güncelleme İşlemi (Gerçek Backend Çağrısı)
  const handleUpdateTeam = async () => {
    // 1. Validasyon (Boşluk Kontrolü)
    if (!teamName.trim() || !description.trim() || !capacity.trim()) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }

    const capacityNumber = parseInt(capacity, 10);
    if (isNaN(capacityNumber) || capacityNumber <= 0) {
      Alert.alert("Hatalı Giriş", "Lütfen geçerli bir kontenjan sayısı girin.");
      return;
    }

    try {
      setLoading(true);

      // Backend'in beklediği formatta güncel verileri hazırlıyoruz
      const updatedData = {
        baslik: teamName,
        aciklama: description,
        kontenjan: capacityNumber,
        arananYetkinlikler: skills,
      };

      // Backend'e ID (MongoDB _id'si) ve güncellenmiş data gidiyor
      await TeamService.updateTeam(initialData._id, updatedData);

      Alert.alert("Başarılı", "Ekip ilanı başarıyla güncellendi.");

      // Başarılı olursa listeyi yenile ve modalı kapat
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Güncelleme Hatası:", error);
      // Backend'den gelen "Kontenjan mevcut üye sayısından az olamaz" gibi özel hataları UI'da göstermek için:
      const errorMessage =
        error.response?.data?.message || "İlan güncellenirken bir hata oluştu.";
      Alert.alert("Hata", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <View
                style={[styles.iconBackground, { backgroundColor: "#FFF3CD" }]}
              >
                <Ionicons name="create-outline" size={24} color="#856404" />
              </View>
              <View>
                <Text style={styles.modalTitle}>İlanı Düzenle</Text>
                <Text style={styles.modalSubtitle}>
                  Ekip bilgilerini güncelle
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons name="close" size={24} color="#6C757D" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Ekip Adı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ekip Adı</Text>
              <TextInput
                style={styles.input}
                value={teamName}
                onChangeText={setTeamName}
                editable={!loading}
              />
            </View>

            {/* Açıklama */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline={true}
                value={description}
                onChangeText={setDescription}
                editable={!loading}
              />
            </View>

            {/* Yetkinlikler */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aranan Yetkinlikler</Text>
              <View style={styles.skillInputContainer}>
                <TextInput
                  style={[styles.input, styles.skillInput]}
                  placeholder="Enter ile ekle"
                  value={skillInput}
                  onChangeText={setSkillInput}
                  onSubmitEditing={handleAddSkill}
                  editable={!loading}
                />
              </View>
              <View style={styles.skillTagsContainer}>
                {skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSkill(skill)}
                      disabled={loading}
                    >
                      <Ionicons name="close" size={14} color="#495057" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Kontenjan (Edit ekranında yoktu ama backend güncelleyebiliyor, o yüzden buraya ekliyoruz) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kontenjan</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={capacity}
                onChangeText={setCapacity}
                editable={!loading}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateButton, loading && { opacity: 0.7 }]}
              onPress={handleUpdateTeam}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.updateButtonText}>
                  Güncellemeleri Kaydet
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// CSS stillerini aynen bıraktım, sadece kontenjan alanı eklediğim için yapı biraz uzadı
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Diğer modal ile tutarlı derinlik
  },
  modalView: {
    backgroundColor: "#020617", // Ana koyu arka plan
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    height: "85%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  iconBackground: {
    backgroundColor: "rgba(16, 185, 129, 0.12)", // Emerald vurgusu
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },
  modalSubtitle: { fontSize: 13, color: "#94a3b8" },
  scrollContent: { paddingBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cbd5e1",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    color: "#f8fafc",
    fontSize: 15,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  skillInputContainer: { flexDirection: "row", gap: 10 },
  skillInput: { flex: 1 },
  skillTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  skillTag: {
    backgroundColor: "rgba(30, 41, 59, 0.6)", // Glassmorphism efekti
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skillTagText: { fontSize: 12, color: "#f1f5f9", marginRight: 6 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 12, // Butonlar arası boşluk
  },
  cancelButton: {
    backgroundColor: "transparent", // Daha hafif bir görünüm için
    padding: 16,
    borderRadius: 16,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  cancelButtonText: { color: "#94a3b8", fontWeight: "600" },
  updateButton: {
    backgroundColor: "#10b981", // Referansındaki Emerald Green
    padding: 16,
    borderRadius: 16,
    flex: 2,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  updateButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 16 },
});

export default EditTeamModal;
