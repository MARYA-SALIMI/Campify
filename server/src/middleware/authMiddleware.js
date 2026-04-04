const crypto = require("node:crypto");

const TEMP_BEARER_TOKEN =
  process.env.TEMP_BEARER_TOKEN || "gecici-super-token-123";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      code: "AUTH_REQUIRED",
      message: "Authorization header eksik",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      code: "INVALID_AUTH_FORMAT",
      message: "Authorization formatı 'Bearer <token>' olmalıdır",
    });
  }

  const expectedHash = crypto
    .createHash("sha256")
    .update(TEMP_BEARER_TOKEN)
    .digest();

  const receivedHash = crypto
    .createHash("sha256")
    .update(token)
    .digest();

  const isValid = crypto.timingSafeEqual(expectedHash, receivedHash);

  if (!isValid) {
    return res.status(401).json({
      code: "INVALID_TOKEN",
      message: "Geçersiz token",
    });
  }

  // Geçici kullanıcı bilgisi
  req.user = {
    id: "65f123456789abcdef123456", // örnek ObjectId formatında sahte user id
    username: "tempUser",
    role: "developer",
  };

  next();
};