const User = require('../models/userModel');
const catchErrAsync = require('../utility/catchAsync');

const getAlluser = catchErrAsync(async (req, res) => {
  const data = await User.find();
  res.status(200).json({
    status: 'succes',
    data: data,
  });
  res.status(404).json({
    status: 'Failed',
    user: req.user,
    message: err,
  });
});
const postAlluser = catchErrAsync(async (req, res) => {
  const data = req.body;
  const postData = await User.create(data);
  res.status(201).json({
    status: 'succes',
    data: postData,
  });
  res.status(404).json({
    status: 'Failed',
    message: err,
  });
});

const getUserById = catchErrAsync(async (req, res) => {
  const id = req.params.id;
  const data = await User.findById(id);
  res.status(200).json({
    status: 'succes',
    data: data,
  });
  console.log(err);
  res.status(404).json({
    status: 'Failed',
    message: err,
  });
});

const deleteUser = catchErrAsync(async (req, res) => {
  const id = req.params.id;
  const data = await User.findByIdAndDelete(id);
  res.status(204).json({
    status: 'succes',
  });

  res.status(404).json({
    status: 'Failed',
    message: err,
  });
});

const updateUser = catchErrAsync(async (req, res) => {
  const id = req.params.id;
  const data = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  console.log(req.body);
  res.status(200).json({
    status: 'succes',
    data: data,
  });

  res.status(404).json({
    status: 'Failed',
    message: err,
  });
});

module.exports = {
  getAlluser,
  postAlluser,
  getUserById,
  deleteUser,
  updateUser,
};
