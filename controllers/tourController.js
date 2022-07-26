/// tours controllerlari
const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');

const {
  getAll,
  getOne,
  add,
  update,
  deleteData,
} = require('../controllers/handlerController');

const catchErrAsync = require('../utility/catchAsync');

const FeatureAPI = require('./../utility/featureApi');

const options = {
  path: 'guides',
};
const options2 = {
  path: 'reviews',
};

const getAllTours = (req, res, next) => {
  getAll(req, res, next, Tour, options, options2);
};

const postTour = (req, res, next) => {
  add(req, res, next, Tour);
};
const getTourById = (req, res, next) => {
  getOne(req, res, next, Tour, options, options2);
};

const updateTour = (req, res, next) => {
  update(req, res, next, Tour);
};

const deleteTour = (req, res, next) => {
  deleteData(req, res, next, Tour);
};

const tourStats = catchErrAsync(async (req, res) => {
  const data = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } }, // togri keladiganini chiqazadi
    {
      $group: {
        //_id bn $sum bolishi kerak oxshashlarini gruppa qilib qoyadi
        _id: { $toUpper: '$difficulty' },
        numberTours: { $sum: 1 },
        urtachaNarx: { $avg: '$price' },
        engArzonNarx: { $min: '$price' },
        engQimmatNarx: { $max: '$price' },
        ortachaReyting: { $avg: '$ratingsAverage' },
      },
    },
    {
      $sort: { ortachaReyting: -1 }, // sort qilish
    },
    {
      $project: { numberTours: 0 }, // ochirish
    },
  ]);
  res.status(200).json({
    status: 'succes',
    result: data.length,
    data: data,
  });
});

const tuorReportYear = catchErrAsync(async (req, res) => {
  console.log(req.params.year);
  const data = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${req.params.year}-01-01`),
          $lte: new Date(`${req.params.year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourlarSoni: { $sum: 1 },
        tourNomi: { $push: '$name' },
      },
    },
  ]);

  res.status(200).json({
    status: 'failed',
    results: data.length,
    data: data,
  });
});

module.exports = {
  getAllTours,
  postTour,
  getTourById,
  updateTour,
  deleteTour,
  tourStats,
  tuorReportYear,
};
