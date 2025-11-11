const mongoose = require('mongoose');

const SkripsiSchema = new mongoose.Schema({
  judul_skripsi: { type: String, required: true },
  penulis: { type: String, required: true },
  tahun_terbit: { type: Number, required: true },
  abstrak: { type: String, required: true },
  abstrak_bersih: { type: String, required: true },
  kategori: { type: String, required: true },
});

module.exports = mongoose.model('Skripsi', SkripsiSchema);
