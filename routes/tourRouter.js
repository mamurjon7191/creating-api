const express = require('express');
const { router } = require('../app');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRouter');

const tourRouter = express.Router();

// uchta eng yaxshisini olib keladi
tourRouter.use(
  '/the-best-3-tours',
  (req, res, next) => {
    req.query.sort = '-price';
    req.query.limit = 2;
    next();
  },
  tourController.getAllTours
);

tourRouter
  .route('/stats')
  .get(
    authController.protect,
    authController.role(['admin']),
    tourController.tourStats
  );
tourRouter
  .route('/report/:year?')
  .get(authController.protect, tourController.tuorReportYear);

tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.role(['admin', 'lead-guide']),
    tourController.postTour
  );

// Bitta tourni ichidan hamma reviewlarni olish

tourRouter.use('/:id/reviews', reviewRouter); // nested routes review routerga yonaltirilvotti

tourRouter
  .route('/:id')
  .delete(
    authController.protect,
    authController.role(['admin', 'lead-guide']),
    tourController.deleteTour
  )
  .patch(
    authController.protect,
    authController.role(['admin', 'lead-guide']),
    tourController.uploadTourImages,
    tourController.resizeImage,
    tourController.updateTour
  )
  .get(tourController.getTourById);

module.exports = tourRouter;
