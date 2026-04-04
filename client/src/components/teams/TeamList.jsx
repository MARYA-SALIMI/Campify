import "./teamList.css";

const TeamList = ({ teams = [], currentUserId, onSelectTeam }) => {
  if (teams.length === 0) {
    return (
      <div className="tl-empty">
        <div className="tl-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="tl-empty-title">Henüz ilan yok</p>
        <p className="tl-empty-sub">İlk ilanı oluşturan sen ol!</p>
      </div>
    );
  }

  return (
    <div className="tl-grid">
      {teams.map((team) => {
      const isOwner = team.ownerId && currentUserId ? team.ownerId.toString() === currentUserId.toString() : false;
      const isMember = team.members?.some(id => id && currentUserId && id.toString() === currentUserId.toString());
  
      const isFull = (team.members?.length || 0) >= (team.capacity || 0);

        return (
          <div
            key={team.id}
            className={`tl-card ${isOwner ? "tl-card--owner" : ""}`}
            onClick={() => onSelectTeam?.(team)}
          >
            <div className="tl-card-header">
              <div className="tl-avatar" style={{ background: team.avatarColor || "var(--green-2)" }}>
                {team.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="tl-badge-group">
                {isOwner && <span className="tl-badge tl-badge--owner">İlanım</span>}
                {isMember && !isOwner && <span className="tl-badge tl-badge--member">Katıldım</span>}
                {isFull ? (
                  <span className="tl-badge tl-badge--full">Dolu</span>
                ) : (
                  <span className="tl-badge tl-badge--open">Açık</span>
                )}
              </div>
            </div>

            <h3 className="tl-card-title">{team.name}</h3>
            <p className="tl-card-desc">{team.description}</p>

            {team.skills?.length > 0 && (
              <div className="tl-skills">
                {team.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="tl-skill">{skill}</span>
                ))}
                {team.skills.length > 3 && (
                  <span className="tl-skill tl-skill--more">+{team.skills.length - 3}</span>
                )}
              </div>
            )}

            <div className="tl-card-footer">
              <div className="tl-members">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                {team.members?.length ?? 0} / {team.capacity} üye
              </div>

              {isOwner ? (
                <div className="tl-owner-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="tl-btn tl-btn--edit" onClick={() => onSelectTeam?.(team)}>
                    Düzenle
                  </button>
                </div>
              ) : isMember ? (
                <span className="tl-joined-label">✓ Üyesin</span>
              ) : (
                <button
                  className={`tl-btn tl-btn--join ${isFull ? "tl-btn--disabled" : ""}`}
                  disabled={isFull}
                  onClick={(e) => { e.stopPropagation(); onSelectTeam?.(team); }}
                >
                  {isFull ? "Dolu" : "Katıl"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamList;