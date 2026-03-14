const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 2 },
  lastName: { type: String, required: true, minLength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false},
  department: { type: String },
  interests: [{ type: String }],
  skills: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
