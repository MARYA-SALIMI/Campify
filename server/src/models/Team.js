const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema(
    {
        baslik: {
      type: String,
      required: [true, "Başlık zorunludur"],
      minlength: [5, "Başlık en az 5 karakter olmalıdır"],
      maxlength: [100, "Başlık en fazla 100 karakter olabilir"],
      trim: true,
    },
    aciklama: {
      type: String,
      minlength: [10, "Açıklama en az 10 karakter olmalıdır"],
      maxlength: [1000, "Açıklama en fazla 1000 karakter olabilir"],
      trim: true,
    },
    kontenjan: {
      type: Number,
      required: [true, "Kontenjan zorunludur"],
      min: [2, "Kontenjan en az 2 olmalıdır"],
      max: [50, "Kontenjan en fazla 50 olabilir"],
    },
    arananYetkinlikler: {
      type: [String],
      default: [],
    },
    olusturanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uyeler: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
    {
    timestamps: {
      createdAt: "olusturulmaTarihi",
      updatedAt: "guncellenmeTarihi",
    },
    toJSON: { virtuals: true },
  }
);

teamSchema.virtual("mevcutUyeSayisi").get(function () {
  return this.uyeler.length;
});
module.exports = mongoose.model("Team", teamSchema);