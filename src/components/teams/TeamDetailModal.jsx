import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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

// Backend servisimiz
import TeamService from "../../services/teamService";
// Projede giriş yapmış kullanıcının ID'sini (veya bilgisini) çekmek için Auth Context'ini buraya dahil etmelisin.
// Aşağıdaki satırı kendi projenin yapısına göre ayarlamalısın.
// import { useAuth } from "../../context/AuthContext";

const TeamDetailModal = ({ visible, onClose, team, onSuccess }) => {
  // ŞİMDİLİK: Eğer AuthContext'in henüz tam hazır değilse, test için buraya manuel bir userId verebilirsin.
  const { user } = useAuth();
  const currentUserId = user?._id || null; // Eğer JWT kullanıyorsan backend bu ID'yi kendi bulur, senin göndermene bile gerek kalmayabilir!

  const [loading, setLoading] = useState(false);

  if (!team) return null;

  // --- 1. VERİLERİ GÜVENLİ ÇEKME VE HESAPLAMA ---
  const baslik = team.baslik || "İsimsiz Ekip";
  const aciklama = team.aciklama || "Açıklama belirtilmemiş.";
  const yetkinlikler = team.arananYetkinlikler || [];
  const kontenjan = team.kontenjan || 1;
  const uyeler = team.uyeler || [];
  const mevcutUyeSayisi = uyeler.length;

  const isOpen = mevcutUyeSayisi < kontenjan;
  const statusText = isOpen ? "Açık" : "Dolu";

  // --- 2. KULLANICI DURUMUNU KONTROL ETME ---
  // Kullanıcı zaten bu ekibin bir üyesi mi?
  // Not: Eğer uyeler dizisi string ID'lerden oluşuyorsa 'includes', obje ise '.some(u => u._id === currentUserId)' kullanman gerekir.
  const isMember =
    uyeler.includes(currentUserId) ||
    uyeler.some((u) => u === currentUserId || u._id === currentUserId);

  // Kullanıcı bu ilanın kurucusu mu?
  const isOwner = team.olusturanId === currentUserId;

  // --- 3. BACKEND AKSİYONLARI ---

  // Ekibe Katılma İşlemi
  const handleJoinTeam = async () => {
    try {
      setLoading(true);
      await TeamService.joinTeam(team._id); // API'ye istek gidiyor
      Alert.alert("Tebrikler!", "Ekibe başarıyla katıldınız.");
      if (onSuccess) onSuccess(); // Ana sayfadaki listeyi yenile
      onClose(); // Modalı kapat
    } catch (error) {
      // Backend'den fırlattığın 'TEAM_FULL' veya 'ALREADY_MEMBER' hatasını yakala
      const errorMessage =
        error.response?.data?.message || "Ekibe katılırken bir hata oluştu.";
      Alert.alert("Katılamadınız", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Ekipten Ayrılma İşlemi
  const handleLeaveTeam = async () => {
    // Önce kullanıcıya emin misin diye soralım (UX için iyidir)
    Alert.alert(
      "Ekipten Ayrıl",
      "Bu ekipten ayrılmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Ayrıl",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await TeamService.leaveTeam(team._id); // API'ye ayrılma isteği
              Alert.alert("Bilgi", "Ekipten ayrıldınız.");
              if (onSuccess) onSuccess();
              onClose();
            } catch (error) {
              // Backend'den gelen 'OWNER_CANNOT_LEAVE' hatası burada yakalanır
              const errorMessage =
                error.response?.data?.message || "Ayrılırken bir hata oluştu.";
              Alert.alert("Hata", errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // --- 4. BUTON RENDER MANTIĞI ---
  const renderActionButton = () => {
    if (loading) {
      return (
        <View style={[styles.mainButton, { backgroundColor: "#6C757D" }]}>
          <ActivityIndicator color="white" />
        </View>
      );
    }

    // 1. Durum: İlanı açan kişi kendisiyse
    if (isOwner) {
      return (
        <View style={[styles.mainButton, styles.disabledButton]}>
          <Text style={styles.mainButtonText}>Kendi İlanınız</Text>
        </View>
      );
    }

    // 2. Durum: Zaten üyeyse "Ayrıl" butonu göster
    if (isMember) {
      return (
        <TouchableOpacity
          style={[styles.mainButton, styles.leaveButton]}
          onPress={handleLeaveTeam}
        >
          <Text style={styles.mainButtonText}>Ekipten Ayrıl</Text>
        </TouchableOpacity>
      );
    }

    // 3. Durum: Üye değil ama Kontenjan Dolu
    if (!isOpen) {
      return (
        <View style={[styles.mainButton, styles.disabledButton]}>
          <Text style={styles.mainButtonText}>Ekip Kontenjanı Dolu</Text>
        </View>
      );
    }

    // 4. Durum: Üye değil, yer de var (Katıl Butonu)
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
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
                  { backgroundColor: isOpen ? "#D1E7DD" : "#E2E3E5" },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isOpen ? "#1E7A42" : "#6C757D" },
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

          {/* Aksiyon Butonu */}
          <View style={styles.footer}>{renderActionButton()}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#020617", // Referanstaki safeArea rengiyle aynı
  },
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc", // Off-white
  },
  content: { paddingHorizontal: 24 },
  infoBox: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: "900", // Daha vurgulu, logoText stili gibi
    color: "#10b981", // Zümrüt yeşili
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#10b981" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
    color: "#f1f5f9", // Açık gri/beyaz
    letterSpacing: 0.5,
    textTransform: "uppercase", // Bölüm başlıklarını daha profesyonel yapar
  },
  description: {
    fontSize: 15,
    color: "#94a3b8", // Slate 400
    lineHeight: 24,
  },
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
    backgroundColor: "rgba(2, 6, 23, 0.8)", // Sabit alt kısım için hafif transparan
  },
  mainButton: {
    backgroundColor: "#10b981", // Ana aksiyon rengi
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: "#1e293b",
    opacity: 0.6,
  },
  leaveButton: {
    backgroundColor: "rgba(239, 68, 68, 0.15)", // Şeffaf kırmızı arka plan
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  mainButtonText: { color: "white", fontWeight: "800", fontSize: 16 },
  leaveButtonText: { color: "#ef4444", fontWeight: "800", fontSize: 16 }, // Kırmızı metin
});

export default TeamDetailModal;
