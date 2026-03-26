// YENİ errorMiddleware
module.exports = (err, req, res, next) => {
  // 🚨 İŞTE HAYAT KURTARAN O SATIR:
  console.error("🔥 [GLOBAL HATA YAKALAYICI] Beklenmeyen Hata:", err);

  const status = err.status || 500;
  const code = err.code || "SERVER_ERROR";
  const message = err.message || "Sunucu hatası";
  
  res.status(status).json({ code, message, dev_detail: err.message });
};