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

import CreateTeamModal from "../../components/teams/CreateTeamModal";
import EditTeamModal from "../../components/teams/EditTeamModal";
import TeamCard from "../../components/teams/TeamCard";
import TeamDetailModal from "../../components/teams/TeamDetailModal";
import { useAuth } from "../../context/AuthContext";
import TeamService from "../../services/teamService";

const TeamsScreen = () => {
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [isCreateVisible, setCreateVisible] = useState(false);
  const [isEditVisible, setEditVisible] = useState(false);
  const [isDetailVisible, setDetailVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = ["Tümü", "Açık", "Benim İlanlarım", "Katıldıklarım"];

  const fetchTeams = useCallback(
    async (filterText = activeFilter) => {
      let backendFilter = "all";
      if (filterText === "Açık") backendFilter = "open";
      if (filterText === "Benim İlanlarım") backendFilter = "mine";
      if (filterText === "Katıldıklarım") backendFilter = "joined";

      try {
        const data = await TeamService.listTeams(1, 20, backendFilter);
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
  );

  useEffect(() => {
    setLoading(true);
    fetchTeams(activeFilter);
  }, [activeFilter, fetchTeams]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeams();
  };

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

  const handleLeaveTeam = (team) => {
    Alert.alert("Ekipten Ayrıl", "Emin misin?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Ayrıl",
        style: "destructive",
        onPress: async () => {
          try {
            await TeamService.leaveTeam(team._id);
            fetchTeams();
          } catch (_e) {
            Alert.alert("Hata", "Ayrılırken bir sorun oluştu.");
          }
        },
      },
    ]);
  };

  const handleDeleteTeam = (team) => {
    Alert.alert("İlanı Sil", "Bu ilan kalıcı olarak silinecek!", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await TeamService.deleteTeam(team._id);
            fetchTeams();
          } catch (_e) {
            console.log(
              "AYRILMA HATASI DETAYI:",
              _e.response?.data || _e.message,
            );

            // Backend'den gelen özel bir hata mesajı varsa onu, yoksa varsayılan metni gösterelim
            const backendMesaji =
              _e.response?.data?.message || "Ayrılırken bir hata oluştu.";
            Alert.alert("Hata", backendMesaji);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
              onPress={() => setActiveFilter(item)}
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

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E7A42" />
          <Text style={{ marginTop: 10, color: "#6C757D" }}>
            İlanlar aranıyor...
          </Text>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => {
            // ↓ user.id kullanıyoruz, _id yok!
            const currentUserId = (user?.id || user?._id)?.toString();

            // MERN Populate ihtimaline karşı güvenli ID çıkarıcı
            const getSafeId = (val) => {
              if (!val) return null;
              if (typeof val === "object")
                return (val._id || val.id)?.toString();
              return val.toString();
            };

            const isOwner = getSafeId(item.olusturanId) === currentUserId;

            const isMember = (item.uyeler || []).some((u) => {
              return getSafeId(u) === currentUserId;
            });

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleCardPress(item)}
              >
                <TeamCard
                  team={item}
                  isOwner={isOwner}
                  isMember={isMember}
                  onEdit={() => handleEditPress(item)}
                  onLeave={() => handleLeaveTeam(item)}
                  onDelete={() => handleDeleteTeam(item)}
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Bu kategoride ilan bulunamadı.</Text>
          }
        />
      )}

      <CreateTeamModal
        visible={isCreateVisible}
        onClose={() => setCreateVisible(false)}
        onSuccess={handleDataRefresh}
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
        onSuccess={() => {
          fetchTeams();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#020617",
  },
  headerTitle: {
    fontSize: 26,
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
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
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
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeFilterTab: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.4)",
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
    color: "#475569",
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