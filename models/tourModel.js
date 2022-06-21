const mongoose = require('mongoose');

const tourScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Siz nameni kiritishingiz kerak'],
    },
    duration: {
      type: Number,
      required: [true, 'Siz durationni kiritishingiz kerak'],
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      required: true,
    },
    ratingsQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      // required: true,
      unique: true,
    },
    summary: {
      type: String,
      trim: true,
      // required: true,
    },
    description: {
      type: String,
      trim: true,
      // required: true,
    },
    priceDiscount: {
      type: Number,
    },

    imageCover: {
      type: String,
    },
    images: [String],
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
  }
);

// tourScheme.virtuals(
//   'ChegirmaliNarx',
//   get(function () {
//     return this.price - (this.price * this.priceDiscount) / 100;
//   })
// );

const Tour = mongoose.model('tours', tourScheme);

module.exports = Tour;
