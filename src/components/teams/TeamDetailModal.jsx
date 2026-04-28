import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react"; // useEffect eklendi
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import TeamService from "../../services/teamService";

const TeamDetailModal = ({ visible, onClose, team, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // --- KRİTİK DEBUG LOGLARI ---
  // Uygulama çalışırken terminaline bak, bu değerlerin ne geldiğini gör

  if (!team) return null;

  const currentUserId = (user?._id || user?.id)?.toString();

  // --- 1. VERİLERİ ÇEKME ---
  const baslik = team.baslik || "İsimsiz Ekip";
  const aciklama = team.aciklama || "Açıklama belirtilmemiş.";
  const yetkinlikler = team.arananYetkinlikler || [];
  const kontenjan = team.kontenjan || 1;
  const uyeler = team.uyeler || team.members || [];
  const mevcutUyeSayisi = uyeler.length;

  // --- 2. DURUM KONTROLLERİ (EN SAĞLAM HALİ) ---
  // Güvenli ID çıkarıcı
  const getSafeId = (val) => {
    if (!val) return null;
    if (typeof val === "object") return (val._id || val.id)?.toString();
    return val.toString();
  };
  // Kurucu kontrolü
  const isOwner = getSafeId(team.olusturanId) === currentUserId;

  // Üyelik kontrolü
  const isMember = uyeler.some((u) => getSafeId(u) === currentUserId);
  const isOpen = mevcutUyeSayisi < kontenjan;
  const statusText = isOpen ? "Açık" : "Dolu";

  // --- 3. AKSİYONLAR ---

  const handleJoinTeam = async () => {
    try {
      setLoading(true);
      await TeamService.joinTeam(team._id);
      Alert.alert("Tebrikler!", "Ekibe başarıyla katıldınız.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Hata oluştu.";
      Alert.alert("Hata", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    Alert.alert("Ekipten Ayrıl", "Emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Ayrıl",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await TeamService.leaveTeam(team._id);
            Alert.alert("Bilgi", "Ekipten ayrıldınız.");
            if (onSuccess) onSuccess();
            onClose();
          } catch (_error) {
            console.log(
              "AYRILMA HATASI DETAYI:",
              _error.response?.data || _error.message,
            );

            // Backend'den gelen özel bir hata mesajı varsa onu, yoksa varsayılan metni gösterelim
            const backendMesaji =
              _error.response?.data?.message || "Ayrılırken bir hata oluştu.";
            Alert.alert("Hata", backendMesaji);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleDeleteTeam = async () => {
    Alert.alert("İlanı Sil", "Bu işlem geri alınamaz!", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await TeamService.deleteTeam(team._id);
            Alert.alert("Başarılı", "İlan silindi.");
            if (onSuccess) onSuccess();
            onClose();
          } catch (_error) {
            Alert.alert("Hata", "Silinirken bir hata oluştu.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // --- 4. BUTON MANTIĞI ---
  const renderActionButton = () => {
    if (loading) return <ActivityIndicator color="#10b981" />;

    // SAHİBİ İSE: Sil Butonu
    if (isOwner) {
      return (
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: "#ef4444" }]}
          onPress={handleDeleteTeam}
        >
          <Text style={styles.mainButtonText}>İlanı Sil</Text>
        </TouchableOpacity>
      );
    }

    // ÜYE İSE: Ayrıl Butonu
    if (isMember) {
      return (
        <TouchableOpacity
          style={[styles.mainButton, styles.leaveButton]}
          onPress={handleLeaveTeam}
        >
          <Text style={styles.leaveButtonText}>Ekipten Ayrıl</Text>
        </TouchableOpacity>
      );
    }

    // ÜYE DEĞİL AMA DOLU İSE
    if (!isOpen) {
      return (
        <View style={[styles.mainButton, styles.disabledButton]}>
          <Text style={styles.mainButtonText}>Kontenjan Dolu</Text>
        </View>
      );
    }

    // ÜYE DEĞİL VE YER VARSA: Katıl Butonu
    return (
      <TouchableOpacity style={styles.mainButton} onPress={handleJoinTeam}>
        <Text style={styles.mainButtonText}>Ekibe Katıl</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={24} color="#f8fafc" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ekip Detayı</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.infoBox}>
              <Text style={styles.title}>{baslik}</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isOpen
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(148, 163, 184, 0.1)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isOpen ? "#10b981" : "#94a3b8" },
                  ]}
                >
                  {statusText}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Proje Açıklaması</Text>
            <Text style={styles.description}>{aciklama}</Text>

            {yetkinlikler.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Aranan Yetkinlikler</Text>
                <View style={styles.tagContainer}>
                  {yetkinlikler.map((tag, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.sectionTitle}>Ekip Durumu</Text>
            <Text style={styles.memberCount}>
              👤 Mevcut Üye Sayısı: {mevcutUyeSayisi} / {kontenjan}
            </Text>
          </ScrollView>

          <View style={styles.footer}>{renderActionButton()}</View>
        </View>
      </View>
    </Modal>
  );
};

// ... Styles objen (Önceki mesajdakiyle aynı kalabilir)
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "#020617" },
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#f8fafc" },
  content: { paddingHorizontal: 24 },
  infoBox: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#10b981",
    marginBottom: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
    color: "#f1f5f9",
    textTransform: "uppercase",
  },
  description: { fontSize: 15, color: "#94a3b8", lineHeight: 24 },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  tagText: { color: "#cbd5e1", fontWeight: "500" },
  memberCount: { fontSize: 15, color: "#64748b", fontWeight: "600" },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  mainButton: {
    backgroundColor: "#10b981",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  mainButtonText: { color: "white", fontWeight: "800", fontSize: 16 },
  disabledButton: { backgroundColor: "#1e293b", opacity: 0.6 },
  leaveButton: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  leaveButtonText: { color: "#ef4444", fontWeight: "800", fontSize: 16 },
  closeButton: { padding: 8 },
});

export default TeamDetailModal;
