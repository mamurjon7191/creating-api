const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

const checkId = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      message: 'Bunday id topilmadi',
    });
  }
  next();
};
const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Siz name bn priceni unutdingiz',
    });
  }
  next();
};

/// tours controllerlari

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'succes',
    time: req.time,
    results: tours.length,
    data: tours,
  });
};
const postTour = (req, res) => {
  const data = req.body;
  const newId = tours[tours.length - 1].id + 1;
  const newObj = Object.assign({ id: newId }, data);

  tours.push(newObj);

  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'succes',
        data: newObj,
      });
    }
  );
};
const getTourById = (req, res) => {
  const id = req.params.id;
  const data = tours.find((val) => {
    return val.id == id;
  });
  console.log(data);
  if (data) {
    res.status(200).json({
      status: 'Succces',
      data: data,
    });
  }
};

const updateTour = (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: 'Succes',
    message: 'The data has updated',
  });
};
const deleteTour = (req, res) => {
  const id = req.params.id;
  if (id > tours.length) {
    return res.status(404).json({
      message: 'Bunday id topilmadi',
    });
  }
  res.status(200).json({
    status: 'Succes',
    message: 'The data has deleted',
  });
};

module.exports = {
  getAllTours,
  postTour,
  getTourById,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
};
