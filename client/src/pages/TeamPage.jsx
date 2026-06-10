import { useState, useEffect } from "react";
<<<<<<< HEAD
import { useAuth } from "../context/AuthContext"; // 1. DÜZELTME: Bizim auth sistemimiz bağlandı
// import "./teamPage.css"; // 2. DÜZELTME: CSS dosyası olmadığı için hata vermesin diye kapatıldı

// --- 3. DÜZELTME: EKSİK DOSYALAR İÇİN GEÇİCİ BİLEŞENLER (ÇÖKMEYİ ENGELLER) ---
const TeamList = () => <div className="p-4 text-center text-gray-500">Ekip ilanları tasarımı buraya gelecek...</div>;
const TeamCreate = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
      <h2>İlan Oluştur (Yapım Aşamasında)</h2>
      <button className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded" onClick={onClose}>Kapat</button>
    </div>
  </div>
);
const TeamDetail = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
      <h2>Ekip Detayı (Yapım Aşamasında)</h2>
      <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={onClose}>Kapat</button>
    </div>
  </div>
);

// GEÇİCİ SERVİS FONKSİYONLARI (Backend bağlanana kadar sahte veri döner)
const listTeams = async () => ({ teams: [] });
const joinTeam = async () => {};
const leaveTeam = async () => {};
const deleteTeam = async () => {};
// --------------------------------------------------------------------------
=======
import TeamList from "../components/teams/TeamList";
import TeamCreate from "../components/teams/TeamCreate";
import TeamDetail from "../components/teams/TeamDetail";
import { listTeams, joinTeam, leaveTeam, deleteTeam } from "../services/teamService";
import "./teamPage.css";
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971

const FILTERS = [
  { key: "all", label: "Tümü" },
  { key: "open", label: "Açık" },
  { key: "mine", label: "Benim ilanlarım" },
  { key: "joined", label: "Katıldıklarım" },
];

const TeamPage = () => {
<<<<<<< HEAD
  const { currentUser } = useAuth(); // LocalStorage yerine modern kullanım
  const currentUserId = currentUser?.id || "misafir"; 
=======
  const currentUserId = localStorage.getItem("userId") || "65f123456789abcdef123456"; // Auth'tan gelecek
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
=======
    // teamService.getTeams() buraya gelecek
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const data = await listTeams({ filterType: filter });
        setTeams(Array.isArray(data) ? data : data.teams);
      } catch (err) {
        console.error("İlanlar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [filter]);

<<<<<<< HEAD
  const handleJoin = async (teamId) => {
    if (currentUserId === "misafir") return alert("Giriş yapmalısınız!");
    try {
      await joinTeam(teamId);
      // State güncellemeleri...
=======


  const handleJoin = async (teamId) => {
    // teamService.joinTeam(teamId) buraya gelecek
    try {
      await joinTeam(teamId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId && !t.members.map(String).includes(currentUserId)
            ? { ...t, members: [...t.members, currentUserId] }
            : t
        )
      );
      setSelectedTeam((prev) =>
        prev?.id === teamId
          ? { ...prev, members: [...prev.members, currentUserId] }
          : prev
      );
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
    } catch (err) {
      console.error("Katılma hatası:", err);
    }
  };

  const handleLeave = async (teamId) => {
<<<<<<< HEAD
    try {
      await leaveTeam(teamId);
=======
    // teamService.leaveTeam(teamId) buraya gelecek
    try {
      await leaveTeam(teamId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, members: t.members.filter((m) => m.toString() !== currentUserId) }
            : t
        )
      );
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
      setSelectedTeam(null);
    } catch (err) {
      console.error("Ayrılma hatası:", err);
    }
  };

  const handleDelete = async (teamId) => {
<<<<<<< HEAD
=======
    // teamService.deleteTeam(teamId) buraya gelecek
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
    try {
      await deleteTeam(teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      setSelectedTeam(null);
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

<<<<<<< HEAD
  const handleCreateSuccess = async () => {
=======
  const handleCreateSuccess = async() => {
    // Yeni ilan sonrası teamService.getTeams() ile yenilenebilir
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
    setShowCreate(false);
    const data = await listTeams();
    setTeams(Array.isArray(data) ? data : data.teams);
  };

  return (
<<<<<<< HEAD
    <div className="p-8 max-w-4xl mx-auto text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold">Ekip İlanları</h1>
          <p className="text-gray-500 text-sm mt-1">Sana uygun ekibi bul veya kendi ekibini kur</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition" 
          onClick={() => setShowCreate(true)}
        >
=======
    <div className="tp-page">

      <div className="tp-header">
        <div>
          <h1 className="tp-title">Ekip İlanları</h1>
          <p className="tp-subtitle">Sana uygun ekibi bul veya kendi ekibini kur</p>
        </div>
        <button className="tp-btn-create" onClick={() => setShowCreate(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
          İlan Oluştur
        </button>
      </div>

<<<<<<< HEAD
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f.key 
                ? "bg-emerald-500 text-white" 
                : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
=======
      <div className="tp-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`tp-filter ${filter === f.key ? "tp-filter--active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key === "all" && (
              <span className="tp-filter-count">{teams.length}</span>
            )}
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
          </button>
        ))}
      </div>

<<<<<<< HEAD
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
=======
      <div className="tp-content">
        {loading ? (
          <div className="tp-loading">
            <div className="tp-loading-spinner" />
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
            <p>İlanlar yükleniyor...</p>
          </div>
        ) : (
          <TeamList
            teams={teams}
            currentUserId={currentUserId}
            onSelectTeam={setSelectedTeam}
          />
        )}
      </div>

      {selectedTeam && (
        <TeamDetail
          team={selectedTeam}
          currentUserId={currentUserId}
          onClose={() => setSelectedTeam(null)}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onDelete={handleDelete}
          onEdit={() => setSelectedTeam(null)}
        />
      )}

      {showCreate && (
        <TeamCreate
          onClose={() => setShowCreate(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
<<<<<<< HEAD
=======

>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
    </div>
  );
};

export default TeamPage;