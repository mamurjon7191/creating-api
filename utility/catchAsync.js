const appError = require('./appError');

const catchErrAsync = (funksiya) => {
  const catchFunc = (req, res, next) => {
    funksiya(req, res).catch((err) => next(new appError(err.message, 404)));
  };
  return catchFunc;
};
module.exports = catchErrAsync;
