import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import TeamService from "../../services/teamService";
// Hazırladığımız bileşenleri import ediyoruz
import CreateTeamModal from "../../components/teams/CreateTeamModal";
import EditTeamModal from "../../components/teams/EditTeamModal";
import TeamCard from "../../components/teams/TeamCard";
import TeamDetailModal from "../../components/teams/TeamDetailModal";

const TeamsScreen = () => {
  // --- STATE YÖNETİMİ ---
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [isCreateVisible, setCreateVisible] = useState(false);
  const [isEditVisible, setEditVisible] = useState(false);
  const [isDetailVisible, setDetailVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Backend Veri Stateleri
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // --- MOCK DATA (Backend bağlanana kadar) ---

  const filters = ["Tümü", "Açık", "Benim İlanlarım", "Katıldıklarım"];

  // --- API İSTEĞİ (BACKEND BAĞLANTISI) ---
  const fetchTeams = useCallback(
    async (filterText = activeFilter) => {
      // UI'daki Türkçe filtreleri Backend'in beklediği İngilizce filtrelere çeviriyoruz
      let backendFilter = "all";
      if (filterText === "Açık") backendFilter = "open";
      if (filterText === "Benim İlanlarım") backendFilter = "mine";
      if (filterText === "Katıldıklarım") backendFilter = "joined";

      try {
        // TeamService.js'teki listTeams fonksiyonunu çağırıyoruz (sayfa 1, limit 20 olarak verdim)
        const data = await TeamService.listTeams(1, 20, backendFilter);
        // Backend { teams, total, page... } dönüyor, biz teams dizisini alıyoruz
        setTeams(data.teams);
      } catch (error) {
        console.error("İlanlar yüklenirken hata:", error);
        Alert.alert("Hata", "Ekip ilanları yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeFilter],
  ); // <-- FARK BURADA: activeFilter'ı bağımlılık olarak ekledik

  // Filtre değiştiğinde (veya sayfa ilk açıldığında) verileri getir
  useEffect(() => {
    setLoading(true);
    fetchTeams(activeFilter);
  }, [activeFilter, fetchTeams]);

  // Ekranı yukarıdan çekip yenileme (Pull to Refresh)
  const onRefresh = () => {
    setRefreshing(true);
    fetchTeams();
  };

  // --- FONKSİYONLAR ---
  const handleCardPress = (team) => {
    setSelectedTeam(team);
    setDetailVisible(true);
  };

  const handleEditPress = (team) => {
    setSelectedTeam(team);
    setEditVisible(true);
  };

  const handleDataRefresh = () => {
    fetchTeams();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ekip İlanları</Text>
          <Text style={styles.headerSubtitle}>
            Sana uygun ekibi bul veya kur
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setCreateVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.createButtonText}>İlan Oluştur</Text>
        </TouchableOpacity>
      </View>

      {/* 2. FİLTRELEME TABS */}
      <View style={styles.filterContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === item && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter(item)} // Tıklandığında useEffect tetiklenecek ve yeni veriler gelecek
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 3. İLAN LİSTESİ */}
      {loading ? (
        // Veri Yüklenirken Gösterilecek Ekran
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E7A42" />
          <Text style={{ marginTop: 10, color: "#6C757D" }}>
            İlanlar aranıyor...
          </Text>
        </View>
      ) : (
        <FlatList
          data={teams} // Artık mockData veya client filter kullanmıyoruz, doğrudan backend'den gelen liste
          keyExtractor={(item) => item._id} // MongoDB'nin _id formatına uygun hale getirdik
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh} // Yenileme özelliği aktif
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCardPress(item)}
            >
              <TeamCard
                team={item}
                // Backend'den olusturanId mi yoksa isOwner gibi bir boolean mı dönüyor buna dikkat etmelisin.
                // Eğer isOwner dönmüyorsa, giriş yapan kullanıcının ID'si ile ilan sahibini kıyaslaman gerekebilir.
                onEdit={() => handleEditPress(item)}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Bu kategoride ilan bulunamadı.</Text>
          }
        />
      )}

      {/* 4. MODAL'LAR */}
      <CreateTeamModal
        visible={isCreateVisible}
        onClose={() => setCreateVisible(false)}
        onSuccess={handleDataRefresh} // İlan başarıyla açılırsa listeyi yeniler (Bunu modal içinde çağırman gerekecek)
      />

      <EditTeamModal
        visible={isEditVisible}
        onClose={() => setEditVisible(false)}
        initialData={selectedTeam}
        onSuccess={handleDataRefresh}
      />

      <TeamDetailModal
        visible={isDetailVisible}
        onClose={() => setDetailVisible(false)}
        team={selectedTeam}
        onSuccess={handleDataRefresh} // Ekipten ayrılma/katılma olunca yenilemek istersen
      />
    </SafeAreaView>
  );
};

// ... Styles objen aynen kalıyor, sadece center sınıfını ekledim
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#020617", // Beyazdan kurtulduk
  },
  headerTitle: {
    fontSize: 26, // Biraz daha büyütüp logotype havası verdik
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: "500",
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#10b981", // Emerald yeşili
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14, // Referansına uygun daha köşeli/yumuşak dengesi
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 6,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingLeft: 24,
    backgroundColor: "#020617",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)", // Çok ince bir ayraç
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.5)", // Glassmorphism efekti
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeFilterTab: {
    backgroundColor: "rgba(16, 185, 129, 0.15)", // Şeffaf yeşil dolgu
    borderColor: "rgba(16, 185, 129, 0.4)", // Yeşil kenarlık
  },
  filterText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#10b981",
    fontWeight: "800",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#475569", // Slate 500
    fontSize: 16,
    fontWeight: "500",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});

export default TeamsScreen;