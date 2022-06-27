const User = require('../models/userModel');
const catchErrAsync = require('../utility/catchAsync');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const AppError = require('../utility/appError');

const createToken = (id) => {
  return jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchErrAsync(async (req, res, next) => {
  const newUser = await User.create({
    //roleni tashavordik chunki roleni admin qilibham kiradigan userlar bor !
    name: req.body.name,
    password: req.body.password,
    photo: req.body.photo,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
  });

  // tokenni yasadik
  const token = createToken(newUser._id);

  res.status(200).json({
    status: 'succes',
    token: token,
    data: newUser,
  });
});

const login = catchErrAsync(async (req, res, next) => {
  // 1.Email bilan password borligini tekshirish

  const { email, password } = req.body;

  if (!email || !password) {
    // or har doim trueni qidirardi
    return next(new AppError('Email yoki password kiriting xato!', 401));
  }

  // 2.Shunaqa odam bormi yoqmi

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return next(
      new AppError('Bunday user mavjud emas.Iltimos royhatdan oting')
    );
  }

  // 3.Passwordni solishtirish

  const tekshirHashga = async (oddiyPassword, hashPAssword) => {
    return await bcrypt.compare(oddiyPassword, hashPAssword);
  };
  console.log(tekshirHashga(password, user.password));

  if (!(await tekshirHashga(password, user.password))) {
    return next(
      new AppError(
        'Sizning email yoki parolingiz xato iltimos qayta urining',
        401
      )
    );
  }

  // 4.JWT token yasab berish

  const token = createToken(user._id);

  // Response qaytarish

  res.status(200).json({
    status: 'succes',
    token: token,
    message: 'Muvaffaqiyatli otdingiz',
  });

  next();
});

const protect = catchErrAsync(async (req, res, next) => {
  // console.log(req.headers.authorization);

  // 1. Token bor yoqligini tekshirish headerdan

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('Siz birinchi royhatdan oting yoki tizimga kiring')
    );
  }

  // 2.Tokenni tekshirish user olib ketgan token bn serverni tokeni

  const tekshir = await jwt.verify(token, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  if (!tekshir) {
    return next(
      new AppError('Bunday token mavjud emas iltimos qayta urinib koring', 401)
    );
  }
  console.log(tekshir);

  // 3.Tokenni ichidan idni olib data basedagi userlarni id si bilan solishtirish

  // 4.
  next();
});

module.exports = { signup, login, protect };
// FVJiQvjmreLt4k8X4
//"email": "mamur777@gmail.com",
//  "password": "FVJiQvjmreLt4k8X4",
