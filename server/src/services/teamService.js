const Team = require("../models/Team");

// Ekip oluştur
exports.createTeam = async ({ baslik, aciklama, kontenjan, arananYetkinlikler, userId }) => {
  return await Team.create({
    baslik,
    aciklama,
    kontenjan,
    arananYetkinlikler,
    olusturanId: userId,
    uyeler: [userId],
  });
};

// Ekipleri listele
exports.listTeams = async (page, limit, userId, filter= "all") => {
  let query = {};

  if (filter === "open") {
    query = { $expr: { $lt: [{ $size: "$uyeler" }, "$kontenjan"] } }; // sadece açık ilanlar
  } else if (filter === "joined") {
    query = { uyeler: userId }; // katıldıklarım
  } else if (filter === "mine") {
    query = { olusturanId: userId }; // benim ilanlarım
  }
  const [teams, total] = await Promise.all([
    Team.find(query).skip((page - 1) * limit).limit(limit).sort({ olusturulmaTarihi: -1 }),
    Team.countDocuments(query)
  ]);
  return { teams, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Tek ekip getir
exports.getTeamById = async (teamId) => {
  return await Team.findById(teamId);
};

// Ekip güncelle
exports.updateTeam = async (team, { baslik, aciklama, kontenjan, arananYetkinlikler }) => {
  if (kontenjan !== undefined && kontenjan < team.uyeler.length) {
    throw { code: "INVALID_KONTENJAN", message: "Kontenjan mevcut üye sayısından az olamaz" };
  }
  const updates = { baslik, aciklama, kontenjan, arananYetkinlikler };
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) team[key] = value;
  });
  return await team.save();
};

// Ekip sil
exports.deleteTeam = async (team) => {
  return await team.deleteOne();
};

// Ekibe katıl
exports.joinTeam = async (team, userId) => {
  if (team.uyeler.some((u) => u.toString() === userId.toString())) {
    throw { code: "ALREADY_MEMBER", message: "Zaten bu ekibin üyesisin" };
  }
  if (team.uyeler.length >= team.kontenjan) {
    throw { code: "TEAM_FULL", message: "Ekip kontenjanı dolu" };
  }
  team.uyeler.push(userId);
  return await team.save();
};

// Ekipten ayrıl
exports.leaveTeam = async (team, userId) => {
  if (team.olusturanId.toString() === userId.toString()
  ) {
    throw { code: "OWNER_CANNOT_LEAVE", message: "İlan sahibi ekipten ayrılamaz" };
  }
  const index = team.uyeler.findIndex((u) => u.toString() === userId.toString());
  if (index === -1) {
    throw { code: "NOT_MEMBER", message: "Bu ekibin üyesi değilsin" };
  }
  team.uyeler.splice(index, 1);
  return await team.save();
};