/// tours controllerlari
const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');

//-->Multer
const multer = require('multer');

const multerStorage = multer.memoryStorage(); // buffer ga saqlab qoyadi tezkor hotiraga

const filterImage = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'You can upload only image format! Sorry about unconvinience',
        false
      )
    );
  }
};

const upload = multer({
  // faylni qayerga saqlashi
  storage: multerStorage,
  fileFilter: filterImage,
});

const uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  { name: 'images', maxCount: 3 },
]);

const resizeImage = async (req, res, next) => {
  if (req.files.imageCover) {
    const ext = req.files.imageCover[0].mimetype.split('/')[1]; // type .jpg .png va hokozo
    req.body.imageCover = `tour-${req.user.id}-${Date.now()}.${ext}`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${__dirname}/../public/img/tours/${req.body.imageCover}`);
  }
  if (req.files.images) {
    const ext = req.files.images[0].mimetype.split('/')[1]; // type .jpg .png va hokozo

    req.body.images = [];

    req.files.images.map((val, key) => {
      let imageName = `tour-${req.user.id}-${Date.now()}-${key + 1}.${ext}`;

      sharp(val.buffer)
        .resize(1500, 1000)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`${__dirname}/../public/img/tours/${imageName}`);
      req.body.images.push(imageName);
    });
  }
  return next();
};

//-->Multer

const {
  getAll,
  getOne,
  add,
  update,
  deleteData,
} = require('../controllers/handlerController');

const catchErrAsync = require('../utility/catchAsync');

const FeatureAPI = require('./../utility/featureApi');
const catchErrAsyncAuth = require('../utility/catchAsyncAuth');
const sharp = require('sharp');

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
  console.log(req.files);
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
  uploadTourImages,
  resizeImage,
};
