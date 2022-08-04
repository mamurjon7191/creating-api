const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();

viewRouter
  .route('/account')
  .get(authController.protect, viewController.account);

viewRouter.route('/login').get(authController.isSign, viewController.login);
viewRouter.route('/logout').post(authController.logout);
viewRouter
  .route('/overview')
  .get(authController.isSign, viewController.getAllTour);
viewRouter.route('/').get(authController.isSign, viewController.getAllTour);
viewRouter.route('/:id').get(authController.isSign, viewController.getOneTour);

module.exports = viewRouter;
