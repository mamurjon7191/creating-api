/// tours controllerlari
const Tour = require('../models/tourModel');

const catchErrAsync = require('../utility/catchAsync');

const FeatureAPI = require('./../utility/featureApi');

const getAllTours = catchErrAsync(async (req, res) => {
  console.log(req.query);
  const query = new FeatureAPI(req.query, Tour)
    .filter()
    .sorting()
    .field()
    .pagination();

  const tours = await query.dataBaseQuery
    .find()
    .populate({
      path: 'guides',
      select: '-role -__v -passwordChangedDate', // shularni olib kelmaydi
    })
    .populate({
      path: 'reviews',
    });

  // .find().populate("guides") bu kod qaysi fieldga borishini va id si orqali boshqa collectiondan ob kelishini qavs ichiga ("fieldni nomini yozamiz")

  res.status(200).json({
    status: 'succces',
    results: tours.length,
    data: tours,
  });

  // const queryObj = { ...req.query };

  //---Sorting

  //---Field

  //--Pagination
});

const postTour = catchErrAsync(async (req, res) => {
  const data = req.body;
  // const newTour = new Tour(data);
  // newTour.save();
  const tour = await Tour.create(data);

  res.status(200).json({
    status: 'succes',
    data: tour,
  });
});
const getTourById = catchErrAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id).find().populate({
    path: 'guides',
    select: '-role -__v -passwordChangedDate', // shularni olib kelmaydi
  });
  if (!tour) {
    throw new Error('Bunday idlik malumot topilmadi');
  }
  res.status(400).json({
    status: 'succes',
    data: tour,
  });
});

const updateTour = catchErrAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!tour) {
    throw new Error('Bunday idlik malumot topilmadi');
  }
  res.status(200).json({
    status: 'succes',
    data: tour,
  });
});

const deleteTour = catchErrAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    throw new Error('Bunday idlik malumot topilmadi');
  }
  res.status(204).json({
    status: 'succes',
  });
});

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
console.log(new Date('2021-06-19,10:00'));
