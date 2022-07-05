const User = require('../models/userModel');
const catchErrAsync = require('../utility/catchAsync');

const bcrypt = require('bcryptjs');
const AppError = require('../utility/appError');
const { createToken } = require('./authController');

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

// Bu saytga kirgandan keyin parolini ozgartirish

const updateMyPassword = catchErrAsync(async (req, res, next) => {
  // 1. Eski password kiritilganmi yoki yoqmi

  if (!req.body.oldPassword) {
    return next(new AppError('Siz eski parolni kiritishingiz shart'));
  }

  const user = await User.findById(req.user.id).select('+password');

  console.log(user);

  const tekshir = await bcrypt.compare(req.body.oldPassword, user.password);

  if (!tekshir) {
    return next(
      new AppError(
        'Eski parolingiz xato iltimos togri eski parol kiriting',
        401
      )
    );
  }

  // 2. Yangi parolni saqlaymiz

  if (req.body.newPassword != req.body.confirmNewPassword) {
    return next(
      new AppError(
        'Siz ikki xil parol kiritib qoydingiz iltimos bir xil parol qoying',
        401
      )
    );
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmNewPassword;
  user.passwordChangedDate = Date.now();
  await user.save();

  const token = createToken(user._id);

  res.status(200).json({
    status: 'Succes',
    token: token,
    message: 'Parolingiz ozgardi hursanmisiz',
  });
});

const updateMe = catchErrAsync(async (req, res, next) => {
  // 1. Malumotlarni yangilash

  const user = await User.findById(req.user.id);

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.photo = req.body.photo || user.photo;

  const newUser = await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'succes',
    data: newUser,
  });

  next();
});

const deleteMe = catchErrAsync(async (req, res, next) => {
  // User ni topamiz

  const user = await User.findById(req.user.id).select('+active +password');

  const tekshir = bcrypt.compare(req.body.password, user.password);

  if (!tekshir) {
    return next(new AppError('Siz parolni xato kiritdingiz', 401));
  }

  user.active = false;

  await user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: 'succes',
    message: 'User ochirildi',
  });
});

// Security best practise

module.exports = {
  getAlluser,
  postAlluser,
  getUserById,
  deleteUser,
  updateUser,
  updateMyPassword,
  updateMe,
  deleteMe,
};
