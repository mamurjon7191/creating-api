const express = require('express');
const viewController = require('../controllers/viewController');

const viewRouter = express.Router();

viewRouter.route('/overview').get(viewController.getAllTour);
viewRouter.route('/').get(viewController.getAllTour);
viewRouter.route('/:id').get(viewController.getOneTour);

module.exports = viewRouter;
