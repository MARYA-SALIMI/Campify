import { useState, useEffect } from "react";
import TeamList from "../components/teams/TeamList";
import TeamCreate from "../components/teams/TeamCreate";
import TeamDetail from "../components/teams/TeamDetail";
import { listTeams, joinTeam, leaveTeam, deleteTeam } from "../services/teamService";
import "./teamPage.css";

const FILTERS = [
  { key: "all", label: "Tümü" },
  { key: "open", label: "Açık" },
  { key: "mine", label: "Benim ilanlarım" },
  { key: "joined", label: "Katıldıklarım" },
];

const TeamPage = () => {
  const currentUserId = localStorage.getItem("userId"); // Auth'tan gelecek

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    // teamService.getTeams() buraya gelecek
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const data = await listTeams();
        setTeams(Array.isArray(data) ? data : data.teams);
      } catch (err) {
        console.error("İlanlar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) => {
    if (filter === "open") return team.members.length < team.capacity;
    if (filter === "mine") return team.ownerId === currentUserId;
    if (filter === "joined") return team.members.includes(currentUserId) && team.ownerId !== currentUserId;
    return true;
  });

  const handleJoin = async (teamId) => {
    // teamService.joinTeam(teamId) buraya gelecek
    try {
      await joinTeam(teamId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId && !t.members.includes(currentUserId)
            ? { ...t, members: [...t.members, currentUserId] }
            : t
        )
      );
      setSelectedTeam((prev) =>
        prev?.id === teamId
          ? { ...prev, members: [...prev.members, currentUserId] }
          : prev
      );
    } catch (err) {
      console.error("Katılma hatası:", err);
    }
  };

  const handleLeave = async (teamId) => {
    // teamService.leaveTeam(teamId) buraya gelecek
    try {
      await leaveTeam(teamId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, members: t.members.filter((m) => m !== currentUserId) }
            : t
        )
      );
      setSelectedTeam(null);
    } catch (err) {
      console.error("Ayrılma hatası:", err);
    }
  };

  const handleDelete = async (teamId) => {
    // teamService.deleteTeam(teamId) buraya gelecek
    try {
      await deleteTeam(teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      setSelectedTeam(null);
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const handleCreateSuccess = async() => {
    // Yeni ilan sonrası teamService.getTeams() ile yenilenebilir
    setShowCreate(false);
    const data = await listTeams();
    setTeams(Array.isArray(data) ? data : data.teams);
  };

  return (
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
          İlan Oluştur
        </button>
      </div>

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
          </button>
        ))}
      </div>

      <div className="tp-content">
        {loading ? (
          <div className="tp-loading">
            <div className="tp-loading-spinner" />
            <p>İlanlar yükleniyor...</p>
          </div>
        ) : (
          <TeamList
            teams={filteredTeams}
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

    </div>
  );
};

export default TeamPage;