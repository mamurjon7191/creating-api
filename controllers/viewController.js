const Language = require('../models/languageModel');
const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const AppError = require('../utility/appError');
const catchErrAsync = require('../utility/catchAsync');

let language;

const getAllTour = async (req, res, next) => {
  const datas = await Tour.find();
  language = await Language.find();
  res.status(200).render('overview', {
    tours: datas,
    language,
  });
};

const getOneTour = async (req, res, next) => {
  try {
    const data = await Tour.findById(req.params.id).populate('guides');
    const reviews = await Review.find({
      tour: req.params.id,
    }).populate('user');
    if (!data) {
      return next(new AppError('This tour has not found!'));
    }
    res.status(200).render('tour', { tour: data, reviews });
  } catch (err) {
    console.log(err.message);
  }
};
const login = async (req, res, next) => {
  try {
    res.status(200).render('login');
  } catch (err) {
    console.log(err);
  }
};

const account = (req, res, next) => {
  try {
    console.log('accountga kirdi');
    res.render('account');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  account,
  getAllTour,
  getOneTour,
  login,
};
