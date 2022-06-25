// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 404;
  err.status = err.status || 'fail';
  err.message = err.message || 'Page is not defined';

  if (process.env.NODE_ENV == 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  next();
};

console.log(process.env.NODE_ENV);
