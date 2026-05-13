import { Ionicons } from "@expo/vector-icons"; // Düzenle ikonu için ekledik
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// onEdit prop'unu ekledik (TeamsScreen'den geliyor)
const TeamCard = ({ team, isOwner, isMember, onEdit, onLeave, onDelete }) => {
  // 1. Backend verilerini güvenli bir şekilde alıyoruz (Eğer veri yoksa varsayılan değerler atıyoruz)
  const baslik = team?.baslik || "İsimsiz Ekip";
  const aciklama = team?.aciklama || "Açıklama belirtilmemiş.";
  const yetkinlikler = team?.arananYetkinlikler || [];
  const kontenjan = team?.kontenjan || 1;
  const mevcutUyeSayisi = team?.uyeler?.length || 0;

  // 2. Durumu Otomatik Hesapla: Mevcut üye sayısı kontenjandan azsa "Açık"tır.
  const isOpen = mevcutUyeSayisi < kontenjan;
  const statusText = isOpen ? "Açık" : "Dolu";

  // Renkleri duruma göre belirliyoruz
  const statusColor = isOpen ? "#28A745" : "#6C757D";
  const statusBg = isOpen ? "#D1E7DD" : "#E2E3E5";

  return (
    <View style={styles.card}>
      {/* Üst Kısım: Avatar ve Durum Etiketi */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: statusColor }]}>
            <Text style={styles.avatarText}>
              {baslik.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Eğer onEdit fonksiyonu gönderildiyse (yani kullanıcı bu ilanın sahibiyse) Düzenle İkonu göster */}
          {isOwner && onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={[
                styles.editButton,
                { borderColor: "rgba(239, 68, 68, 0.3)" },
              ]}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}

          {/* SAHİBİ İSE DÜZENLE BUTONU */}
          {isOwner && onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#856404" />
            </TouchableOpacity>
          )}

          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>
      </View>

      {/* Orta Kısım: Başlık ve Açıklama */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {baslik}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {aciklama}
        </Text>
      </View>

      {/* Etiketler (Tags) */}
      {yetkinlikler.length > 0 && (
        <View style={styles.tagContainer}>
          {yetkinlikler.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Alt Kısım: Üye Sayısı ve İşlem Butonu */}
      <View style={styles.footer}>
        <View style={styles.memberInfo}>
          {/* Üye sayısını string yerine otomatik hesaplanan değerlerden basıyoruz (ör: 2/5 üye) */}
          <Text style={styles.memberText}>
            👤 {mevcutUyeSayisi}/{kontenjan} üye
          </Text>
        </View>

        {/* Not: Bu butona basıldığında zaten tüm kart TouchableOpacity olduğu için TeamsScreen'deki handleCardPress tetiklenir ve Detay Modalı açılır. */}
        <View style={[styles.actionButton, !isOpen && styles.disabledButton]}>
          <Text style={styles.actionButtonText}>
            {isOpen ? "İncele" : "Dolu"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.4)", // Referansındaki glassForm ile aynı
    borderRadius: 24, // Daha yumuşak köşeler
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)", // İnce cam kenarlığı
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  editButton: {
    backgroundColor: "rgba(148, 163, 184, 0.1)", // Slate 400 şeffaf tonu
    padding: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1e293b", // Koyu lacivert avatar zemini
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)", // Hafif yeşil kontür
  },
  avatarText: { color: "#10b981", fontWeight: "800", fontSize: 20 }, // Emerald yeşili harf
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.15)", // Hafif yeşil transparan badge
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#10b981",
    textTransform: "uppercase",
  },
  content: { marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f8fafc", // Off-white başlık
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: "#94a3b8", // Slate 400 (Daha okunabilir)
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  tag: {
    backgroundColor: "#0f172a", // Koyu giriş alanı rengi
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  tagText: { fontSize: 12, color: "#cbd5e1", fontWeight: "500" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 16,
  },
  memberInfo: { flexDirection: "row", alignItems: "center" },
  memberText: { fontSize: 14, color: "#64748b", fontWeight: "600" },
  actionButton: {
    backgroundColor: "#10b981", // Emerald ana buton
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#1e293b",
    opacity: 0.5,
  },
  actionButtonText: { color: "white", fontWeight: "800", fontSize: 14 },
});

export default TeamCard;
