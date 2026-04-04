/*import { useState } from "react";
import "./teamDetail.css";

const TeamDetail = ({ team, currentUserId, onClose, onJoin, onLeave, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState("");

  if (!team) return null;

  const isOwner = team.ownerId === currentUserId;
  const isMember = team.members?.includes(currentUserId);
  const isFull = team.members?.length >= team.capacity;

  const handleJoin = async () => {
    setLoading("join");
    try {
      await onJoin?.(team.id);
    } finally {
      setLoading("");
    }
  };

  const handleLeave = async () => {
    setLoading("leave");
    try {
      await onLeave?.(team.id);
    } finally {
      setLoading("");
    }
  };

  const handleDelete = async () => {
    setLoading("delete");
    try {
      await onDelete?.(team.id);
      onClose?.();
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="td-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="td-modal">

        <div className="td-header">
          <div className="td-header-left">
            <div className="td-avatar">
              {team.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="td-title">{team.name}</h2>
              <div className="td-badges">
                {isOwner && <span className="td-badge td-badge--owner">İlanım</span>}
                {isMember && !isOwner && <span className="td-badge td-badge--member">Üyesin</span>}
                {isFull
                  ? <span className="td-badge td-badge--full">Dolu</span>
                  : <span className="td-badge td-badge--open">Açık</span>
                }
              </div>
            </div>
          </div>
          <button className="td-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="td-body">

          <div className="td-section">
            <p className="td-section-label">Açıklama</p>
            <p className="td-desc">{team.description}</p>
          </div>

          <div className="td-section">
            <p className="td-section-label">Aranan Yetkinlikler</p>
            <div className="td-skills">
              {team.skills?.length > 0
                ? team.skills.map((s) => <span key={s} className="td-skill">{s}</span>)
                : <span className="td-empty-text">Belirtilmemiş</span>
              }
            </div>
          </div>

          <div className="td-stats">
            <div className="td-stat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span>{team.members?.length ?? 0} / {team.capacity} üye</span>
            </div>
            <div className="td-capacity-bar">
              <div
                className="td-capacity-fill"
                style={{ width: `${Math.min(((team.members?.length ?? 0) / team.capacity) * 100, 100)}%` }}
              />
            </div>
          </div>

          {team.members?.length > 0 && (
            <div className="td-section">
              <p className="td-section-label">Üyeler</p>
              <div className="td-members">
                {team.members.map((memberId) => (
                  <div key={memberId} className="td-member">
                    <div className="td-member-avatar">
                      {memberId === team.ownerId
                        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        : memberId.toString().slice(0, 2).toUpperCase()
                      }
                    </div>
                    <span className="td-member-id">
                      {memberId === currentUserId ? "Sen" : `Üye #${memberId}`}
                    </span>
                    {memberId === team.ownerId && (
                      <span className="td-owner-label">Kurucu</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {confirmDelete && (
            <div className="td-confirm">
              <p>İlanı silmek istediğine emin misin? Bu işlem geri alınamaz.</p>
              <div className="td-confirm-actions">
                <button className="td-btn td-btn--ghost" onClick={() => setConfirmDelete(false)}>
                  Vazgeç
                </button>
                <button className="td-btn td-btn--danger" onClick={handleDelete} disabled={loading === "delete"}>
                  {loading === "delete" ? <span className="td-spinner" /> : "Evet, sil"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="td-footer">
          {isOwner ? (
            <>
              <button className="td-btn td-btn--danger-outline" onClick={() => setConfirmDelete(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                İlanı Sil
              </button>
              <button className="td-btn td-btn--primary" onClick={() => onEdit?.(team)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Düzenle
              </button>
            </>
          ) : isMember ? (
            <button className="td-btn td-btn--leave" onClick={handleLeave} disabled={loading === "leave"}>
              {loading === "leave" ? <span className="td-spinner" /> : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Ekipten Ayrıl
                </>
              )}
            </button>
          ) : (
            <button
              className="td-btn td-btn--primary"
              onClick={handleJoin}
              disabled={isFull || loading === "join"}
              style={{ width: "100%" }}
            >
              {loading === "join" ? <span className="td-spinner" /> : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  {isFull ? "Ekip Dolu" : "Ekibe Katıl"}
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeamDetail;*/