const Team = require("../models/Team");
const teamService = require("../services/teamService");

// ─── Yardımcı: hata yanıtı ───────────────────────────────────────────────────
const errRes = (res, status, code, message) =>
  res.status(status).json({ code, message });

// ─── POST /teams ─────────────────────────────────────────────────────────────
exports.createTeam = async (req, res) => {
  try {
    const { baslik, aciklama, kontenjan, arananYetkinlikler } = req.body;
    const team = await teamService.createTeam({
      baslik, aciklama, kontenjan, arananYetkinlikler,
      userId: req.user.id,
    });
    res.status(201).json(team);
  } catch (err) {
    if (err.name === "ValidationError") {
      return errRes(res, 400, "VALIDATION_ERROR", err.message);
    }
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// ─── GET /teams ───────────────────────────────────────────────────────────────
exports.listTeams = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const teams = await teamService.listTeams(page, limit);
    res.json(teams);
  } catch (err) {
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// ─── GET /teams/:teamId ───────────────────────────────────────────────────────
exports.getTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");
    res.json(team);
  } catch (err) {
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// ─── PUT /teams/:teamId ───────────────────────────────────────────────────────
exports.updateTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");

    if (team.olusturanId.toString() !== req.user.id) {
      return errRes(res, 403, "FORBIDDEN", "Yalnızca ilan sahibi güncelleyebilir");
    }

    const updated = await teamService.updateTeam(team, req.body);
    res.json(updated);
  } catch (err) {
    if (err.code) return errRes(res, 400, err.code, err.message);
    if (err.name === "ValidationError") {
      return errRes(res, 400, "VALIDATION_ERROR", err.message);
    }
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// ─── DELETE /teams/:teamId ────────────────────────────────────────────────────
exports.deleteTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");

    if (team.olusturanId.toString() !== req.user.id) {
      return errRes(res, 403, "FORBIDDEN", "Yalnızca ilan sahibi silebilir");
    }

    await teamService.deleteTeam(team);
    res.status(204).send();
  } catch (err) {
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// ─── POST /teams/:teamId/join ─────────────────────────────────────────────────
exports.joinTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");

    const updated = await teamService.joinTeam(team, req.user.id);
    res.json({
      message: "Ekibe başarıyla katıldınız.",
      teamId: updated._id,
      mevcutUyeSayisi: updated.uyeler.length,
    });
  } catch (err) {
    if (err.code) return errRes(res, 400, err.code, err.message);
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// ─── DELETE /teams/:teamId/leave ──────────────────────────────────────────────
exports.leaveTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");

    const updated = await teamService.leaveTeam(team, req.user.id);
    res.json({
      message: "Ekipten başarıyla ayrıldınız.",
      teamId: updated._id,
      mevcutUyeSayisi: updated.uyeler.length,
    });
  } catch (err) {
    if (err.code) return errRes(res, 400, err.code, err.message);
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};