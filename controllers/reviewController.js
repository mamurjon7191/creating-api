const Review = require('../models/reviewModel');
const AppError = require('../utility/appError');
const catchErrAsync = require('../utility/catchAsync');

const getAllReviews = catchErrAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate({
      path: 'user',
      select: 'name',
    })
    .populate({
      path: 'tour',
      select: 'name',
    });
  res.status(200).json({
    status: 'succes',
    data: reviews,
  });
});

const addReviews = catchErrAsync(async (req, res, next) => {
  const reviews = await Review.create(req.body);

  res.status(200).json({
    status: 'succes',
    data: reviews,
  });
});

module.exports = { addReviews, getAllReviews };
