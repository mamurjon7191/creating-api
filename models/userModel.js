const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const crypto = require('crypto'); //bu node js ni defaoult holatidagi moduli random un kk

const validator = require('validator'); //emailni ishlatish uchun kutubxonani yuklab oldik

const userScheme = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: [3, 'Siz eng kamida 3 ta symbol ishlata olasiz'],
    maxlength: [12, 'Siz eng kopida 12 ta symbol ishlata olasiz'],
  },
  email: {
    type: String,
    required: [true, 'Email kiritishingiz shart'],
    unique: [true, 'Siz oldin foydalanilgan email kiritdingiz'],
    lowercase: true, // emailni kichkina harfga otkazadi
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: 'Iltimos togri email kiriting!',
    },
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'moderator', 'team-lead', 'admin'],
    default: 'user',
    required: [true, 'Siz roleni kiritishingiz kerak'],
  },
  password: {
    type: String,
    required: [true, 'Siz passwordni kiritishingiz shart'],
    minlength: [8, 'Eng kamida 8 ta symbol ishlata olasiz'],
    maxlengt: [16, 'Eng kopida 16 ta symbol ishlata olasiz'],
    validate: {
      validator: function (val) {
        return validator.isStrongPassword(val);
      },
      message: 'Iltimos togri password kiriting!',
    },
    select: false, //responsega kemaydi lekin databasega yozadi password hich qachon kelishi keremas umuman
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: 'Iltimos siz bir xil password kiriting',
    },
  },
  passwordChangedDate: {
    type: Date,
    default: null,
  },
  resetTokenHash: String,
  resetTokenVaqti: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userScheme.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hashPassword = await bcrypt.hash(this.password, 12);

  this.password = hashPassword;

  this.passwordConfirm = undefined; // pasword confirm bizga keremas shuning uchun databasega saqlash kerak emas shuning uchun undefined qib beramiz

  next();
});

userScheme.pre(/^find/, async function (next) {
  // oldidan ^ qoysak find sozi bn boshlanadigan metodlardan oldin shu midlware ishlaydi
  this.find({ active: { $ne: false } });

  next();
});

userScheme.methods.hashTokenMethod = function () {
  const token = crypto.randomBytes(32).toString('hex'); // random raqamni yaratib beradi -->hex dgani ham harf ham son qatnashadi

  const hashToken = crypto.createHash('sha256').update(token).digest('hex');

  this.resetTokenHash = hashToken;

  this.resetTokenVaqti = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model('users', userScheme);

module.exports = User;
