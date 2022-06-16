/// tours controllerlari
const Tour = require('../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    const tour = await Tour.find();
    res.status(200).json({
      status: 'succces',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'succes',
      message: err,
    });
  }
};

const postTour = async (req, res) => {
  try {
    const data = req.body;
    // const newTour = new Tour(data);
    // newTour.save();
    const tour = await Tour.create(data);

    res.status(200).json({
      status: 'succes',
      data: tour,
    });
  } catch (err) {
    console.log(err);
  }
};
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(400).json({
      status: 'succes',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 'succes',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'succes',
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

module.exports = {
  getAllTours,
  postTour,
  getTourById,
  updateTour,
  deleteTour,
};
