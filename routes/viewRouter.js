const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();

viewRouter.route('/login').get(authController.isSign, viewController.login);
viewRouter
  .route('/overview')
  .get(authController.isSign, viewController.getAllTour);
viewRouter.route('/').get(authController.isSign, viewController.getAllTour);
viewRouter.route('/:id').get(authController.isSign, viewController.getOneTour);

viewRouter.route('/logout').post(authController.logout);

module.exports = viewRouter;
