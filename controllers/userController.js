const User = require('../models/userModel');
const catchErrAsync = require('../utility/catchAsync');
const catchErrAsyncAuth = require('../utility/catchAsyncAuth');
const authController = require('./authController');

// -----Sharp faylni sizeni kichraytirish
const sharp = require('sharp');

// -----Sharp faylni sizeni kichraytirish

//---Multer--------
const multer = require('multer'); // -->Fayllarni yuklash uchun req.file

// const multerStorage = multer.diskStorage({
//   // fayl saqlashi uchun kk boladigan funksiya

//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user- user_Id-timeStamp.jpeg bn .jpg ni farqi yoq
//     const ext = file.mimetype.split('/')[1];
//     const fileName = `user-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

const multerStorage = multer.memoryStorage(); // buffer ga saqlab qoyadi tezkor hotiraga

const filterImage = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'You can upload only image format! Sorry about unconvinience',
        false
      )
    );
  }
};

const upload = multer({
  // faylni qayerga saqlashi
  storage: multerStorage,
  fileFilter: filterImage,
});
const uploadUserImage = upload.single('photo'); // biza bergan faylni tutvolib users papkaga joylashini qildik

const resizeImage = async (req, res, next) => {
  const ext = req.file.mimetype.split('/')[1]; // type .jpg .png va hokozo
  req.file.filename = `user-${req.user.id}-${Date.now()}.${ext}`;
  if (!req.file) {
    return next();
  }
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toFile(`${__dirname}/../public/img/users/${req.file.filename}`);
  next();
};

//---Multer--------

const bcrypt = require('bcryptjs');
const AppError = require('../utility/appError');
const { createToken } = require('./authController');
const {
  getAll,
  getOne,
  add,
  update,
  deleteData,
} = require('../controllers/handlerController');

const getAlluser = (req, res, next) => {
  getAll(req, res, next, User);
};

const postAlluser = (req, res, next) => {
  add(req, res, next, User);
};

const getUserById = (req, res, next) => {
  getOne(req, res, next, User);
};

const deleteUser = (req, res, next) => {
  deleteData(req, res, next, User);
};

const updateUser = (req, res, next) => {
  update(req, res, next, User);
};

// Bu saytga kirgandan keyin parolini ozgartirish

const updateMyPassword = catchErrAsyncAuth(async (req, res, next) => {
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

  await user.save({ validateBeforeSave: false });

  const token = createToken(user._id);
  authController.saveTokenCookie(res, token, req);

  res.status(200).json({
    status: 'Succes',
    token: token,
    message: 'Parolingiz ozgardi hursanmisiz',
  });
});

const updateMe = catchErrAsyncAuth(async (req, res, next) => {
  console.log(req.file);
  // 1. Malumotlarni yangilash

  const user = await User.findById(req.user.id);

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.photo = req.file.filename || user.photo;

  const newUser = await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'succes',
    data: newUser,
  });

  next();
});

const deleteMe = catchErrAsyncAuth(async (req, res, next) => {
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
  uploadUserImage,
  resizeImage,
};
