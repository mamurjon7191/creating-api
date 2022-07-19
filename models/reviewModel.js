const mongoose = require('mongoose');

const reviewScheme = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'tours',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
  },
  review: {
    type: String,
    required: [true, 'Siz reviewni kiritshingiz shart'],
  },
  // parent refensing
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Review = mongoose.model('review', reviewScheme);

module.exports = Review;

// parent reference bilan ulandi
