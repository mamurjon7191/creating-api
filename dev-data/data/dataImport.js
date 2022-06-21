const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const fs = require('fs');
const Tour = require('../../models/tourModel');
const { path } = require('../../app');

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log('Db connected');
  })
  .catch((err) => {
    console.log(err);
  });

const data = JSON.parse(
  fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8')
);
// console.log(data);

const addData = async () => {
  try {
    const data12 = await Tour.create(data);
    console.log('Fayllar yozildi');
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    const data = await Tour.deleteMany();
    console.log('Fayllar ochirildi');
  } catch (err) {
    console.log(err);
  }
};

// deleteData();
addData();

// console.log(data);
