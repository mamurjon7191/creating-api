const reviewController = require('../controllers/reviewController');
const express = require('express');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.addReviews);

module.exports = router;
