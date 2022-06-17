const User = require('../models/userModel');

const getAlluser = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({
      status: 'succes',
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};
const postAlluser = async (req, res) => {
  try {
    const data = req.body;
    const postData = await User.create(data);
    res.status(201).json({
      status: 'succes',
      data: postData,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const id = +req.params.id;
    const data = await User.findById(id);
    console.log(req, params.id);
    res.status(200).json({
      status: 'succes',
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.status(204).json({
      status: 'succes',
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(req.body);
    res.status(200).json({
      status: 'succes',
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};
module.exports = {
  getAlluser,
  postAlluser,
  getUserById,
  deleteUser,
  updateUser,
};
