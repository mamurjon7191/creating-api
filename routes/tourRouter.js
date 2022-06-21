const express = require('express');
const { router } = require('../app');
const tourController = require('../controllers/tourController');

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
  .get(tourController.getAllTours)
  .post(tourController.postTour);
tourRouter
  .route('/:id')
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour)
  .get(tourController.getTourById);

module.exports = tourRouter;
