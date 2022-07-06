const User = require('../models/userModel');
const catchErrAsync = require('../utility/catchAsync');

const crypto = require('crypto'); // random string yaratib berish bu core modul install qilish shartmas

const bcrypt = require('bcryptjs'); // hashlash uchun kerak

const jwt = require('jsonwebtoken'); // token yaratish uchun kerak

const AppError = require('../utility/appError');

const mail = require('../utility/mail');
const { now } = require('mongoose');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchErrAsync(async (req, res, next) => {
  const newUser = await User.create({
    // sign up qivotganimizda user yana boshqa narsalani qoshvormasligi uchun shunday yozdik
    name: req.body.name,
    password: req.body.password,
    photo: req.body.photo,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
    passwordChangedDate: req.body.passwordChangedDate,
    role: req.body.role,
  });

  // tokenni yasadik
  const token = createToken(newUser._id);

  saveTokenCookie(res, token, req);

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
  }).select('+password');

  if (!user) {
    return next(
      new AppError('Bunday user mavjud emas.Iltimos royhatdan oting')
    );
  }

  // 3.Passwordni solishtirish

  const tekshirHashga = async (oddiyPassword, hashPAssword) => {
    return await bcrypt.compare(oddiyPassword, hashPAssword);
  };

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
  saveTokenCookie(res, token, req);

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

  const tekshir = await jwt.verify(token, process.env.JWT_SECRET); // bu error qaytaradi

  // console.log(tekshir);

  // 3.Tokenni ichidan idni olib data basedagi userlarni id si bilan solishtirish

  const user = await User.findOne({ _id: tekshir.id });

  if (!user) {
    return next(
      new AppError('Bunday user mavjud emas iltimos qayta kiriting', 401)
    );
  }

  // 4 Agar parol ozgargan bolsa tokenni amal qilishi tugagani tekshirish

  if (user.passwordChangedDate) {
    // true bosa kirishi kk
    //user.passwordChangedDate.getTime() / 1000 milli sekundga otkazdik
    console.log(tekshir.iat, user.passwordChangedDate.getTime() / 1000);
    if (tekshir.iat < user.passwordChangedDate.getTime() / 1000) {
      return next(
        new AppError(
          "Siz tokenningiz yaroqzsiz iltimos qayta ro'yhatdan otishingiz kerak",
          401
        )
      );
    }
  }
  console.log(user);
  req.user = user;
  next();
});

const role = (roles) => {
  return catchErrAsync(async (req, res, next) => {
    // 1.Userni rolini olamiz databasedan ,tekshiramiz
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Sizni bu amalni bajarishga imkoniyatingiz yoq', 401)
      );
    }
    next();
  });
};

const forgotPassword = catchErrAsync(async (req, res, next) => {
  // 1.Emailni yozilgan yozilmaganini topish

  if (!req.body.email) {
    return next(new AppError('Emailni kiritishingiz shart'));
  }

  // 2.Database  da shu emailli odam bormi yoqmi qidirish

  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(
      new AppError("Bunday foydalanuvchi ma'lumotlar bazasida mavjud emas", 404)
    );
  }

  // 3.Reset token yaratish buni birinchi random raqamdan foydalanib keyin uni hashlab databasega saqlaymiz sababi database buzilsa ham haker uni korolmaydi

  const token = user.hashTokenMethod();

  await user.save({ validateBeforeSave: false }); // User.save schemada required narsalabor shu narsani oldini olish uchun options yozdik

  console.log(token);

  // 4.User kiritgan emailga reset tokenni jonatish

  const resetLink = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`; //"http:localhost:8000/api/v1/resetPassword/dfsfgdjshgjkashgkjshdgfkjs"

  console.log(token);

  const subject = 'Siz passwordni yangilash uchun link';

  const html = `<h1>Siz passwordni reset qilish uchun shu tugmani bosing</h1><a style="color:red" href='${resetLink}'>Reset password</a>`;

  const to = 'kalandarovjamshid01@gmail.com';

  await mail({ subject, html, to }); // email jonatamiz

  res.status(200).json({
    status: 'succes',
    message: 'Your email has been sent your email',
  });

  next();
});

const resetPassword = catchErrAsync(async (req, res, next) => {
  // 1. tokenni olamiz

  const token = req.params.token;

  const hashToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2. Token tekshiramiz

  const user = await User.findOne({
    resetTokenHash: hashToken,
    resetTokenVaqti: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('Tokenda hatolik mavjud yoki tokenni vaqti tugagan', 404)
    );
  }
  console.log(user);
  // 3.Yangi parol saqlaymiz va passwordChangedDate niyam saqlaymiz

  if (!req.body.password || !req.body.passwordConfirm) {
    return next(
      new AppError('Password yoki password confirmni unutdingiz', 404)
    );
  }
  if (!(req.body.password === req.body.passwordConfirm)) {
    return next(new AppError('Kiritilgan parollar bir biriga mos emas', 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedDate = Date.now();

  user.resetTokenHash = undefined;
  user.resetTokenVaqti = undefined;

  await user.save();

  // 4. Jwt yuboramiz

  const tokenJwt = createToken(user._id);
  saveTokenCookie(res, token, req);

  res.status(200).json({
    status: 'success',
    token: tokenJwt,
    message: 'Parol yangilaydi',
  });

  next();
});

///////////////////////////////////////////--> Cookie yasaymiz <--/////////////////////////////////////////////

const saveTokenCookie = (res, token, req) => {
  res.cookie('jwt', token, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: req.protocol === 'https' ? true : false,
  });
};

///////////////////////////////////////////-->Cookie yasaymiz<--/////////////////////////////////////////////

module.exports = {
  signup,
  login,
  protect,
  role,
  forgotPassword,
  resetPassword,
  createToken,
};

// autentifikatsiya -->login

// autorizatsiya --> saytga kirgandan keyin sizga berilgan vakolat -->userni rollari admin,super-admin moderator
