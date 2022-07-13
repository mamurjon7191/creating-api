const express = require('express');
const { router } = require('../app');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

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

tourRouter.route('/stats').get(tourController.tourStats);
tourRouter.route('/report/:year?').get(tourController.tuorReportYear);

tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.postTour);
tourRouter
  .route('/:id')
  .delete(authController.protect, tourController.deleteTour)
  .patch(authController.protect, tourController.updateTour)
  .get(authController.protect, tourController.getTourById);

module.exports = tourRouter;
