const mongoose = require('mongoose');

const tourScheme = new mongoose.Schema( // 1-argument abyekt 2-argument options vertual malumolarni jsonga otkazib saqlashi uchun yozamiz
  {
    name: {
      type: String,
      required: [true, 'Siz nameni kiritishingiz kerak'],
      minlength: [8, 'Name 8 ta harfdan kam bolmasligi kerak'],
      maxlength: [16, 'Name 16 ta harfdan kop bolmasligi kerak'],
    },
    secretInfo: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, 'Siz durationni kiritishingiz kerak'],
      min: [1, 'Duration 1 dan kichik bolmasligi kerak'],
      max: [10, 'Duration 10 dan katta bolmasligi kerak'],
    },
    maxGroupSize: {
      type: Number,
      required: true,
      validate: {
        validator: function (val) {
          if (val > 1 && Number.isInteger(val)) {
            return true;
          } else return false;
        },
        message: 'Siz butun yoki manfiy son kiritdingiz',
      },
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'Siz xato malumot kiritdingiz',
      },
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

tourScheme.virtual('haftaliDavomEtish').get(function () {
  return this.duration / 7;
});

//Document midllware

tourScheme.pre('save', function (next) {
  // console.log(this);
  this.name = this.name + 1342423432;
  this.startTime = Date.now();
  console.log(this.startTime);
  next();
});

tourScheme.post('save', function (doc, next) {
  console.log(Date.now() - doc.startTime);
  next();
});

//Query midllware

tourScheme.pre('find', function (next) {
  this.find({ secretInfo: { $ne: true } });
  next();
});
tourScheme.post('find', function (doc, next) {
  console.log(doc);
  next();
});

const Tour = mongoose.model('tours', tourScheme);

module.exports = Tour;

// Document middleware
