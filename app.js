const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const AppError = require('./utility/appError');

const app = express();

app.use(express.json()); // midleware
app.use(morgan('dev'));

// har doim urlni yozganda birinchi / yoziladi esdan chiqmasn kalla

app.use('/api/v1/tours', (req, res, next) => {
  req.time = Date.now();
  next();
});

app.use(express.static('public'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // all yozganimizni sababi qaysi urlga murojat qilishimizni bilmaymiz
  // const err = {
  //   statusCode: 404,
  //   status: 'fail',
  //   message: `${req.originalUrl} is not defined`, // qaysi url is not defined
  // };
  next(new AppError('This page is not defined', 404)); // biror bir narsani nextni ichiga bervorsak  (tortali argument kiradigan midlwarega) birinchi argument bolib kiradi
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 404;
  err.status = err.status || 'fail';
  err.message = err.message || 'Page is not defined';
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', postTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

module.exports = app;
