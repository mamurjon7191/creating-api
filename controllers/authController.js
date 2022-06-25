const User = require('../models/userModel');
const catchErrAsync = require('../utility/catchAsync');

const signup = catchErrAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: 'succes',
    data: newUser,
  });
});

module.exports = { signup };
