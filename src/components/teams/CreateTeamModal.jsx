import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

// onSuccess prop'unu ekledik ki ana sayfadaki listeyi yenileyebilelim
const CreateTeamModal = ({ visible, onClose, onSuccess }) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [capacity, setCapacity] = useState("");

  // Backend isteği atılırken butonu dondurmak için loading state'i
  const [loading, setLoading] = useState(false);

  const descriptionLimit = 500;

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // İlan Oluşturma İşlemi (Gerçek Backend Çağrısı)
  const handleCreateTeam = async () => {
    // 1. Temel Doğrulamalar (Validation)
    if (!teamName.trim() || !description.trim() || !capacity.trim()) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen ekip adı, açıklama ve kontenjan alanlarını doldurun.",
      );
      return;
    }

    // Kontenjanın sayısal bir değer olup olmadığını kontrol edelim
    const capacityNumber = parseInt(capacity, 10);
    if (isNaN(capacityNumber) || capacityNumber <= 0) {
      Alert.alert(
        "Geçersiz Değer",
        "Lütfen geçerli bir kontenjan sayısı girin.",
      );
      return;
    }

    try {
      setLoading(true); // Yükleniyor durumunu başlat

      // 2. Backend'in beklediği formatta veriyi hazırlıyoruz.
      // Not: Backend controller'ında beklenen parametre adları: baslik, aciklama, kontenjan, arananYetkinlikler
      const teamData = {
        baslik: teamName,
        aciklama: description,
        kontenjan: capacityNumber,
        arananYetkinlikler: skills, // Liste olarak gönderiyoruz
      };

      // 3. İsteği Atıyoruz
      await TeamService.createTeam(teamData);

      Alert.alert("Başarılı", "Ekip ilanı başarıyla oluşturuldu.");

      // 4. Formu Temizle
      setTeamName("");
      setDescription("");
      setSkills([]);
      setCapacity("");

      // 5. Ana sayfayı yenile ve Modalı kapat
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Ekip oluşturma hatası:", error);
      Alert.alert(
        "Hata",
        "İlan oluşturulurken bir sorun meydana geldi. Lütfen tekrar deneyin.",
      );
    } finally {
      setLoading(false); // İşlem bitti, butonu eski haline getir
    }
  };

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
              <View style={styles.iconBackground}>
                <Ionicons name="add-circle-outline" size={24} color="#1E7A42" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Ekip İlanı Oluştur</Text>
                <Text style={styles.modalSubtitle}>
                  Ekibine katılacak kişileri bul
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons name="close" size={24} color="#6C757D" />
            </TouchableOpacity>
          </View>

          {/* Form Alanları */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Ekip Adı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ekip Adı</Text>
              <TextInput
                style={styles.input}
                placeholder="ör. TechBridge Hackathon Takımı"
                value={teamName}
                onChangeText={setTeamName}
                placeholderTextColor="#A9A9A9"
                editable={!loading} // Yüklenirken form düzenlenemesin
              />
            </View>

            {/* Açıklama */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Projenizi, hedeflerinizi ve ne tür ekip arkadaşları aradığınızı anlatın..."
                multiline={true}
                numberOfLines={5}
                value={description}
                onChangeText={setDescription}
                maxLength={descriptionLimit}
                placeholderTextColor="#A9A9A9"
                editable={!loading}
              />
              <Text style={styles.charCount}>
                {description.length}/{descriptionLimit}
              </Text>
            </View>

            {/* Aranan Yetkinlikler */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aranan Yetkinlikler</Text>
              <View style={styles.skillInputContainer}>
                <TextInput
                  style={[styles.input, styles.skillInput]}
                  placeholder="ör. React, Python, Figma — Enter ile ekle"
                  value={skillInput}
                  onChangeText={setSkillInput}
                  onSubmitEditing={handleAddSkill}
                  placeholderTextColor="#A9A9A9"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.addSkillButton}
                  onPress={handleAddSkill}
                  disabled={loading}
                >
                  <Ionicons name="add" size={20} color="#1E7A42" />
                </TouchableOpacity>
              </View>
              {/* Eklenen Yetkinliklerin Listesi (Tags) */}
              <View style={styles.skillTagsContainer}>
                {skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSkill(skill)}
                      disabled={loading}
                    >
                      <Ionicons name="close" size={16} color="#495057" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Kontenjan */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kontenjan</Text>
              <View style={styles.capacityContainer}>
                <TextInput
                  style={[styles.input, styles.capacityInput]}
                  placeholder="ör. 4"
                  keyboardType="numeric"
                  value={capacity}
                  onChangeText={setCapacity}
                  placeholderTextColor="#A9A9A9"
                  editable={!loading}
                />
                <Text style={styles.capacitySuffix}>kişi</Text>
              </View>
            </View>
          </ScrollView>

          {/* Butonlar */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, loading && { opacity: 0.7 }]} // Yüklenirken buton rengini hafif soluk yap
              onPress={handleCreateTeam}
              disabled={loading} // Yüklenirken ard arda basılmasını engelle
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.createButtonText}>İlan Oluştur</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ... style objen aynen kalıyor, hiçbir yeri değiştirmedim
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Arkadaki overlay'i biraz daha derinleştirdik
  },
  modalView: {
    backgroundColor: "#020617", // Ana arka plan (Referansa uygun)
    borderTopLeftRadius: 28, // Köşeleri biraz daha yumuşattık
    borderTopRightRadius: 28,
    padding: 24,
    height: "90%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)", // Cam efekti (glassmorphism) için ince kenarlık
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  iconBackground: {
    backgroundColor: "rgba(16, 185, 129, 0.15)", // Şeffaf zümrüt yeşili arka plan
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f8fafc", // Saf beyaz yerine Slate 50 (Göz yormaz)
    letterSpacing: -0.5,
  },
  modalSubtitle: { fontSize: 14, color: "#94a3b8" }, // Mavi-gri alt başlık
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
    backgroundColor: "#0f172a", // Çok koyu lacivert input alanı
    borderWidth: 1,
    borderColor: "#1e293b", // Input kenarlığı
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#f8fafc",
  },
  textArea: { height: 120, textAlignVertical: "top" },
  charCount: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "right",
    marginTop: 6,
  },
  skillInputContainer: { flexDirection: "row", alignItems: "center" },
  skillInput: { flex: 1 },
  addSkillButton: {
    backgroundColor: "#10b981", // Ana aksiyon yeşili
    padding: 12,
    borderRadius: 14,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  skillTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  skillTag: {
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Hafif yeşil dolgu
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)", // Yeşil kenarlık
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skillTagText: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: "600",
    marginRight: 6,
  },
  capacityContainer: { flexDirection: "row", alignItems: "center" },
  capacityInput: { width: 100, marginRight: 12 },
  capacitySuffix: { fontSize: 14, color: "#94a3b8" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  cancelButton: {
    backgroundColor: "transparent", // İptal butonu artık daha sade
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: "30%",
    alignItems: "center",
  },
  cancelButtonText: { color: "#94a3b8", fontWeight: "600" },
  createButton: {
    backgroundColor: "#10b981", // Canlı yeşil ana buton
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: "60%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981", // Butona hafif bir parlama efekti
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});

export default CreateTeamModal;
