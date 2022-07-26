const Review = require('../models/reviewModel');
const AppError = require('../utility/appError');
const catchErrAsync = require('../utility/catchAsync');

const {
  getAll,
  getOne,
  add,
  update,
  deleteData,
} = require('../controllers/handlerController');

const options = {
  path: 'tour',
};
const options2 = {
  path: 'user',
};

const getAllReviews = (req, res, next) => {
  let data;
  if (req.params.id) {
    data = Review.find({ tour: req.params.id });
    console.log(req.params);
  } else {
    data = Review;
  }
  getAll(req, res, next, data, options, options2);
};

const addReviews = catchErrAsync(async (req, res, next) => {
  let reviews;
  if (!req.params.id) {
    reviews = await Review.create(req.body);
  } else {
    reviews = await Review.create({
      tour: req.params.id,
      user: req.body.user,
      review: req.body.review,
      rating: req.body.rating,
    });
  }

  res.status(200).json({
    status: 'succes',
    data: reviews,
  });
});

const getReviewById = (req, res, next, options, options2) => {
  getOne(req, res, next, Review);
};

const updateReview = (req, res, next) => {
  update(req, res, next, Review);
};
const deleteReview = (req, res, next) => {
  deleteData(req, res, next, Review);
};
module.exports = {
  addReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
