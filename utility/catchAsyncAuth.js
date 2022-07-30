const appError = require('./appError');

const catchErrAsyncAuth = (funksiya) => {
  const catchFunc = (req, res, next) => {
    funksiya(req, res, next).catch((err) =>
      next(new appError(err.message, 404))
    );
  };
  return catchFunc;
};

module.exports = catchErrAsyncAuth;
