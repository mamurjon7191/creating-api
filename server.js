const app = require('./app');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.log(err);
  });

const tourScheme = new mongoose.Schema({});

// console.log(process.env); // global ozgaruvchilarni korsatadi

app.listen(process.env.PORT, process.env.SERVER_URL, () => {
  console.log('Server  3000 portda ishga tushdi');
}); // port ///  Ipadress
