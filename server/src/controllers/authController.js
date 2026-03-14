const User = require('../models/User');
const jwt = require('../utils/jwt');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ code: "EMAIL_EXISTS", message: "Bu email zaten kullanımda" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, firstName, lastName });
    
    const userProfile = {
      id: newUser._id,
      ad: newUser.firstName,
      soyad: newUser.lastName,
      email: newUser.email,
      bolum: newUser.department || "",
      ilgi_alanlari: newUser.interests || [],
      yetenekler: newUser.skills || []
    };

    res.status(201).json(userProfile);
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ code: "UNAUTHORIZED", message: "Kimlik doğrulama başarısız" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ code: "UNAUTHORIZED", message: "Kimlik doğrulama başarısız" });

    const token = jwt.generateToken({ id: user._id });

    res.status(200).json({
      token,
      expiresIn: 3600,
      user: {
        id: user._id,
        ad: user.firstName,
        soyad: user.lastName,
        email: user.email,
        bolum: user.department || "",
        ilgi_alanlari: user.interests || [],
        yetenekler: user.skills || []
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.logoutUser = async (req, res) => {
  // JWT is stateless, frontend can just delete token
  res.status(200).json({ message: "Çıkış başarılı" });
};