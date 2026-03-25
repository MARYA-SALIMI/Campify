import { useState } from "react";
import "./teamCreate.css";
import { createTeam } from "../../services/teamService";
const TeamCreate = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formData.skills.includes(newSkill)) {
        setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Ekip adı gereklidir.");
    if (!formData.description.trim()) return setError("Açıklama gereklidir.");
    if (!formData.capacity || formData.capacity < 1)
      return setError("Geçerli bir kontenjan girin.");

    setLoading(true);
    try {
      await createTeam({
      baslik: formData.name,
      aciklama: formData.description,
      kontenjan: Number(formData.capacity),
      arananYetkinlikler: formData.skills,
    });
      onSuccess?.();
      onClose?.();
    } catch  {
      setError("İlan oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tc-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="tc-modal">
        <div className="tc-header">
          <div className="tc-header-left">
            <div className="tc-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div>
              <h2 className="tc-title">Ekip İlanı Oluştur</h2>
              <p className="tc-subtitle">Ekibine katılacak kişileri bul</p>
            </div>
          </div>
          <button className="tc-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="tc-form" onSubmit={handleSubmit}>
          <div className="tc-field">
            <label className="tc-label">Ekip Adı</label>
            <input
              className="tc-input"
              type="text"
              name="name"
              placeholder="ör. TechBridge Hackathon Takımı"
              value={formData.name}
              onChange={handleChange}
              maxLength={60}
            />
          </div>

          <div className="tc-field">
            <label className="tc-label">Açıklama</label>
            <textarea
              className="tc-textarea"
              name="description"
              placeholder="Projenizi, hedeflerinizi ve ne tür ekip arkadaşları aradığınızı anlatın..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={500}
            />
            <span className="tc-char-count">{formData.description.length}/500</span>
          </div>

          <div className="tc-field">
            <label className="tc-label">Aranan Yetkinlikler</label>
            <div className="tc-skills-wrapper">
              {formData.skills.map((skill) => (
                <span key={skill} className="tc-skill-tag">
                  {skill}
                  <button type="button" className="tc-skill-remove" onClick={() => removeSkill(skill)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                className="tc-skill-input"
                type="text"
                placeholder={formData.skills.length === 0 ? "ör. React, Python, Figma — Enter ile ekle" : "Yetkinlik ekle..."}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
            </div>
          </div>

          <div className="tc-field">
            <label className="tc-label">Kontenjan</label>
            <div className="tc-capacity-wrapper">
              <input
                className="tc-input tc-capacity-input"
                type="number"
                name="capacity"
                placeholder="ör. 4"
                value={formData.capacity}
                onChange={handleChange}
                min={1}
                max={50}
              />
              <span className="tc-capacity-hint">kişi</span>
            </div>
          </div>

          {error && (
            <div className="tc-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="tc-actions">
            <button type="button" className="tc-btn-cancel" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="tc-btn-submit" disabled={loading}>
              {loading ? (
                <span className="tc-spinner" />
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  İlan Oluştur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamCreate;