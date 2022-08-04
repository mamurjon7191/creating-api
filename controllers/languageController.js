const Language = require('../models/languageModel');
const {
  getAll,
  getOne,
  add,
  update,
  deleteData,
} = require('../controllers/handlerController');

const getAllLanguage = (req, res, next) => {
  getAll(req, res, next, Language);
};

const getOneLanguage = (req, res, next) => {
  getOne(req, res, next, Language);
};

const addLanguage = (req, res, next) => {
  add(req, res, next, Language);
};

const updateLanguage = (req, res, next) => {
  update(req, res, next, Language);
};

const deleteLanguage = (req, res, next) => {
  deleteData(req, res, next, Language);
};

module.exports = {
  getAllLanguage,
  getOneLanguage,
  addLanguage,
  updateLanguage,
  deleteLanguage,
};
