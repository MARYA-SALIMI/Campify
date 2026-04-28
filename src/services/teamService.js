import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Doğrudan npm paketini çağırıyoruz, ortak dosyayı değil
// Sadece senin domainine istek atacak özel Axios bağlantın
const teamApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_EMINE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(
  "AXIOS'UN GİTTİĞİ TAM ADRES:",
  process.env.EXPO_PUBLIC_EMINE_API_URL,
);

teamApi.interceptors.request.use(
  async (config) => {
    try {
      // AuthContext'te 'token' ismiyle kaydettiğin için buradan 'token' olarak çekiyoruz
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // Bearer'dan sonra boşluk bırakmayı unutma
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token eklenirken hata oluştu:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const TeamService = {
  /**
   * Ekipleri Listele
   */
  listTeams: async (page = 1, limit = 10, filter = "all") => {
    try {
      // api yerine teamApi kullanıyoruz
      const response = await teamApi.get("/teams", {
        params: { page, limit, filter },
      });
      return response.data;
    } catch (error) {
      console.error("Ekipler listelenirken hata:", error);
      throw error;
    }
  },

  /**
   * Yeni Ekip Oluştur
   */
  createTeam: async (teamData) => {
    try {
      const response = await teamApi.post("/teams", teamData); // api yerine teamApi
      return response.data;
    } catch (error) {
      console.error("Ekip oluşturulurken hata:", error);
      throw error;
    }
  },

  /**
   * Tekil Ekip Detayını Getir
   */
  getTeamById: async (teamId) => {
    try {
      const response = await teamApi.get(`/teams/${teamId}`); // api yerine teamApi
      return response.data;
    } catch (error) {
      console.error("Ekip detayı alınırken hata:", error);
      throw error;
    }
  },

  /**
   * Ekibi Güncelle
   */
  updateTeam: async (teamId, updatedData) => {
    try {
      const response = await teamApi.put(`/teams/${teamId}`, updatedData); // api yerine teamApi
      return response.data;
    } catch (error) {
      console.error("Ekip güncellenirken hata:", error);
      throw error;
    }
  },

  /**
   * Ekibi Sil
   */
  deleteTeam: async (teamId) => {
    try {
      const response = await teamApi.delete(`/teams/${teamId}`); // api yerine teamApi
      return response.data;
    } catch (error) {
      console.error("Ekip silinirken hata:", error);
      throw error;
    }
  },

  /**
   * Ekibe Katıl
   */
  joinTeam: async (teamId) => {
    try {
      const response = await teamApi.post(`/teams/${teamId}/join`); // api yerine teamApi
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Ekipten Ayrıl
   */
  leaveTeam: async (teamId) => {
    try {
      const response = await teamApi.delete(`/teams/${teamId}/leave`); // api yerine teamApi
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default TeamService;
