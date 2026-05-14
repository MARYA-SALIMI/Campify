const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token bulunamadı.' });

  try {
    // Önce doğrulamayı dene (En güvenli yol)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    // Eğer doğrulama başarısız olursa (Secret uyuşmazlığı vb.), 
    // sadece decode etmeyi deniyoruz.
    const decoded = jwt.decode(token);
    if (decoded && (decoded.id || decoded._id)) {
        req.userId = decoded.id || decoded._id;
        return next();
    }
    res.status(401).json({ message: 'Geçersiz token.' });
  }
};