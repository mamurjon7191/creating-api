const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const errController = require('./controllers/errController');

const path = require('path');

const reviewRouter = require('./routes/reviewRouter');

const app = express();

app.use(express.json({ limit: '10kb' })); // midleware

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'view'));

/////////////////-->For-Security<--//////////////////

//1.
const rateLimit = require('express-rate-limit'); // saytga juda kop sorov jonatishni oldini olish

//2.
const helmet = require('helmet'); // requestni headerini securitysini kuchaytirish

//3
const sanitize = require('express-mongo-sanitize'); // bodyni ichini tekshiradi virus pirus yubormasligini

//4
const xss = require('xss-clean'); // xss atakaga qarshi html ichiga virus tiqib yubormoqchi bolsak shini tekshiradi
//5
const hpp = require('hpp'); // bu urlga ikkita bir xil query yozib qoysak oxirini oladi

//-------------------------------------------------------------------------------

//1.
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: 'Too many requests',
});

// Apply the rate limiting middleware to all requests
app.use('/api', limiter);

//2.
app.use(helmet());
//3.
app.use(sanitize());

//4
app.use(xss());
//5
// app.use(hpp());

/////////////////-->/For-Security<--//////////////////

const AppError = require('./utility/appError');

app.use(morgan('dev'));

// har doim urlni yozganda birinchi / yoziladi esdan chiqmasn kalla

app.use('/api/v1/tours', (req, res, next) => {
  req.time = Date.now();
  // console.log(req.protocol); // http
  // console.log(req.get('host')); // 127.0.0.1:3000
  next();
});

app.use(express.static('public'));

//=------------------
app.use('/home', (req, res, next) => {
  res.status(200).render('base');
});
//=------------------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // all yozganimizni sababi qaysi urlga murojat qilishimizni bilmaymiz
  // const err = {
  //   statusCode: 404,
  //   status: 'fail',
  //   message: `${req.originalUrl} is not defined`, // qaysi url is not defined
  // };
  next(new AppError('This page is not defined', 404)); // biror bir narsani nextni ichiga bervorsak  (tortali argument kiradigan midlwarega) birinchi argument bolib kiradi
});

app.use(errController);

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', postTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

module.exports = app;
