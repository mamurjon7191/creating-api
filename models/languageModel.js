const mongoose = require('mongoose');

const languageScheme = new mongoose.Schema({
  source_word: {
    type: String,
    required: [true, 'Siz sorce_wordni kiritishingiz kerak'],
  },
  ru: {
    type: String,
    required: [true, 'Siz ru ni kiritishingiz kerak'],
  },
  eng: {
    type: String,
    required: [true, 'Siz eng ni kiritishingiz kerak'],
  },
  uz: {
    type: String,
    required: [true, 'Siz uz ni kiritishingiz kerak'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Language = mongoose.model('languages', languageScheme);

module.exports = Language;
