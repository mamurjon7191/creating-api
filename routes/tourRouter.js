const express = require('express');
const tourController = require('../controllers/tourController');

const tourRouter = express.Router();

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
