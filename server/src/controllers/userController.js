const User = require('../models/User');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ code: "NOT_FOUND", message: "İstenen kaynak bulunamadı" });

    res.status(200).json({
      id: user._id,
      ad: user.firstName,
      soyad: user.lastName,
      email: user.email,
      bolum: user.department || "",
      ilgi_alanlari: user.interests || [],
      yetenekler: user.skills || []
    });
  } catch (err) {
    next(err);
  }
};


exports.updateUserProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { returnDocument: "after" }
    ).select("-password");

    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};