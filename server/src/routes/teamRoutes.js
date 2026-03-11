const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/teamController");

// POST   /v1/teams          → Ekip ilanı oluştur
// GET    /v1/teams          → Ekip ilanlarını listele
router.route("/").post(auth, ctrl.createTeam).get(auth, ctrl.listTeams);

// GET    /v1/teams/:teamId  → Tek ilanı getir
// PUT    /v1/teams/:teamId  → İlanı güncelle (sadece sahibi)
// DELETE /v1/teams/:teamId  → İlanı sil (sadece sahibi)
router
  .route("/:teamId")
  .get(auth, ctrl.getTeam)
  .put(auth, ctrl.updateTeam)
  .delete(auth, ctrl.deleteTeam);

// POST   /v1/teams/:teamId/join   → Ekibe katıl
router.post("/:teamId/join", auth, ctrl.joinTeam);

// DELETE /v1/teams/:teamId/leave  → Ekipten ayrıl
router.delete("/:teamId/leave", auth, ctrl.leaveTeam);

module.exports = router;