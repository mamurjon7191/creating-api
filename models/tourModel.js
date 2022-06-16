const mongoose = require('mongoose');

const tourScheme = new mongoose.Schema({
  name: String,
  price: Number,
  duration: Number,
  login: {
    type: String,
    min: 8,
    unique: true,
  },
});

const Tour = mongoose.model('tours', tourScheme);

module.exports = Tour;
