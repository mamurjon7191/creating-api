/// tours controllerlari
const Tour = require('../models/tourModel');

const FeatureAPI = require('./../utility/featureApi');

const getAllTours = async (req, res) => {
  try {
    const query = new FeatureAPI(req.query, Tour)
      .filter()
      .sorting()
      .field()
      .pagination();

    const tours = await query.dataBaseQuery;

    res.status(200).json({
      status: 'succces',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
  // const queryObj = { ...req.query };

  //---Sorting

  //---Field

  //--Pagination
};

const postTour = async (req, res) => {
  try {
    const data = req.body;
    // const newTour = new Tour(data);
    // newTour.save();
    const tour = await Tour.create(data);

    res.status(200).json({
      status: 'succes',
      data: tour,
    });
  } catch (err) {
    console.log(err);
  }
};
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(400).json({
      status: 'succes',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 'succes',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'succes',
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const tourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const tuorReportYear = async (req, res) => {
  console.log(req.params.year);
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

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
