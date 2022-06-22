const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

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
  res.status(400).json({
    status: 'fail',
    message: 'Siz mavjud bolmagan routega murojat qildingiz',
  });
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', postTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

module.exports = app;
