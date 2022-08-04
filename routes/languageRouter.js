const languageController = require('../controllers/languageController');

const express = require('express');

const languageRouter = express.Router({ mergeParams: true });

languageRouter
  .route('/')
  .get(languageController.getAllLanguage)
  .post(languageController.addLanguage);

languageRouter
  .route('/:id')
  .get(languageController.getOneLanguage)
  .patch(languageController.updateLanguage)
  .delete(languageController.deleteLanguage);

module.exports = languageRouter;
