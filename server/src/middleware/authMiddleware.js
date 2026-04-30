const jwt = require('../utils/jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ code: "UNAUTHORIZED", message: "Kimlik doğrulama başarısız" });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ code: "UNAUTHORIZED", message: "Kimlik doğrulama başarısız" });
    }
};