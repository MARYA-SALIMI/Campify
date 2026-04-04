/*const BASE_URL = "https://campify-api-2nzn.onrender.com/v1";

const getToken = () => localStorage.getItem("token");

// Backend → Frontend alan adı dönüşümü
const mapTeam = (t) => ({
  id: t._id,
  name: t.baslik,
  description: t.aciklama,
  capacity: t.kontenjan,
  skills: t.arananYetkinlikler,
  members: t.uyeler,
  ownerId: t.olusturanId,
  memberCount: t.mevcutUyeSayisi,
  createdAt: t.olusturulmaTarihi,
});

// Ekipleri listele
export const listTeams = async ({page = 1, limit = 10, filterType = "all"} = {}) => {
let url = `${BASE_URL}/teams?page=${page}&limit=${limit}`;

if(filterType !== "all") url += `&filter=${filterType}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  
  const data = await res.json();
  return {
    ...data,
    teams: Array.isArray(data) ? data.map(mapTeam) : data.teams.map(mapTeam),
  };
};

// Tek ekip getir
export const getTeam = async (teamId) => {
  const res = await fetch(`${BASE_URL}/teams/${teamId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  return mapTeam(data);
};

// Ekip oluştur
export const createTeam = async ({ name, description, capacity, skills }) => {
  const res = await fetch(`${BASE_URL}/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      baslik: name,
      aciklama: description,
      kontenjan: Number(capacity),
      arananYetkinlikler: skills,
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    alert("Backend bir hata fırlattı: " + JSON.stringify(data));
    throw new Error("İlan oluşturulamadı");
  }

  return mapTeam(data);
};

// Ekip güncelle
export const updateTeam = async (teamId, { name, description, capacity, skills }) => {
  const body = {};
  if (name !== undefined) body.baslik = name;
  if (description !== undefined) body.aciklama = description;
  if (capacity !== undefined) body.kontenjan = Number(capacity);
  if (skills !== undefined) body.arananYetkinlikler = skills;

  const res = await fetch(`${BASE_URL}/teams/${teamId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return mapTeam(data);
};

// Ekip sil
export const deleteTeam = async (teamId) => {
  const res = await fetch(`${BASE_URL}/teams/${teamId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (res.status === 204) return { success: true };
  return res.json();
};

// Ekibe katıl
export const joinTeam = async (teamId) => {
  const res = await fetch(`${BASE_URL}/teams/${teamId}/join`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

// Ekipten ayrıl
export const leaveTeam = async (teamId) => {
  const res = await fetch(`${BASE_URL}/teams/${teamId}/leave`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};*/