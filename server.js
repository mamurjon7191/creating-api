process.on('uncaughtException', (err) => {
  // sinxron kodlar uchun xatolarni tutib oladi
  console.log('Error name: ' + err.name);
  console.log('Error Message: ' + err.message);

  // process.exit(1); // process exit ni 1 qisak agar xato chiqsa serverni toxtatadi
});

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log('DB connected');
});

// console.log(process.env); // global ozgaruvchilarni korsatadi

app.listen(process.env.PORT, process.env.SERVER_URL, () => {
  console.log('Server  3000 portda ishga tushdi');
}); // port ///  Ipadress

process.on('unhandledRejection', (err) => {
  // assinxron kodlar uchun serverga borib keladigan kodlar uchun xatolarni tutib oladi ularga catch yozish shartamas
  console.log('Error name: ' + err.name);
  console.log('Error Message: ' + err.message);
});
