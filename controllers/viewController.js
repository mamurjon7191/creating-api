const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const AppError = require('../utility/appError');
const catchErrAsync = require('../utility/catchAsync');

const getAllTour = async (req, res, next) => {
  const datas = await Tour.find();

  res.status(200).render('overview', { tours: datas });
};

const getOneTour = async (req, res, next) => {
  try {
    const data = await Tour.findById(req.params.id).populate('guides');
    const reviews = await Review.find({
      tour: req.params.id,
    }).populate('user');
    res.status(200).render('tour', { tour: data, reviews });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  getAllTour,
  getOneTour,
};
