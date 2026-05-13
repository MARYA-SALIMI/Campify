// controllers/teamController.js
const teamService = require("../services/teamService");
const redis = require("redis");

// ==========================================
// REDIS BAĞLANTISI VE KURULUMU
// ==========================================
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = redis.createClient({
    url: redisUrl,
    // Bağlantı koparsa veya bulamazsa uygulamayı çökertmemesi için:
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 3) return false; // 3 kere dene, olmazsa vazgeç
            return 1000;
        }
    }
});

redisClient.on('error', (err) => console.log('🔥 Redis Hatası:', err));
redisClient.on('connect', () => console.log('✅ Redis bağlantısı başarılı!'));

redisClient.connect().catch(console.error);
// ==========================================
const errRes = (res, status, code, message, errorDetail = null) => {
  if (errorDetail) {
    console.error(`🔥 [${code}] HATA DETAYI:`, errorDetail); // Terminalde göreceğiz
  }
  return res.status(status).json({ code, message, error: errorDetail?.message }); 
};
// POST /teams
exports.createTeam = async (req, res) => {
  try {
    const { baslik, aciklama, kontenjan, arananYetkinlikler } = req.body;
    const team = await teamService.createTeam({
      baslik, aciklama, kontenjan, arananYetkinlikler,
      userId: req.user.id,
    });
    res.status(201).json(team);
  } catch (err) {
    if (err.name === "ValidationError")
      return errRes(res, 400, "VALIDATION_ERROR", err.message);
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// GET /teams (REDIS EKLENEN KISIM BURASI)
exports.listTeams = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const filter = req.query.filter || "all";

    // 1. İstek parametrelerine göre benzersiz bir Redis anahtarı oluşturuyoruz
    const cacheKey = `teams_page${page}_limit${limit}_filter${filter}`;

    // 2. Önce Redis'e bakıyoruz, bu veri daha önce çekilmiş mi?
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      // Eğer veri Redis'te varsa, MongoDB'yi hiç yormadan doğrudan gönderiyoruz
      console.log(`⚡ [REDIS] Veriler cache üzerinden getirildi! (Key: ${cacheKey})`);
      return res.json(JSON.parse(cachedData));
    }

    // 3. Veri Redis'te yoksa, her zamanki gibi veritabanından (MongoDB) çekiyoruz
    console.log(`🐢 [MONGODB] Veriler veritabanından çekiliyor... (Key: ${cacheKey})`);
    const result = await teamService.listTeams(page, limit, req.user.id, filter);

    // 4. Çekilen veriyi bir sonraki istek için Redis'e kaydediyoruz 
    // (3600 saniye = 1 saat boyunca cache'de kalacak)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));

    res.json(result);
  } catch (err) {
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// GET /teams/:teamId  ← router'da ctrl.getTeam olarak çağrılıyor, bu eksikti!
exports.getTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");

    await team.populate("olusturanId", "ad soyad");

    res.json(team);
  } catch (err) {
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// PUT /teams/:teamId
exports.updateTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");

    if (team.olusturanId.toString() !== req.user.id)
      return errRes(res, 403, "FORBIDDEN", "Yalnızca ilan sahibi güncelleyebilir");

    const updated = await teamService.updateTeam(team, req.body);
    res.json(updated);
  } catch (err) {
    if (err.code) return errRes(res, 400, err.code, err.message);
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// DELETE /teams/:teamId
exports.deleteTeam = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.teamId);
    if (!team) return errRes(res, 404, "NOT_FOUND", "Ekip ilanı bulunamadı");

    if (team.olusturanId.toString() !== req.user.id)
      return errRes(res, 403, "FORBIDDEN", "Yalnızca ilan sahibi silebilir");

    await teamService.deleteTeam(team);
    res.status(204).send();
  } catch (err) {
    errRes(res, 500, "SERVER_ERROR", "Sunucu hatası");
  }
};

// POST /teams/:teamId/join
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

// DELETE /teams/:teamId/leave
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